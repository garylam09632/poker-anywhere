import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StyledButton } from './StyledButton';
import { BetSlider } from './BetSlider';
import { StyledInput } from './StyledInput';
import { Dictionary } from '@/type/Dictionary';
import { Helper } from '@/utils/Helper';
import { LocalStorage } from '@/utils/LocalStorage';
import { ChipDisplayMode } from '@/type/General';
import { Settings } from '@/type/Settings';

interface ActionButtonsProps {
  onFold: () => void;
  onCheck: () => void;
  onCall: () => void;
  onRaise: (amount: number, isRaise?: boolean) => void;
  setShowBetControls: (show: boolean) => void;
  dictionary: Dictionary;
  canCheck: boolean;
  callAmount: number;
  currentBet: number;
  playerChips: number;
  potSize: number;
  minRaise: number;
  disabled: boolean;
  showBetControls: boolean;
  isCdmChange: boolean;
}

export const MobileActionButtons: React.FC<ActionButtonsProps> = ({
  onFold,
  onCheck,
  onCall,
  onRaise,
  setShowBetControls,
  dictionary,
  showBetControls,
  canCheck,
  callAmount,
  currentBet,
  playerChips,
  potSize,
  minRaise,
  disabled,
  isCdmChange,
}) => {
  const [raiseAmount, setRaiseAmount] = useState(minRaise);
  const [inputValue, setInputValue] = useState(String(minRaise));
  const [canRaise, setCanRaise] = useState(playerChips > minRaise);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const betControlsRef = useRef<HTMLDivElement>(null);
  const bb = (LocalStorage.get('settings').toObject() as Settings)?.bigBlind || 2;

  const cdm = LocalStorage.get('cdm').toString() as ChipDisplayMode;
  if (!cdm) {
    alert("Something went wrong, redirect to home page (002)")
    return;
  }

  const sliderPoints = useMemo(() => {
    const points = [
      { label: '', value: minRaise },
      { label: '1/3', value: Math.floor(potSize / 3) },
      { label: '1/2', value: Math.floor(potSize / 2) },
      { label: '3/4', value: Math.floor(potSize * 3 / 4) },
      { label: dictionary.pot, value: potSize },
      { label: '', value: playerChips }
    ];
    return points.filter(point => point.value <= playerChips && point.value >= minRaise);
  }, [potSize, playerChips, minRaise]);

  const upperOptions = [
    { label: '2x', value: (currentBet || bb) * 2 },
    { label: '3x', value: (currentBet || bb) * 3 },
    { label: '4x', value: (currentBet || bb) * 4 },
    { label: 'All-In', value: playerChips }
  ];

  const lowerOptions = [
    { label: '33%', value: Math.floor(potSize * 0.33) },
    { label: '50%', value: Math.floor(potSize * 0.5) },
    { label: '75%', value: Math.floor(potSize * 0.75) },
    { label: '100%', value: potSize }
  ];
  
  useEffect(() => {
    setCanRaise(playerChips > minRaise);
    setRaiseAmount(playerChips > minRaise ? minRaise : playerChips);
  }, [minRaise, playerChips]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchDown = e.touches[0].clientY;
    const diff = touchDown - touchStart;
    
    // If swiped down more than 50px, close the panel
    if (diff > 50) {
      setShowBetControls(false);
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Represents raise amount input that are controlled such as button & slider
  const handleControlledRaiseAmountChange = (amount: number) => {
    if (amount <= playerChips) {
      setRaiseAmount(amount);
      setInputValue(String(amount));
    }
  }

  // Represents raise amount input that are uncontrolled such as number input
  const handleRaiseAmountChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
    let numValue = Number(value);
    setInputValue(value);
    if (cdm === "bigBlind") numValue = numValue * bb
    
    if (numValue >= minRaise && numValue <= playerChips) {
      setRaiseAmount(numValue);
    } else if (numValue > playerChips) {
      setRaiseAmount(playerChips);
    }
  };

  useEffect(() => {
    if (cdm === "bigBlind") {
      setInputValue(String(raiseAmount / bb));
    } else {
      setInputValue(String(raiseAmount));
    }
  }, [isCdmChange, raiseAmount]);

  // sh:absolute sh:bottom-0 sh:translate-y-24 sh:scale-90
  return (
    <div className="w-full h-[10%] fixed bottom-0 left-0">
      {/* Main action buttons */}
      <div 
        className={`
          w-full flex items-center justify-between p-2 transition-transform duration-300
          md:relative md:transform-none
          ${showBetControls ? 'transform translate-y-full' : ''}
        `}
      >
        <div className="flex space-x-2 w-full">
          <StyledButton onClick={onFold} disabled={disabled}>{dictionary.fold}</StyledButton>
          {canCheck ? (
            <StyledButton onClick={onCheck} disabled={disabled}>{dictionary.check}</StyledButton>
          ) : (
            <StyledButton onClick={onCall} disabled={disabled}>{dictionary.call} {Helper.cdm(playerChips < callAmount ? playerChips : callAmount)}</StyledButton>
          )}
          <StyledButton 
            onClick={() => setShowBetControls(true)} 
            disabled={disabled}
          >
            {dictionary.raise}
          </StyledButton>
        </div>
      </div>

      {/* Bet controls - slides in on mobile when raise is clicked */}
      <div 
        ref={betControlsRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`
          w-full bg-zinc-900 bg-opacity-95 border-t border-opacity-20 border-white p-4 pb-8 absolute bottom-0 transition-transform duration-300
          md:relative md:transform-none rounded-t-2xl
          ${showBetControls ? '' : 'transform translate-y-full'}
        `}
      >
        <div className="w-12 h-1 bg-gray-500 rounded-full mx-auto mb-4" />
        <div className="flex flex-col space-y-4 w-full">          
          <div className="grid grid-cols-4 gap-2">
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

          <div className="grid grid-cols-4 gap-2">
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

          <div className="w-full flex justify-center items-center space-x-4">
            <div className="w-[15%]">
              <StyledInput
                value={inputValue}
                onChange={(value, e) => handleRaiseAmountChange(value, e)}
                type="number"
                max={playerChips}
                disabled={disabled}
              />
            </div>
            <div className="w-[80%] flex justify-center items-center pr-2">
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

          <StyledButton 
            onClick={() => {
              onRaise(raiseAmount, canRaise && raiseAmount !== playerChips);
              setShowBetControls(false);
            }}
          >
            {canRaise && raiseAmount !== playerChips ? `${dictionary.raise} ${Helper.cdm(raiseAmount)}` : `${dictionary.allIn} $${Helper.cdm(playerChips)}`}
          </StyledButton>
        </div>
      </div>
    </div>
  );
};