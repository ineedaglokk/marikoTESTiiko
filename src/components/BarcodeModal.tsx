import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardNumber?: string;
}

export const BarcodeModal = ({
  isOpen,
  onClose,
  cardNumber = "640509 040147",
}: BarcodeModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-mariko-primary/80 backdrop-blur-md" />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-xs md:max-w-md mx-3 md:mx-4 bg-mariko-primary rounded-2xl md:rounded-3xl p-4 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Barcode Container */}
        <div className="flex flex-col items-center justify-center min-h-[280px] md:min-h-[400px] space-y-4 md:space-y-8">
          {/* Barcode */}
          <div className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl">
            <div className="flex flex-col items-center space-y-4">
              {/* Barcode Lines */}
              <div className="flex items-end space-x-1 h-20 md:h-32">
                {Array.from({ length: 40 }, (_, i) => {
                  const heights = [
                    "h-24",
                    "h-32",
                    "h-20",
                    "h-28",
                    "h-16",
                    "h-32",
                    "h-24",
                    "h-20",
                    "h-32",
                    "h-16",
                    "h-28",
                    "h-24",
                    "h-32",
                    "h-20",
                    "h-16",
                    "h-32",
                    "h-24",
                    "h-28",
                    "h-20",
                    "h-32",
                    "h-16",
                    "h-24",
                    "h-32",
                    "h-20",
                    "h-28",
                    "h-16",
                    "h-32",
                    "h-24",
                    "h-20",
                    "h-32",
                    "h-16",
                    "h-28",
                    "h-24",
                    "h-32",
                    "h-20",
                    "h-16",
                    "h-32",
                    "h-24",
                    "h-28",
                    "h-20",
                  ];
                  const widths = [
                    "w-1",
                    "w-0.5",
                    "w-1",
                    "w-0.5",
                    "w-1.5",
                    "w-0.5",
                    "w-1",
                    "w-1.5",
                    "w-0.5",
                    "w-1",
                  ];
                  return (
                    <div
                      key={i}
                      className={cn(
                        "bg-black",
                        heights[i % heights.length],
                        widths[i % widths.length],
                      )}
                    />
                  );
                })}
              </div>

              {/* Barcode Number */}
              <div className="text-black font-mono text-lg md:text-2xl font-bold tracking-wider">
                {cardNumber}
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={onClose}
            className="bg-mariko-primary border-2 border-white rounded-[45px] md:rounded-[90px] px-6 md:px-8 py-2 md:py-3 text-white font-el-messiri text-lg md:text-xl font-bold tracking-tight hover:bg-white hover:text-mariko-primary transition-colors"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  );
};
