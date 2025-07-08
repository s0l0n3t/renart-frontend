
interface StarRatingProps {
  rating: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ rating, color = '#f6d5a8', size = 'sm' }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      {}
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-300" style={{ color }}>
          ★
        </span>
      ))}
      
      {}
      {hasHalfStar && (
        <span key="half" className="relative">
          <span className="text-gray-300">★</span>
          <span 
            className="absolute left-0 top-0 w-1/2 overflow-hidden text-yellow-300"
            style={{ color }}
          >
            ★
          </span>
        </span>
      )}
      
      {}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>
      ))}
      
      {}
      <span className="ml-1 text-gray-600 text-sm">
        {rating.toFixed(1)}/5
      </span>
    </div>
  );
};

export default StarRating;