import React from 'react';

interface StyledButtonProps {
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

export const StyledButton: React.FC<StyledButtonProps> = ({ 
  size = 'sm',
  children,
  disabled = false, 
  onClick, 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full font-bold
        text-${size}
        py-3
        sh:text-xs
        md:text-base
        md:py-3
        sh:py-2
        rounded-md
        transition-colors duration-300 ease-in-out
        border border-gray-600
        relative
        overflow-hidden
        ${disabled
          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
          : 'bg-black text-white hover:text-black'
        }
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-0
        before:content-[''] before:absolute before:inset-0 before:bg-white 
        before:transform before:scale-x-0 before:origin-left
        before:transition-transform before:duration-300 before:ease-in-out
        hover:before:scale-x-100
      `}
    >
      <span className={`relative z-10 text-${size}`}>{children}</span>
    </button>
  );
};