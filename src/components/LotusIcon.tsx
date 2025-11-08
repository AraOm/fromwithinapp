import React from 'react';

const LotusIcon: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lotus flower in silver */}
      <g stroke="#C0C0C0" strokeWidth="1.5" fill="#C0C0C0" fillOpacity="0.1">
        {/* Outer petals */}
        <path d="M50 20 Q35 35 30 50 Q35 45 50 40 Q65 45 70 50 Q65 35 50 20" />
        <path d="M20 50 Q35 35 50 30 Q45 45 40 50 Q45 65 50 70 Q35 65 20 50" />
        <path d="M80 50 Q65 35 50 30 Q55 45 60 50 Q55 65 50 70 Q65 65 80 50" />
        <path d="M50 80 Q35 65 30 50 Q35 55 50 60 Q65 55 70 50 Q65 65 50 80" />
        
        {/* Inner petals */}
        <path d="M50 30 Q40 40 35 50 Q40 45 50 45 Q60 45 65 50 Q60 40 50 30" />
        <path d="M30 50 Q40 40 50 35 Q45 45 45 50 Q45 60 50 65 Q40 60 30 50" />
        <path d="M70 50 Q60 40 50 35 Q55 45 55 50 Q55 60 50 65 Q60 60 70 50" />
        <path d="M50 70 Q40 60 35 50 Q40 55 50 55 Q60 55 65 50 Q60 60 50 70" />
        
        {/* Center */}
        <circle cx="50" cy="50" r="8" fill="#C0C0C0" fillOpacity="0.3" />
        <circle cx="50" cy="50" r="4" fill="#C0C0C0" fillOpacity="0.6" />
        <circle cx="50" cy="50" r="2" fill="#C0C0C0" />
      </g>
    </svg>
  );
};

export { LotusIcon };
export default LotusIcon;