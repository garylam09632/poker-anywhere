import React from 'react';

interface StyledButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const StyledButton: React.FC<StyledButtonProps> = ({ onClick, disabled = false, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full font-bold py-3 px-4 rounded-md
        transition-all duration-300 ease-in-out
        border border-gray-600
        transform-gpu
        ${disabled
          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
          : 'bg-white text-black hover:bg-black hover:text-white hover:scale-105 active:scale-95'
        }
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
      `}
    >
      {children}
    </button>
  );
};