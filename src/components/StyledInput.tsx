import React, { useState } from 'react';

interface StyledInputProps {
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  disabled?: boolean;
  min?: number;
  max?: number;
}

export const StyledInput: React.FC<StyledInputProps> = ({ label, value, onChange, type = 'text', disabled = false, min, max }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        min={min}
        max={max}
        className={`w-full bg-black text-white border ${
          isFocused ? 'border-white' : 'border-gray-600'
        } rounded-md px-3 py-2 focus:outline-none transition-colors duration-200 ease-in-out
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {label}
      </span>
    </div>
  );
};