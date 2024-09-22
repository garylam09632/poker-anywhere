import React, { useState, useEffect, useMemo } from 'react';
import { StyledButton } from './StyledButton';

interface ActionButtonsProps {
  onFold: () => void;
  onCheck: () => void;
  onCall: () => void;
  onRaise: (amount: number) => void;
  canCheck: boolean;
  callAmount: number;
  currentBet: number;
  playerChips: number;
  potSize: number;
  minRaise: number;
  disabled: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onFold,
  onCheck,
  onCall,
  onRaise,
  canCheck,
  callAmount,
  currentBet,
  playerChips,
  potSize,
  minRaise,
  disabled
}) => {
  const [raiseAmount, setRaiseAmount] = useState(minRaise);
  const [sliderValue, setSliderValue] = useState(0);

  const sliderPoints = useMemo(() => {
    console.log("potSize", potSize)
    const points = [
      { label: 'Min', value: minRaise },
      { label: '1/3', value: Math.floor(potSize / 3) },
      { label: '1/2', value: Math.floor(potSize / 2) },
      { label: '3/4', value: Math.floor(potSize * 3 / 4) },
      { label: 'Pot', value: potSize },
      { label: 'Max', value: playerChips }
    ];
    return points.filter(point => point.value <= playerChips && point.value >= minRaise);
  }, [potSize, playerChips, minRaise]);

  const canRaise = playerChips > minRaise;

  useEffect(() => {
    setRaiseAmount(canRaise ? minRaise : playerChips);
  }, [canRaise, minRaise, playerChips]);

  const handleRaiseAmountChange = (amount: number) => {
    if (amount <= playerChips) {
      setRaiseAmount(amount);
      const index = sliderPoints.findIndex(point => point.value >= amount);
      setSliderValue(index >= 0 ? index : sliderPoints.length - 1);
    }
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(event.target.value);
    setSliderValue(index);
    setRaiseAmount(sliderPoints[index].value);
  };

  return (
    <div className="
      w-[90%] flex flex-col items-center
      sh:absolute sh:bottom-0 sh:translate-y- sh:scale-90
    ">
      <div className="w-full flex justify-between mb-4 space-x-10">
        <div id="actionRegionContainer" className="flex items-center w-1/2 md:w-1/3 sh:w-1/2">
          <div className="flex flex-col space-x-0 space-y-4 w-full justify-between md:flex-row md:space-x-4 md:space-y-0">
            <StyledButton onClick={onFold} disabled={disabled}>Fold</StyledButton>
            {canCheck ? (
              <StyledButton onClick={onCheck} disabled={disabled}>Check</StyledButton>
            ) : (
              <StyledButton onClick={onCall} disabled={disabled}>Call ${callAmount}</StyledButton>
            )}
            <StyledButton onClick={() => onRaise(raiseAmount)} disabled={disabled || !canRaise}>
              {canRaise ? `Raise $${raiseAmount}` : `All-In $${playerChips}`}
            </StyledButton>
          </div>
        </div>
        <div id="betControlRegionContainer" className="flex flex-col items-center w-1/2 space-y-4 md:space-y-0 md:w-1/3 sh:w-1/2">
          <div className="flex flex-col space-x-0 space-y-4 w-full justify-between md:flex-row md:space-x-4 md:space-y-0">
            <StyledButton 
              onClick={() => handleRaiseAmountChange(currentBet * 2)} 
              disabled={disabled || currentBet * 2 > playerChips}
            >
              2x
            </StyledButton>
            <StyledButton 
              onClick={() => handleRaiseAmountChange(currentBet * 3)} 
              disabled={disabled || currentBet * 3 > playerChips}
            >
              3x
            </StyledButton>
            <StyledButton 
              onClick={() => handleRaiseAmountChange(playerChips)} 
              disabled={disabled}
            >
              ALL IN
            </StyledButton>
          </div>
          {canRaise && (
            <div className="w-full relative">
              <input
                type="range"
                min="0"
                max={sliderPoints.length - 1}
                value={sliderValue}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-slider"
                style={{
                  '--slider-points': sliderPoints.length,
                  '--slider-value': sliderValue,
                } as React.CSSProperties}
              />
              <div className="w-full absolute top-0 left-0 right-0 pointer-events-none" style={{ zIndex: 15 }}>
                {sliderPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="absolute w-3 h-3 bg-gray-500 rounded-full"
                    style={{
                      left: `calc(${index / (sliderPoints.length - 1)} * 100%)`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  ></div>
                ))}
              </div>
              <div className="w-full flex justify-between text-xs mt-4 relative">
                {sliderPoints.map((point, index) => (
                  <div key={index} className="flex flex-col items-center relative">
                    <span>{point.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .custom-slider {
          --slider-points: ${sliderPoints.length};
          --slider-value: ${sliderValue};
          position: relative;
          z-index: 10;
        }
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #333;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 20;
        }
        .custom-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #333;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 20;
        }
        .custom-slider {
          background: linear-gradient(to right, #4a5568 0%, #4a5568 calc(100% * var(--slider-value) / (var(--slider-points) - 1)), #e2e8f0 calc(100% * var(--slider-value) / (var(--slider-points) - 1)), #e2e8f0 100%);
        }
      `}</style>
    </div>
  );
};