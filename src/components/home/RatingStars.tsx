import React, { useState } from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  value: number;
  onChange?: (val: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const LABELS: Record<number, string> = {
  1: "1 estrela - Muito insatisfeito",
  2: "2 estrelas - Regular",
  3: "3 estrelas - Bom",
  4: "4 estrelas - Muito bom",
  5: "5 estrelas - Excelente / Perfeito!",
};

export function RatingStars({
  value,
  onChange,
  readOnly = false,
  size = "md",
  showLabel = false,
}: RatingStarsProps) {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  const displayVal = hoverVal !== null ? hoverVal : value;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }[size];

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div
        className="flex items-center gap-1"
        role={readOnly ? undefined : "radiogroup"}
        aria-label="Avaliação em estrelas de 1 a 5"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayVal;

          if (readOnly) {
            return (
              <Star
                key={star}
                className={`${sizeClasses} transition-colors ${
                  isFilled
                    ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                    : "fill-transparent text-slate-300 dark:text-slate-600"
                }`}
                aria-hidden="true"
              />
            );
          }

          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`Nota ${star} de 5 - ${LABELS[star]}`}
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => setHoverVal(star)}
              onMouseLeave={() => setHoverVal(null)}
              onFocus={() => setHoverVal(star)}
              onBlur={() => setHoverVal(null)}
              className="p-1 rounded-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Star
                className={`${sizeClasses} transition-all duration-150 ${
                  isFilled
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]"
                    : "fill-transparent text-slate-300 hover:text-amber-300 dark:text-slate-600"
                }`}
              />
            </button>
          );
        })}
      </div>

      {showLabel && displayVal > 0 && (
        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
          {LABELS[displayVal]}
        </span>
      )}
    </div>
  );
}
