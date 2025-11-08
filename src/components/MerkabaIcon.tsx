import React from 'react';

const MerkabaIcon: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Merkaba - Star Tetrahedron */}
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        {/* Upper tetrahedron */}
        <path d="M50 15 L25 65 L75 65 Z" opacity="0.8" />
        <path d="M50 15 L25 65 L50 50 Z" opacity="0.6" />
        <path d="M50 15 L75 65 L50 50 Z" opacity="0.6" />
        <path d="M25 65 L75 65 L50 50 Z" opacity="0.4" />
        
        {/* Lower tetrahedron (inverted) */}
        <path d="M50 85 L25 35 L75 35 Z" opacity="0.8" />
        <path d="M50 85 L25 35 L50 50 Z" opacity="0.6" />
        <path d="M50 85 L75 35 L50 50 Z" opacity="0.6" />
        <path d="M25 35 L75 35 L50 50 Z" opacity="0.4" />
        
        {/* Center point */}
        <circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.9" />
        
        {/* Energy lines */}
        <path d="M50 15 L50 85" opacity="0.3" strokeDasharray="2,2" />
        <path d="M25 35 L75 65" opacity="0.3" strokeDasharray="2,2" />
        <path d="M75 35 L25 65" opacity="0.3" strokeDasharray="2,2" />
      </g>
    </svg>
  );
};

export default MerkabaIcon;