import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  label?: string;
}

function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 22,
  label = "Product rating",
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = readOnly ? value : hoverValue || value;
  const clampedValue = Math.max(0, Math.min(5, displayValue));

  if (readOnly) {
    return (
      <div className="star-rating star-rating-readonly" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} size={size} fill={index + 1 <= Math.round(clampedValue) ? "var(--rating)" : "none"} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="star-rating star-rating-interactive"
      role="radiogroup"
      aria-label={label}
      onMouseLeave={() => setHoverValue(0)}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const selected = starValue <= clampedValue;
        return (
          <button
            type="button"
            key={starValue}
            className="star-rating-button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`Rate ${starValue} ${starValue === 1 ? "star" : "stars"}`}
            onMouseEnter={() => setHoverValue(starValue)}
            onFocus={() => setHoverValue(starValue)}
            onBlur={() => setHoverValue(0)}
            onClick={() => onChange?.(starValue)}
          >
            <Star size={size} fill={selected ? "var(--rating)" : "none"} />
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
