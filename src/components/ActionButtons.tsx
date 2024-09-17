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
    <div className="w-full flex flex-col items-center absolute bottom-10 px-10">
      <div className="w-full flex justify-between mb-4">
        <div className="flex space-x-4 w-1/3">
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
        <div className="flex space-x-4 w-1/3">
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
      </div>
      {canRaise && (
        <div className="w-1/3 flex flex-col items-center">
          <input
            type="range"
            min="0"
            max={sliderPoints.length - 1}
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="w-full flex justify-between text-xs mt-1">
            {sliderPoints.map((point, index) => (
              <span key={index}>{point.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};