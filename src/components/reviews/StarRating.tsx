import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readonly = false,
  size = 'md',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const currentSize = starSizes[size];
  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={readonly}
          whileHover={readonly ? {} : { scale: 1.2 }}
          whileTap={readonly ? {} : { scale: 0.9 }}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(null)}
          onClick={() => !readonly && onChange?.(star)}
          className={`${
            readonly ? 'cursor-default' : 'cursor-pointer'
          } focus:outline-none transition-colors duration-200`}
        >
          <Star
            className={`${currentSize} ${
              star <= displayValue
                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                : 'fill-slate-200 text-slate-200 dark:fill-[#104D39] dark:text-[#104D39]'
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
};
