import React, { useState, useEffect, useMemo } from 'react';
import { StyledButton } from './StyledButton';
import { BetSlider } from './BetSlider';
import { useSearchParams } from 'next/navigation';
import { StyledInput } from './StyledInput';
import Player from '@/type/interface/Player';

interface ActionButtonsProps {
  onFold: () => void;
  onCheck: () => void;
  onCall: () => void;
  onRaise: (amount: number, isRaise?: boolean) => void;
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
  disabled,
}) => {
  const searchParams = useSearchParams();
  const [raiseAmount, setRaiseAmount] = useState(minRaise);
  const [inputValue, setInputValue] = useState(String(minRaise));
  const [canRaise, setCanRaise] = useState(playerChips > minRaise);
  const bb = Number(searchParams.get('bigBlind') || 2);

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

  const upperOptions = [
    { label: '33%', value: Math.floor(potSize * 0.33) },
    { label: '50%', value: Math.floor(potSize * 0.5) },
    { label: '75%', value: Math.floor(potSize * 0.75) },
    { label: '100%', value: potSize },
    { label: 'All-In', value: playerChips }
  ];

  const lowerOptions = [
    { label: '2x', value: (currentBet || bb) * 2 },
    { label: '3x', value: (currentBet || bb) * 3 },
    { label: '4x', value: (currentBet || bb) * 4 },
  ];
  
  useEffect(() => {
    setCanRaise(playerChips > minRaise);
    setRaiseAmount(playerChips > minRaise ? minRaise : playerChips);
  }, [minRaise, playerChips]);

  // Represents raise amount input that are controlled such as button & slider
  const handleControlledRaiseAmountChange = (amount: number) => {
    if (amount <= playerChips) {
      setRaiseAmount(amount);
      setInputValue(String(amount));
    }
  }

  // Represents raise amount input that are uncontrolled such as number input
  const handleRaiseAmountChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = Number(value);
    setInputValue(value);
    
    if (numValue >= minRaise && numValue <= playerChips) {
      setRaiseAmount(numValue);
    } else if (numValue > playerChips) {
      setRaiseAmount(playerChips);
    }
  };

  console.log("minRaise", minRaise)
  // sh:absolute sh:bottom-0 sh:translate-y-24 sh:scale-90
  return (
    <div className="
      w-[90%] flex flex-col items-center
    ">
      <div className="w-full flex justify-between mb-4 space-x-10">
        <div id="actionRegionContainer" className="flex items-center w-1/2 md:w-1/2 sh:w-1/2">
          <div className="flex flex-col space-x-0 space-y-4 w-full justify-between md:flex-row md:space-x-4 md:space-y-0">
            <StyledButton onClick={onFold} disabled={disabled}>Fold</StyledButton>
            {canCheck ? (
              <StyledButton onClick={onCheck} disabled={disabled}>Check</StyledButton>
            ) : (
              <StyledButton onClick={onCall} disabled={disabled}>Call ${playerChips < callAmount ? playerChips : callAmount}</StyledButton>
            )}
            <StyledButton onClick={() => onRaise(raiseAmount, canRaise && raiseAmount !== playerChips)}>
              {canRaise && raiseAmount !== playerChips ? `Raise $${raiseAmount}` : `All-In $${playerChips}`}
            </StyledButton>
          </div>
        </div>
        <div id="betControlRegionContainer" className="flex flex-col items-center w-1/2 space-y-3 md:w-1/2 sh:w-1/2">
          <div className="flex flex-col space-x-0 space-y-4 w-full justify-between md:flex-row md:space-x-4 md:space-y-0">
            {upperOptions.map((option) => (
              <StyledButton 
                key={option.label}
                onClick={() => handleControlledRaiseAmountChange(option.value)} 
                disabled={disabled || option.value > playerChips || option.value < minRaise}
              >
                {option.label}
              </StyledButton>
            ))}
          </div>
          <div className="w-full flex flex-row items-center space-x-4">
            <div className="flex flex-row w-1/3 space-x-3">              
              {lowerOptions.map((option) => (
                <StyledButton 
                  key={option.label}
                  onClick={() => handleControlledRaiseAmountChange(option.value)} 
                  disabled={disabled || option.value > playerChips || option.value < minRaise}
                >
                  {option.label}
                </StyledButton>
              ))}
            </div>
            <div className="flex flex-row items-center w-3/4 space-x-4">
              <StyledInput
                value={inputValue}
                onChange={(value, e) => handleRaiseAmountChange(value, e)}
                type="number"
                max={playerChips}
                disabled={disabled}
              />
              <BetSlider
                points={sliderPoints}
                value={raiseAmount}
                onChange={handleControlledRaiseAmountChange}
                disabled={disabled}
                minValue={minRaise}
                maxValue={playerChips}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};