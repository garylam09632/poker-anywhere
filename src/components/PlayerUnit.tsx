import { NormalRule, Rule } from '@/type/class/Rules';
import { Action } from '@/type/General';
import Player from '@/type/interface/Player';
import React, { useState } from 'react';

interface PlayerUnitProps {
  player: Player;
  isActive: boolean;
  currentBet: number;
  bigBlind: number;
  isSelected: boolean;
  onSelect: (player: Player) => void;
  onAction: (action: Action, amount?: number) => void;
  onNameChange: (id: number, name: string) => void; // New prop
  onChipsChange: (id: number, chips: number) => void; // New prop
}

const PlayerUnit: React.FC<PlayerUnitProps> = ({ player, isActive, isSelected, currentBet, bigBlind, onAction, onNameChange, onChipsChange, onSelect  }: PlayerUnitProps) => {
  
  const [betAmount, setBetAmount] = useState(currentBet);
  const [rule, setRule] = useState<Rule>(new NormalRule())

  let positionEllipseClass = isActive ? "bg-white border-black border-4 text-black" : "bg-black border-white border-4 text-white"
  let chipEllipseClass = isActive ? "bg-white border-black border-4 text-black" : "bg-black border-white border-4 text-white"
  let nameClass = isActive ? "bg-white border-black border-2 text-black" : "bg-black border-white border-2 text-white"
  
  const getAvailableActions = (): Action[] => {
    const actions: Action[] = ['Fold'];
    if (currentBet === 0) {
      actions.push('Check', 'Bet', 'ALL IN');
    } else if (player.currentBet < currentBet) {
      actions.push('Call', 'Raise', 'ALL IN');
    } else {
      actions.push('Check', 'Raise', 'ALL IN');
    }
    return actions;
  };

  const onActionButtonClick = (action: Action) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      handleAction(action);
    }
  }

  const handleAction = (action: Action) => {
    if (action === 'Bet' || action === 'Raise') {
      onAction(action, betAmount);
    } else {
      onAction(action);
    }
  };

  const onBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let bet = Number(e.target.value);
    if (rule.canBet(player, bet, currentBet, bigBlind)) {
      setBetAmount(bet);
    }
  }
  
  return (
    <div className="relative flex flex-col items-center scale-75 sh:scale-90 md:scale-100 lg:scale-110">
      {/* Position indicator */}
      <div className={`
        absolute -top-5 z-10 w-10 h-10 ${positionEllipseClass} rounded-full 
        flex items-center justify-center text-black font-bold text-xs
      `}>
        {player.position}
      </div>
      
      {/* Main circle with chips */}
      <div className={
        `w-24 h-24 ${chipEllipseClass} rounded-full flex items-center justify-center
       text-black font-bold text-xl sh:w-20 sh:h-20 sh:text-sm`
      }>
        {player.chips}
      </div>
      
      {/* Name plate */}
      <div className={
        `absolute -bottom-5 z-10 mt-2 px-3 py-1 ${nameClass} 
        rounded-full text-sm sh:px-2 sh:py-1 sh:text-xs`
      }>
        {player.name}
      </div>
    </div>
  );
};

export default PlayerUnit;