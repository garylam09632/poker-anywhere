import React, { useRef, useEffect, useCallback } from 'react';

interface SliderPoint {
  label: string;
  value: number;
}

interface BetSliderProps {
  points: SliderPoint[];
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const BetSlider: React.FC<BetSliderProps> = ({ points, value, onChange, disabled = false }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = useCallback((clientX: number) => {
    if (sliderRef.current && !disabled) {
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const index = Math.round(percentage * (points.length - 1));
      onChange(points[index].value);
    }
  }, [points, onChange, disabled]);

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
    const currentValue = points.findIndex(point => point.value === value);
    if (thumbRef.current && sliderRef.current) {
      const percentage = currentValue / (points.length - 1);
      thumbRef.current.style.left = `${percentage * 100}%`;
    }
  }, [value, points]);

  return (
    <div className="w-full relative">
      <div 
        ref={sliderRef}
        className="w-full h-2 bg-gray-200 rounded-lg relative cursor-pointer"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        {points.map((point, index) => (
          <div 
            key={index}
            className="absolute w-2 h-2 bg-gray-500 rounded-full top-0"
            style={{
              left: `${(index / (points.length - 1)) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          ></div>
        ))}
        <div 
          className="absolute h-full bg-gray-500 rounded-l-lg"
          style={{
            width: `${(points.findIndex(point => point.value === value) / (points.length - 1)) * 100}%`,
          }}
        ></div>
        <div 
          ref={thumbRef}
          className="absolute w-4 h-4 bg-white border-2 border-gray-500 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2"
        ></div>
      </div>
      <div className="w-full flex justify-between text-xs mt-2">
        {points.map((point, index) => (
          <div key={index} className="flex flex-col items-center">
            <span>{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};