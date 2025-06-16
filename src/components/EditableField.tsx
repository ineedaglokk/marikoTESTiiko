import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableFieldProps {
  value: string;
  onEdit?: () => void;
  className?: string;
}

export const EditableField = ({
  value,
  onEdit,
  className,
}: EditableFieldProps) => {
  return (
    <div
      className={cn(
        "bg-mariko-secondary/80 backdrop-blur-sm rounded-[90px] px-6 md:px-8 py-4 md:py-6 flex items-center justify-between text-white font-el-messiri text-xl md:text-2xl font-semibold tracking-tight transition-all hover:bg-mariko-secondary/90",
        className,
      )}
    >
      <span className="flex-1">{value}</span>
      <button
        onClick={onEdit}
        className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Редактировать"
      >
        <Edit className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>
    </div>
  );
};
