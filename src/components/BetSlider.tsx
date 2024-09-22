import React, { useRef, useEffect, useCallback, useState } from 'react';

interface SliderPoint {
  label: string;
  value: number;
}

interface BetSliderProps {
  points: SliderPoint[];
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  minValue: number;
  maxValue: number;
}

export const BetSlider: React.FC<BetSliderProps> = ({ points, value, onChange, disabled = false, minValue, maxValue }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [continuousValue, setContinuousValue] = useState(value);

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

  useEffect(() => {
    // Update continuousValue when minValue changes
    if (continuousValue < minValue) {
      setContinuousValue(minValue);
      onChange(minValue);
    }

    if (thumbRef.current && sliderRef.current) {
      const percentage = (continuousValue - minValue) / (maxValue - minValue);
      thumbRef.current.style.left = `${percentage * 100}%`;
    }
  }, [continuousValue, minValue, maxValue, onChange]);

  return (
    <div className="w-full relative">
      <div 
        ref={sliderRef}
        className="w-full h-2 bg-gray-200 rounded-lg relative"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
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
          className="absolute w-4 h-4 bg-white border-2 border-gray-500 rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2"
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