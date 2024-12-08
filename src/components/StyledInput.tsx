import React, { useEffect, useState } from 'react';

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
  reset?: boolean;
  onValidate?: (value: string) => string;
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
  autoFocus = false,
  reset = false,
  onChange, 
  onBlur,
  onValidate,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');

  const onInputChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
    onChange(value, event);
    const validationResult = onValidate?.(value);
    setError(typeof validationResult === 'string' ? validationResult : '');
  };

  useEffect(() => {
    if (onValidate && value) {
      const validationResult = onValidate?.(value.toString());
      setError(typeof validationResult === 'string' ? validationResult : '');
    }
  }, [value, reset]);

  return (
    <div className="relative flex flex-col">
      <div className="relative">
        <input
          id={id}
          type={type}
          defaultValue={defaultValue}
          value={value}
          onChange={(e) => onInputChange(e.target.value, e)}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => { onBlur?.(e.target.value, e); setIsFocused(false); }}
          disabled={disabled}
          min={min}
          max={max}
          autoFocus={autoFocus}
          className={`w-full bg-black text-white border rounded-md px-3 py-3 focus:outline-none transition-colors duration-200 ease-in-out
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isFocused ? 'border-white' : 'border-gray-600'}
          ${error !== '' ? 'border-red-500 animate-shake' : ''}`}
          tabIndex={disabled ? -1 : 0}
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {label}
        </span>
      </div>
      <div className="absolute -bottom-6 left-0 text-sm text-gray-400">
        {error}
      </div>
    </div>
  );
};