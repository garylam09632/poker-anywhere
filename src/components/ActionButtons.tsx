import React, { useState, useEffect, useMemo } from 'react';
import { StyledButton } from './StyledButton';
import { BetSlider } from './BetSlider';
import { useSearchParams } from 'next/navigation';

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
  disabled
}) => {
  const searchParams = useSearchParams();
  const [raiseAmount, setRaiseAmount] = useState(minRaise);
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

  
  useEffect(() => {
    setCanRaise(playerChips > minRaise);
    setRaiseAmount(playerChips > minRaise ? minRaise : playerChips);
  }, [minRaise, playerChips]);

  const handleRaiseAmountChange = (amount: number) => {
    if (amount <= playerChips) {
      setRaiseAmount(amount);
    }
  };
  // sh:absolute sh:bottom-0 sh:translate-y-24 sh:scale-90
  return (
    <div className="
      w-[90%] flex flex-col items-center
    ">
      <div className="w-full flex justify-between mb-4 space-x-10">
        <div id="actionRegionContainer" className="flex items-center w-1/2 md:w-1/2 sh:w-1/2">
          <div className="flex flex-col space-x-0 space-y-4 w-full justify-between md:flex-row md:space-x-4 md:space-y-0">
            {canCheck ? (
              <StyledButton onClick={onCheck} disabled={disabled}>Check</StyledButton>
            ) : (
              <StyledButton onClick={onCall} disabled={disabled}>Call ${playerChips < callAmount ? playerChips : callAmount}</StyledButton>
            )}
            <StyledButton onClick={() => onRaise(raiseAmount, canRaise && raiseAmount !== playerChips)}>
              {canRaise && raiseAmount !== playerChips ? `Raise $${raiseAmount}` : `All-In $${playerChips}`}
            </StyledButton>
            <StyledButton onClick={onFold} disabled={disabled}>Fold</StyledButton>
          </div>
        </div>
        <div id="betControlRegionContainer" className="flex flex-col items-center w-1/2 space-y-3 md:w-1/3 sh:w-1/2">
          <div className="flex flex-col space-x-0 space-y-4 w-full justify-between md:flex-row md:space-x-4 md:space-y-0">
            <StyledButton 
              onClick={() => handleRaiseAmountChange((currentBet || bb) * 2)} 
              disabled={disabled || (currentBet || bb) * 2 > playerChips}
            >
              2x
            </StyledButton>
            <StyledButton 
              onClick={() => handleRaiseAmountChange((currentBet || bb) * 3)} 
              disabled={disabled || (currentBet || bb) * 3 > playerChips}
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
          {/* {canRaise && (
          )} */}
          <BetSlider
            points={sliderPoints}
            value={raiseAmount}
            onChange={handleRaiseAmountChange}
            disabled={disabled}
            minValue={minRaise}
            maxValue={playerChips}
          />
        </div>
      </div>
    </div>
  );
};