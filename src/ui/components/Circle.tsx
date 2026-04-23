import React from "react";

interface CircleProps {
  size?: number; // diameter in pixels
  className?: string; // additional tailwind classes
  animate?: boolean; // enable floating animation
  animationType?: 'float' | 'float-slow' | 'float-fast' | 'float-very-fast'; // animation speed
}

export const Circle: React.FC<CircleProps> = ({ 
  size = 150, 
  className = "",
  animate = false,
  animationType = 'float'
}) => {
  const animationClass = animate ? `animate-${animationType}` : '';
  
  return (
    <div
      className={`rounded-full bg-gray-200 absolute ${animationClass} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};