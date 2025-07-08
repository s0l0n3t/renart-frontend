import React from 'react';

interface ArrowProps {
  onClick?: () => void;
}

export const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <div 
    className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 cursor-pointer"
    onClick={onClick}
  >
    <span className="material-symbols-outlined text-gray-800">
      arrow_forward_ios
    </span>
  </div>
);

export const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <div 
    className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 cursor-pointer "
    onClick={onClick}
  >
    <span className="material-symbols-outlined text-gray-800">
      arrow_back_ios
    </span>
  </div>
);