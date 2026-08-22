import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Review } from '../../types';
import { ReviewCard } from './ReviewCard';
import { dataService } from '../../services/dataService';

interface ReviewCarouselProps {
  reviews: Review[];
}

export const ReviewCarousel: React.FC<ReviewCarouselProps> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // We can show 3 on desktop, 2 on tablet, 1 on mobile
  // For simplicity, we just use a CSS grid that overflows, or a controlled slide
  // Let's do a simple flex overflow with snap for modern UX
  
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="relative group">
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar">
        {reviews.map((review) => (
          <div key={review.id} className="w-full min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-start">
            <ReviewCard 
              review={review} 
              onHelpful={async (id) => {
                await dataService.voteHelpful(id);
              }}
              onReport={async (id) => {
                await dataService.reportReview(id);
                alert("Review reported successfully. Our moderation team will check it.");
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Visual cue that it's scrollable on desktop */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-8 w-24 bg-gradient-to-l from-slate-50 dark:from-[#060B18] to-transparent pointer-events-none" />
    </div>
  );
};
