import React from 'react';

const MeditationFigure: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Meditation figure */}
      <g stroke="currentColor" strokeWidth="2" fill="none">
        {/* Head */}
        <circle cx="50" cy="25" r="8" />
        
        {/* Body */}
        <path d="M50 33 L50 55" />
        
        {/* Arms in meditation pose */}
        <path d="M42 45 Q35 40 30 45 Q35 50 42 45" />
        <path d="M58 45 Q65 40 70 45 Q65 50 58 45" />
        
        {/* Legs in lotus position */}
        <path d="M45 55 Q35 65 25 60" />
        <path d="M55 55 Q65 65 75 60" />
        <path d="M45 55 Q40 70 50 75 Q60 70 55 55" />
        
        {/* Aura/energy field */}
        <ellipse cx="50" cy="50" rx="35" ry="40" opacity="0.3" strokeDasharray="2,2" />
        
        {/* Chakra points */}
        <circle cx="50" cy="22" r="1.5" fill="currentColor" opacity="0.7" />
        <circle cx="50" cy="30" r="1.5" fill="currentColor" opacity="0.7" />
        <circle cx="50" cy="38" r="1.5" fill="currentColor" opacity="0.7" />
        <circle cx="50" cy="46" r="1.5" fill="currentColor" opacity="0.7" />
      </g>
    </svg>
  );
};

export default MeditationFigure;