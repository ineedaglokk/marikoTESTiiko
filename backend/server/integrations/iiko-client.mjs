const IIKO_BASE_URL = process.env.IIKO_BASE_URL || "https://api-ru.iiko.services";
const IIKO_TIMEOUT_MS = Number.parseInt(process.env.IIKO_TIMEOUT_MS ?? "", 10) || 15000;
const IIKO_TOKEN_TTL_MS = Number.parseInt(process.env.IIKO_TOKEN_TTL_MS ?? "", 10) || 10 * 60 * 1000;

const tokenCache = new Map();

const normalisePhone = (value) => {
  if (typeof value !== "string") {
    return null;
  }
  const digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("8")) {
    return `+7${digits.slice(1)}`;
  }
  if (!digits.startsWith("+") && digits.length === 11 && digits.startsWith("7")) {
    return `+${digits}`;
  }
  return digits || null;
};

const requestJson = async (url, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? IIKO_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    const text = await response.text();
    let payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch (error) {
        throw new Error(`iiko: Некорректный ответ JSON (${error.message})`);
      }
    }
    if (!response.ok) {
      const message = payload?.message || payload?.error?.message || response.statusText;
      const error = new Error(message || "iiko API error");
      error.response = payload;
      error.status = response.status;
      throw error;
    }
    return payload;
  } finally {
    clearTimeout(timer);
  }
};

const getTokenCacheKey = (login) => login || "default";

const fetchAccessToken = async (apiLogin) => {
  if (!apiLogin) {
    throw new Error("iiko: api_login отсутствует");
  }
  const payload = { apiLogin };
  const url = `${IIKO_BASE_URL}/api/1/access_token`;
  const response = await requestJson(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response?.token) {
    throw new Error("iiko: Не удалось получить access token");
  }
  const ttl = Number.parseInt(response?.token_lifetime ?? "", 10);
  const expiresAt = Date.now() + (Number.isFinite(ttl) ? ttl * 1000 : IIKO_TOKEN_TTL_MS);
  return { token: response.token, expiresAt };
};

const ensureAccessToken = async (apiLogin) => {
  const cacheKey = getTokenCacheKey(apiLogin);
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now() + 5000) {
    return cached.token;
  }
  const fresh = await fetchAccessToken(apiLogin);
  tokenCache.set(cacheKey, fresh);
  return fresh.token;
};

const buildIikoDeliveryPayload = (config, order) => {
  const items = (order.items ?? []).map((item) => ({
    productId: item.iiko_product_id || item.id, // поддержка маппинга iiko ID
    type: "Product",
    amount: item.amount ?? item.quantity ?? 1,
    price: item.price ?? 0,
    comment: item.name,
  }));

  const phone = normalisePhone(order.customer_phone);
  const customerName = order.customer_name || order.customerName || "Гость";

  const payments =
    config.default_payment_type && (order.total || order.subtotal)
      ? [
          {
            paymentTypeId: config.default_payment_type,
            sum: Number(order.total ?? order.subtotal ?? 0),
            isProcessedExternally: true,
          },
        ]
      : undefined;

  // Определяем тип заказа для iiko
  const isDelivery = order.order_type === "delivery";
  const orderServiceType = isDelivery ? "DeliveryByCourier" : "DeliveryByClient"; // DeliveryByClient = самовывоз

  const payload = {
    organizationId: config.iiko_organization_id,
    terminalGroupId: config.iiko_terminal_group_id,
    createOrderSettings: {
      transportToFrontTimeout: 40,
    },
    order: {
      orderServiceType,
      sourceKey: config.source_key ?? undefined,
      phone,
      customer: {
        name: customerName,
        phone,
      },
      comment: order.comment ?? undefined,
      items,
      payments,
    },
  };

  // Добавляем адрес доставки только для delivery
  if (isDelivery && order.delivery_address) {
    payload.order.deliveryPoint = {
      address: {
        street: {
          name: order.delivery_street || order.delivery_address,
        },
        house: order.delivery_house || "1",
      },
      comment: order.delivery_address,
    };

    if (config.delivery_terminal_id) {
      payload.order.deliveryPoint.terminalId = config.delivery_terminal_id;
    }
  }

  return payload;
};

export const iikoClient = {
  /**
   * Создаёт заказ доставки в iiko через Cloud API
   * Использует endpoint /api/1/deliveries/create
   */
  async createOrder(config, order) {
    if (!config?.iiko_organization_id || !config?.iiko_terminal_group_id) {
      return {
        success: false,
        error: "iiko: Не заполнены organization/terminal IDs",
      };
    }
    if (!config?.api_login) {
      return {
        success: false,
        error: "iiko: Не указан api_login",
      };
    }

    try {
      const token = await ensureAccessToken(config.api_login);
      const payload = buildIikoDeliveryPayload(config, order);

      // Используем deliveries/create для заказов доставки/самовывоза
      const url = `${IIKO_BASE_URL}/api/1/deliveries/create`;
      const response = await requestJson(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const orderId = response?.orderInfo?.id || response?.id || null;
      const status = response?.orderInfo?.state || response?.orderInfo?.status || null;

      return {
        success: true,
        orderId,
        status,
        payload,
        response,
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || "iiko: Ошибка создания заказа",
        response: error?.response,
      };
    }
  },

  /**
   * Получает номенклатуру (меню) из iiko
   */
  async getNomenclature(config) {
    if (!config?.iiko_organization_id || !config?.api_login) {
      return { success: false, error: "iiko: Не указаны organization_id или api_login" };
    }

    try {
      const token = await ensureAccessToken(config.api_login);
      const url = `${IIKO_BASE_URL}/api/1/nomenclature`;
      const response = await requestJson(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ organizationId: config.iiko_organization_id }),
      });

      return {
        success: true,
        products: response?.products ?? [],
        groups: response?.groups ?? [],
        categories: response?.productCategories ?? [],
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || "iiko: Ошибка получения номенклатуры",
      };
    }
  },

  /**
   * Получает типы оплаты из iiko
   */
  async getPaymentTypes(config) {
    if (!config?.iiko_organization_id || !config?.api_login) {
      return { success: false, error: "iiko: Не указаны organization_id или api_login" };
    }

    try {
      const token = await ensureAccessToken(config.api_login);
      const url = `${IIKO_BASE_URL}/api/1/payment_types`;
      const response = await requestJson(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ organizationIds: [config.iiko_organization_id] }),
      });

      return {
        success: true,
        paymentTypes: response?.paymentTypes ?? [],
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || "iiko: Ошибка получения типов оплаты",
      };
    }
  },
};
