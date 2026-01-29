/**
 * Статические данные городов для миграции
 */
export const cities = [
  {
    id: "nizhny-novgorod",
    name: "Нижний Новгород",
    restaurants: [
      { id: "nn-rozh", name: "Хачапури Марико", address: "Рождественская, 39" },
      { id: "nn-park", name: "Хачапури Марико", address: "Парк Швейцария" },
      { id: "nn-volga", name: "Хачапури Марико", address: "Волжская набережная, 23а" },
    ],
  },
  {
    id: "saint-petersburg",
    name: "Санкт-Петербург",
    restaurants: [
      { id: "spb-sadovaya", name: "Хачапури Марико", address: "Малая Садовая, 3/54" },
      { id: "spb-sennaya", name: "Хачапури Марико", address: "Сенная, 5" },
      { id: "spb-morskaya", name: "Хачапури Марико", address: "Малая Морская, 5а" },
      { id: "spb-italyanskaya", name: "Хачапури Марико", address: "Итальянская, 6/4" },
    ],
  },
  {
    id: "kazan",
    name: "Казань",
    restaurants: [
      { id: "kazan-bulachnaya", name: "Хачапури Марико", address: "Право-Булачная, 33" },
      { id: "kazan-pushkina", name: "Хачапури Марико", address: "Пушкина, 10" },
    ],
  },
  {
    id: "kemerovo",
    name: "Кемерово",
    restaurants: [
      { id: "kemerovo-krasnoarmeyskaya", name: "Хачапури Марико", address: "Красноармейская, 144" },
    ],
  },
  {
    id: "tomsk",
    name: "Томск",
    restaurants: [
      { id: "tomsk-batenkova", name: "Хачапури Марико", address: "Переулок Батенькова, 7" },
    ],
  },
  {
    id: "smolensk",
    name: "Смоленск",
    restaurants: [
      { id: "smolensk-nikolaeva", name: "Хачапури Марико", address: "Николаева, 12а, ТЦ «Центрум»" },
    ],
  },
  {
    id: "kaluga",
    name: "Калуга",
    restaurants: [
      { id: "kaluga-kirova", name: "Хачапури Марико", address: "Кирова, 39, ТЦ «Европейский»" },
    ],
  },
  {
    id: "samara",
    name: "Самара",
    restaurants: [
      { id: "samara-kuibysheva", name: "Хачапури Марико", address: "Куйбышева, 89" },
      { id: "samara-galaktionovskaya", name: "Хачапури Марико", address: "Галактионовская, 39" },
    ],
  },
  {
    id: "novosibirsk",
    name: "Новосибирск",
    restaurants: [
      { id: "novosibirsk-sovetskaya", name: "Хачапури Марико", address: "Советская, 64" },
      { id: "novosibirsk-sovetov", name: "Хачапури Марико", address: "Советов, 51" },
    ],
  },
  {
    id: "magnitogorsk",
    name: "Магнитогорск",
    restaurants: [
      { id: "magnitogorsk-zavenyagina", name: "Хачапури Марико", address: "Завенягина, 4б" },
    ],
  },
  {
    id: "balakhna",
    name: "Балахна",
    restaurants: [
      { id: "balakhna-sovetskaya", name: "Хачапури Марико", address: "Советская площадь, 16" },
    ],
  },
  {
    id: "kstovo",
    name: "Кстово",
    restaurants: [
      { id: "kstovo-lenina", name: "Хачапури Марико", address: "Ленина, 5" },
    ],
  },
  {
    id: "lesnoy-gorodok",
    name: "Лесной Городок",
    restaurants: [
      { id: "lesnoy-shkolnaya", name: "Хачапури Марико", address: "Школьная, 1" },
    ],
  },
  {
    id: "novorossiysk",
    name: "Новороссийск",
    restaurants: [
      { id: "novorossiysk-sovetov", name: "Хачапури Марико", address: "Советов, 51" },
    ],
  },
  {
    id: "zhukovsky",
    name: "Жуковский",
    restaurants: [
      { id: "zhukovsky-myasishcheva", name: "Хачапури Марико", address: "Мясищева, 1" },
    ],
  },
  {
    id: "odintsovo",
    name: "Одинцово",
    restaurants: [
      { id: "odintsovo-mozhayskoe", name: "Хачапури Марико", address: "Можайское шоссе, 122" },
    ],
  },
  {
    id: "neftekamsk",
    name: "Нефтекамск",
    restaurants: [
      { id: "neftekamsk-parkovaya", name: "Хачапури Марико", address: "Парковая, 12" },
    ],
  },
  {
    id: "penza",
    name: "Пенза",
    restaurants: [
      { id: "penza-zasechnoe", name: "Хачапури Марико", address: "с. Засечное, Прибрежный, 2А" },
    ],
  },
  {
    id: "astana",
    name: "Астана",
    restaurants: [
      { id: "astana-koshkarbaeva", name: "Хачапури Марико", address: "Рахимжана Кошкарбаева, 27" },
    ],
  },
  {
    id: "atyrau",
    name: "Атырау",
    restaurants: [
      { id: "atyrau-avangard", name: "Хачапури Марико", address: "м-рн Авангард, 3, строение 76а" },
    ],
  },
  {
    id: "volgograd",
    name: "Волгоград",
    restaurants: [
      { id: "volgograd-raboche-krestyanskaya", name: "Хачапури Марико", address: "Рабоче-Крестьянская, 10" },
    ],
  },
  {
    id: "bugulma",
    name: "Бугульма",
    restaurants: [
      { id: "bugulma-tukhachevskogo", name: "Хачапури Марико", address: "Тухачевского, 3в (скоро)" },
    ],
  },
  {
    id: "ufa",
    name: "Уфа",
    restaurants: [
      { id: "ufa-bikbaya", name: "Хачапури Марико", address: "Баязита Бикбая, 26" },
    ],
  },
  {
    id: "saransk",
    name: "Саранск",
    restaurants: [
      { id: "saransk-kommunisticheskaya", name: "Хачапури Марико", address: "Коммунистическая, 59а (скоро)" },
    ],
  },
];
