import React from 'react';

const SpiralIcon: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Calming spiral */}
      <g stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8">
        {/* Outer spiral */}
        <path d="M50 10 Q80 20 85 50 Q80 80 50 85 Q20 80 15 50 Q20 20 50 25 Q70 30 72 50 Q70 70 50 72 Q30 70 28 50 Q30 30 50 32 Q60 35 62 50 Q60 65 50 67 Q40 65 38 50 Q40 35 50 37 Q55 40 57 50 Q55 60 50 62 Q45 60 43 50 Q45 40 50 42" />
        
        {/* Inner glow effect */}
        <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="50" cy="50" r="1.5" fill="currentColor" opacity="0.9" />
      </g>
      
      {/* Subtle outer ring */}
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
    </svg>
  );
};

export default SpiralIcon;