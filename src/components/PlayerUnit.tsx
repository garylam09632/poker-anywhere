'use client'

import { NormalRule, Rule } from '@/type/class/Rules';
import { Action } from '@/type/General';
import Player from '@/type/interface/Player';
import React, { useEffect, useState } from 'react';
import Chip from './Chip';
import { ChipCSSLocation, PlayerLocation } from '@/type/enum/Location';
import useWindowSize from '@/app/hook/useWindowSize';

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
  const [rule, setRule] = useState<Rule>(new NormalRule());
  const [css, setCss] = useState('');
  // const [isResized, setIsResized] = useState(false);
  // const { width, height } = useWindowSize();
  let positionEllipseClass = isActive ? "bg-white border-black border-4 text-black" : "bg-black border-white border-4 text-white"
  let chipEllipseClass = isActive ? "bg-white border-black border-4 text-black" : "bg-black border-white border-4 text-white"
  let nameClass = isActive ? "bg-white border-black border-2 text-black" : "bg-black border-white border-2 text-white"

  // useEffect(() => {
  //   console.log(width, height)
  //   if (width || height) {
  //     const bet = document.getElementById(`bet-${player.id}`);
  //     if (bet) { 
  //       bet.style.opacity = '0';
  //       bet.style.transform = `translate(0, 0)`;
  //       bet.style.transition = 'opacity 2s';
  //     }
  //     setIsResized(true);
  //   }
  // }, [width, height]);

  useEffect(() => {
    switch (player.location) {
      case PlayerLocation.TopCenter:
        setCss('bottom-0');
        break;
      case PlayerLocation.TopLeft:
        setCss('bottom-0 right-1/3');
        break;
      case PlayerLocation.TopRight:
        setCss('bottom-0 left-1/3');
        break;
      case PlayerLocation.BottomCenter:
        setCss('top-0');
        break;
      case PlayerLocation.BottomLeft:
        setCss('top-0 right-1/3');
        break;
      case PlayerLocation.BottomRight:
        setCss('top-0 left-1/3');
        break;
      case PlayerLocation.LeftCenter:
        setCss('right-0 bottom-1/4');
        break;
      case PlayerLocation.LeftBottom:
        setCss('right-0 top-1/4');
        break;
      case PlayerLocation.RightCenter:
        setCss('left-0 bottom-1/4');
        break;
      case PlayerLocation.RightBottom:
        setCss('left-0 top-1/4');
        break;
    }
  }, [])

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
    <div className={`w-64 h-64 sh:w-40 sh:h-40 flex items-center justify-center`}>
      <div 
        id={`player-unit-${player.id}`}
        className="relative flex flex-col items-center animate-float-in
        transition-all ease-in-out"
      >
        {/* Position indicator */}
        <div 
          id={`position-indicator-${player.id}`}
          className={`
            absolute -top-5 z-10 w-10 h-10 sh:-top-4 sh:w-7 sh:h-7 sh:text-xxs ${positionEllipseClass} rounded-full 
            flex items-center justify-center text-black font-bold text-xs
          `}
        >
          {player.position}
        </div>
        {/* Main circle with chips */}
        <div className={
          `w-24 h-24 ${chipEllipseClass} rounded-full flex items-center justify-center
        text-black font-bold text-xl sh:w-16 sh:h-16 sh:text-xs`
        }>
          {player.chips}
        </div>
        
        {/* Name plate */}
        <div 
          id={`name-plate-${player.id}`}
          className={
            `absolute -bottom-5 z-10 mt-2 px-3 py-1 ${nameClass} 
            rounded-full text-sm font-bold sh:-bottom-3 sh:px-2 sh:py-0 sh:text-xxs`
          }
        >
          {player.name}
        </div>
      </div>
      {/* Betting chip */}
      {
        player.currentBet > 0 && (
          <div id={`bet-${player.id}`} className={`absolute ${css}`}> {/* Adjust the top position to place it above the position indicator */}
            <Chip amount={player.currentBet} />
          </div>
        )
      }
    </div>
  );
};

export default PlayerUnit;