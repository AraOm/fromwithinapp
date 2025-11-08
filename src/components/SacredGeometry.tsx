import React from 'react';

const SacredGeometry: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Flower of Life Pattern */}
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        {/* Center circle */}
        <circle cx="50" cy="50" r="12" />
        
        {/* Six surrounding circles */}
        <circle cx="50" cy="29" r="12" />
        <circle cx="68" cy="39.5" r="12" />
        <circle cx="68" cy="60.5" r="12" />
        <circle cx="50" cy="71" r="12" />
        <circle cx="32" cy="60.5" r="12" />
        <circle cx="32" cy="39.5" r="12" />
        
        {/* Outer ring of circles */}
        <circle cx="50" cy="8" r="12" opacity="0.6" />
        <circle cx="79" cy="18.5" r="12" opacity="0.6" />
        <circle cx="89" cy="50" r="12" opacity="0.6" />
        <circle cx="79" cy="81.5" r="12" opacity="0.6" />
        <circle cx="50" cy="92" r="12" opacity="0.6" />
        <circle cx="21" cy="81.5" r="12" opacity="0.6" />
        <circle cx="11" cy="50" r="12" opacity="0.6" />
        <circle cx="21" cy="18.5" r="12" opacity="0.6" />
      </g>
    </svg>
  );
};

export default SacredGeometry;