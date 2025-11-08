import React from 'react';

const SeamlessMeditationFigure: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Meditation figure with seamless blending */}
      <g stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8">
        {/* Head */}
        <circle cx="50" cy="25" r="7" strokeWidth="2" />
        
        {/* Body */}
        <path d="M50 32 L50 54" strokeWidth="2" />
        
        {/* Arms in meditation pose */}
        <path d="M42 44 Q36 39 31 44 Q36 49 42 44" strokeWidth="1.8" />
        <path d="M58 44 Q64 39 69 44 Q64 49 58 44" strokeWidth="1.8" />
        
        {/* Legs in lotus position */}
        <path d="M46 54 Q37 63 28 59" strokeWidth="1.8" />
        <path d="M54 54 Q63 63 72 59" strokeWidth="1.8" />
        <path d="M46 54 Q41 68 50 73 Q59 68 54 54" strokeWidth="1.8" />
        
        {/* Subtle energy lines - very light */}
        <path d="M50 20 Q45 15 50 10 Q55 15 50 20" opacity="0.3" strokeWidth="1" />
        <ellipse cx="50" cy="50" rx="32" ry="38" opacity="0.2" strokeDasharray="3,3" strokeWidth="1" />
        
        {/* Minimal chakra points */}
        <circle cx="50" cy="22" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="50" cy="30" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="50" cy="38" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="50" cy="46" r="1" fill="currentColor" opacity="0.5" />
      </g>
    </svg>
  );
};

export default SeamlessMeditationFigure;