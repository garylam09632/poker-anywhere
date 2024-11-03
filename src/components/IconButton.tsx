import React from 'react';
import { Tooltip } from './Tooltip'; // You might need to create this as well

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  onClick, 
  tooltip,
  disabled = false 
}) => {
  return (
    <Tooltip content={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          group
          p-2 rounded-full
          transition-all duration-200
          ${disabled 
            && 'cursor-not-allowed opacity-50' 
          }
        `}
      >
        <span className="w-8 h-8 flex items-center justify-center text-3xl hover:scale-110
          transition-all duration-200
          group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
        >
          {icon}
        </span>
      </button>
    </Tooltip>
  );
};