import React, { useState } from 'react';

interface StyledInputProps {
  id?: string;
  value?: string | number;
  label?: string;
  type?: 'text' | 'number';
  disabled?: boolean;
  min?: number;
  max?: number;
  defaultValue?: number;
  autoFocus?: boolean;
  onChange: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
}

export const StyledInput: React.FC<StyledInputProps> = ({ 
  id,
  label, 
  value, 
  type = 'text', 
  disabled = false, 
  min = -1, 
  max = Infinity,
  defaultValue,
  onChange, 
  onBlur,
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => onChange(e.target.value, e)}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => { onBlur?.(e.target.value, e); setIsFocused(false); }}
        disabled={disabled}
        min={min}
        max={max}
        autoFocus={autoFocus}
        className={`w-full bg-black text-white border ${
          isFocused ? 'border-white' : 'border-gray-600'
        } rounded-md px-3 py-3 focus:outline-none transition-colors duration-200 ease-in-out
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        tabIndex={disabled ? -1 : 0}
      />
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {label}
      </span>
    </div>
  );
};