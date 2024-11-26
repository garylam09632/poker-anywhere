import { useLocation } from '@/hooks/useLocation';
import React, { useRef, useEffect, useCallback, useState } from 'react';

interface SliderPoint {
  label: string;
  value: number;
}

interface BetSliderProps {
  points: SliderPoint[];
  value: number;
  disabled?: boolean;
  minValue: number;
  maxValue: number;
  onChange: (value: number) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const BetSlider: React.FC<BetSliderProps> = ({ 
  points, 
  value, 
  disabled = false, 
  minValue, 
  maxValue, 
  onChange, 
  onKeyDown,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [continuousValue, setContinuousValue] = useState(value);
  const { isMobile } = useLocation();

  // Add this new effect to sync with external value
  useEffect(() => {
    setContinuousValue(value);
  }, [value]);

  // console.log(points);
  // console.log("points[0].value: ", points[0].value);
  // console.log("maxValue / 3: ", maxValue / 3);
  // console.log("minValue: ", minValue);
  const filteredPoints = points.filter(point => point.value === minValue || point.value > maxValue / 3);

  const handleSliderChange = useCallback((clientX: number) => {
    if (sliderRef.current && !disabled) {
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newValue = Math.round(minValue + percentage * (maxValue - minValue));
      setContinuousValue(newValue);
      onChange(newValue);
    }
  }, [minValue, maxValue, onChange, disabled]);

  const handleStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    handleSliderChange(clientX);

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const moveClientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      handleSliderChange(moveClientX);
    };

    const handleEnd = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
  }, [handleSliderChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    console.log("Key pressed:", e.key);  // Debug log
    if (disabled) return;

    e.preventDefault();
    
    const step = maxValue * 0.01; // Calculate 5% of maxValue
    
    if (e.key === 'ArrowLeft') {
      const newValue = Math.max(minValue, value - step);
      // console.log("New value (left):", newValue);
      onChange(newValue);
    } else if (e.key === 'ArrowRight') {
      const newValue = Math.min(maxValue, value + step);
      // console.log("New value (right):", newValue);
      onChange(newValue);
    }
    onKeyDown?.(e);
  }, [value, onChange, minValue, maxValue, disabled, onKeyDown]);

  // Add focus test
  const handleClick = () => {
    if (sliderRef.current) {
      sliderRef.current.focus();
      console.log("Slider focused");
    }
  };

  useEffect(() => {
    // console.log("continuousValue", continuousValue)
    // console.log("minValue", minValue)
    // console.log("maxValue", maxValue)
    // Update continuousValue when min/max values change
    if (continuousValue < minValue) {
      setContinuousValue(minValue);
      onChange(minValue);
    }
    if (continuousValue > maxValue) {
      setContinuousValue(maxValue);
      onChange(maxValue);
    }

    if (thumbRef.current && sliderRef.current) {
      const percentage = Math.min(1, Math.max(0, (continuousValue - minValue) / (maxValue - minValue)));
      thumbRef.current.style.left = `${percentage * 100}%`;
    }
  }, [continuousValue, minValue, maxValue, onChange]);
  
  return (
    <div className="w-full relative">
      <div 
        ref={sliderRef}
        className={`
          w-full h-2 bg-gray-200 rounded-lg relative 
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none
          focus:shadow-[0_0_15px_rgba(255,255,255,0.5)]
          transition-shadow duration-200
        `}        
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onClick={handleClick}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        {filteredPoints.map((point, index) => (
          <div 
            key={index}
            className="absolute w-3 h-3 bg-gray-500 rounded-full -top-1/4"
            style={{
              left: `${((point.value - minValue) / (maxValue - minValue)) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          ></div>
        ))}
        <div 
          className="absolute h-full bg-gray-500 rounded-l-lg"
          style={{
            width: `${((continuousValue - minValue) / (maxValue - minValue)) * 100}%`,
          }}
        ></div>
        <div 
          ref={thumbRef}
          className={`absolute ${isMobile ? 'w-5' : 'w-4'} ${isMobile ? 'h-5' : 'h-4'} bg-white border-2 border-gray-500 rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 ${disabled ? 'cursor-not-allowed' : 'cursor-grab'}`}
        ></div>
      </div>
      <div className="w-full flex justify-between text-xs mt-2">
        {filteredPoints.map((point, index) => (
          <div 
            key={index}
            className="absolute"
            style={{
              left: `${((point.value - minValue) / (maxValue - minValue)) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <span>{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};