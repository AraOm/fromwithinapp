import React from "react";

interface ChakraLotusIconProps {
  className?: string;
  color?: string;
  showSilver?: boolean;
  chakra?: string;   // 👈 added so VRIntegration can pass it
  size?: number;     // 👈 optional explicit size
}

const ChakraLotusIcon: React.FC<ChakraLotusIconProps> = ({
  className = "",
  color = "currentColor",
  showSilver = false,
  chakra,          // not used yet, but available
  size = 32,       // default size
}) => {
  return (
    <div className="relative">
      {/* Silver lotus above (when showSilver is true) */}
      {showSilver && (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`${className} absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-80`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Silver outer petals */}
          <g fill="#c0c0c0" opacity="0.9">
            <ellipse cx="50" cy="20" rx="6" ry="15" transform="rotate(0 50 50)" />
            <ellipse cx="50" cy="20" rx="6" ry="15" transform="rotate(45 50 50)" />
            <ellipse cx="50" cy="20" rx="6" ry="15" transform="rotate(90 50 50)" />
            <ellipse cx="50" cy="20" rx="6" ry="15" transform="rotate(135 50 50)" />
            <ellipse cx="50" cy="20" rx="6" ry="15" transform="rotate(180 50 50)" />
            <ellipse cx="50" cy="20" rx="6" ry="15" transform="rotate(225 50 50)" />
            <ellipse cx="50" cy="20" rx="6" ry="15" transform="rotate(270 50 50)" />
            <ellipse cx="50" cy="20" rx="6" ry="15" transform="rotate(315 50 50)" />
          </g>

          {/* Silver inner petals */}
          <g fill="#c0c0c0" opacity="0.7">
            <ellipse cx="50" cy="30" rx="4" ry="10" transform="rotate(22.5 50 50)" />
            <ellipse cx="50" cy="30" rx="4" ry="10" transform="rotate(67.5 50 50)" />
            <ellipse cx="50" cy="30" rx="4" ry="10" transform="rotate(112.5 50 50)" />
            <ellipse cx="50" cy="30" rx="4" ry="10" transform="rotate(157.5 50 50)" />
            <ellipse cx="50" cy="30" rx="4" ry="10" transform="rotate(202.5 50 50)" />
            <ellipse cx="50" cy="30" rx="4" ry="10" transform="rotate(247.5 50 50)" />
            <ellipse cx="50" cy="30" rx="4" ry="10" transform="rotate(292.5 50 50)" />
            <ellipse cx="50" cy="30" rx="4" ry="10" transform="rotate(337.5 50 50)" />
          </g>

          {/* Silver center */}
          <circle cx="50" cy="50" r="6" fill="#c0c0c0" opacity="0.8" />
        </svg>
      )}

      {/* Main lotus */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer petals */}
        <g fill={color} opacity="0.9">
          <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(0 50 50)" />
          <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(45 50 50)" />
          <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(90 50 50)" />
          <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(135 50 50)" />
          <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(180 50 50)" />
          <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(225 50 50)" />
          <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(270 50 50)" />
          <ellipse cx="50" cy="20" rx="8" ry="20" transform="rotate(315 50 50)" />
        </g>

        {/* Inner petals */}
        <g fill={color} opacity="0.7">
          <ellipse cx="50" cy="30" rx="6" ry="15" transform="rotate(22.5 50 50)" />
          <ellipse cx="50" cy="30" rx="6" ry="15" transform="rotate(67.5 50 50)" />
          <ellipse cx="50" cy="30" rx="6" ry="15" transform="rotate(112.5 50 50)" />
          <ellipse cx="50" cy="30" rx="6" ry="15" transform="rotate(157.5 50 50)" />
          <ellipse cx="50" cy="30" rx="6" ry="15" transform="rotate(202.5 50 50)" />
          <ellipse cx="50" cy="30" rx="6" ry="15" transform="rotate(247.5 50 50)" />
          <ellipse cx="50" cy="30" rx="6" ry="15" transform="rotate(292.5 50 50)" />
          <ellipse cx="50" cy="30" rx="6" ry="15" transform="rotate(337.5 50 50)" />
        </g>

        {/* Center */}
        <circle cx="50" cy="50" r="8" fill={color} opacity="0.8" />
      </svg>
    </div>
  );
};

export default ChakraLotusIcon;
