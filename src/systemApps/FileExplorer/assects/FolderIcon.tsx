import React from 'react';

interface FolderIconProps {
  primaryColor?: string;
  width?: number | string;
  height?: number | string;
}

export const FolderIcon: React.FC<FolderIconProps> = ({ 
  primaryColor = 'var(--primary, #f63b60)', // Safe fallback if no color is passed
  width = 24, 
  height = 24 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill={primaryColor} 
      stroke={primaryColor} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
};