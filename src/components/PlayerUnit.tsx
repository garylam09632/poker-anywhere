'use client'

import { NormalRule, Rule } from '@/type/class/Rules';
import { Action } from '@/type/General';
import Player from '@/type/interface/Player';
import React, { useEffect, useState } from 'react';
import Chip from './Chip';
import { ChipCSSLocation, ChipCSSLocationMobile, PlayerLocation } from '@/type/enum/Location';
import { RiCheckLine, RiSettings4Line } from 'react-icons/ri';
import { ShowdownMode } from '@/type/enum/ShowdownMode';
import RankSelector from './RankSelector';
import { useLocation } from '@/hooks/useLocation';
import { Dictionary } from '@/type/Dictionary';

interface PlayerUnitProps {
  player: Player;
  isActive: boolean;
  currentBet: number;
  bigBlind: number;
  isSelected: boolean;
  showdownMode: number;
  isEligible: boolean;
  selectedRank?: number;
  selectedWinners: number[];
  dictionary: Dictionary;
  openModal: () => void;
  onSelect: (player: Player) => void;
  onAction: (action: Action, amount?: number) => void;
  onNameChange: (id: number, name: string) => void; // New prop
  onChipsChange: (id: number, chips: number) => void; // New prop
  onSelectWinner: (playerId: number, rank?: number) => void;
}

type ContentType = 'chips' | 'showdown' | 'busted';

const PlayerUnit: React.FC<PlayerUnitProps> = ({ 
  player, 
  isActive, 
  isSelected, 
  currentBet, 
  bigBlind, 
  showdownMode, 
  isEligible, 
  selectedRank,
  selectedWinners,
  dictionary,
  openModal,
  onSelect, 
  onAction, 
  onNameChange, 
  onChipsChange, 
  onSelectWinner, 
}: PlayerUnitProps) => {
  
  const [betAmount, setBetAmount] = useState(currentBet);
  const [rule, setRule] = useState<Rule>(new NormalRule());
  const [css, setCss] = useState('');
  const [showContent, setShowContent] = useState<ContentType>('chips');
  const [isHovered, setIsHovered] = useState(false);

  // Location
  const { isMobile, chipLocation, containerStyle } = useLocation();
  
  // const [isResized, setIsResized] = useState(false);
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
    if (player.hasBusted) {
      setShowContent('busted');
    } else {
      setShowContent(showdownMode && isEligible ? 'showdown' : 'chips');
    }
  }, [showdownMode, isEligible, player.hasBusted]);

  useEffect(() => {
    setCss(chipLocation[player.location])
  }, [isMobile, player.location])

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

  const renderShowdownOption = () => {
    if (!showdownMode || !isEligible) return null;

    const iconClass = "w-2/5 h-2/5 transition-all duration-200 ease-in-out";
    const selectedClass = "w-full h-full bg-black text-white border-4 border-white";
    const unselectedClass = `text-black ${isHovered ? "scale-150" : ""}`;

    if (showdownMode === 2) {
      const isSelected = selectedWinners.includes(player.id);
      return (
        <div 
          className={
            `w-2/5 h-2/5 
            ${isSelected ? selectedClass : unselectedClass}
            rounded-full transition-all duration-200 ease-in-out 
            flex flex-col items-center justify-center`
          }
        >
          <RiCheckLine className={`${isSelected ? "w-4/5 h-4/5" : "w-full h-full"}`} />
        </div>
      );
    } else if (showdownMode > 2) {
      return (
        <RankSelector
          showdownMode={showdownMode}
          selectedRank={selectedRank}
          onSelectWinner={onSelectWinner}
          playerId={player.id}
        />
      );
    }
  };

  const onPlayerSettingsClick = () => {
    if (showdownMode) return;
    onSelect(player);
    openModal();
  }

  return (
    <div 
      className={`
        sh:w-40 sh:h-40 flex items-center 
        justify-center scale-75 md:scale-100
        transition-all duration-300 ease-in-out
        group
        ${showdownMode ? "w-0" : containerStyle(player.location)}
        ${player.hasFolded || player.hasBusted ? "brightness-50" : ""} 
      `}
    >
      <div 
        id={`player-unit-${player.id}`}
        className={`
          relative flex flex-col items-center animate-float-in
          transition-all ease-in-out duration-500
          ${(!showdownMode && isHovered) && "group-hover:shadow-[0_0_25px_5px_rgba(255,255,255,0.7)]"}
          rounded-full cursor-pointer
        `}
        onClick={onPlayerSettingsClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Position indicator */}
        <div 
          id={`position-indicator-${player.id}`}
          className={`
            absolute -top-5 z-10 w-10 h-10 sh:-top-3 sh:w-7 sh:h-7 sh:text-xxs ${positionEllipseClass} rounded-full 
            flex items-center justify-center text-black font-bold text-xs
          `}
        >
          {player.position}
        </div>
        {/* Main circle with chips or showdown options */}
        <div id={`chips-${player.id}`} className={`
          w-24 h-24 ${chipEllipseClass} rounded-full flex items-center justify-center
          text-black font-bold text-xl sh:w-16 sh:h-16 sh:text-xs
          relative ${(showdownMode && isEligible) && 'cursor-pointer'}
        `}
          onClick={() => { 
            if (showdownMode && isEligible) { 
              onSelectWinner(player.id) 
            }
          }}
        >
          <div className={`
            absolute inset-0 flex items-center justify-center
            transition-opacity duration-300 ease-in-out
            ${showContent === 'chips' ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className={`absolute z-10 font-bold transition-opacity duration-300 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
              {player.chips}
            </div>
            <div 
              className={`
                absolute z-10 w-[60%] font-bold transition-all duration-300 ease-in-out 
                ${isHovered ? 'opacity-100 transform rotate-180' : 'opacity-0'}`
              } 
            >
              {/* TODO: Add clickable config icon */}
              <RiSettings4Line className="w-full h-full" />
            </div>
          </div>
          <div className={`
            absolute inset-0 flex items-center justify-center
            transition-opacity duration-300 ease-in-out
            ${dictionary.busted.length >= 8 ? 'text-sm' : 'text-md'}
            ${showContent === 'busted' ? 'opacity-100' : 'opacity-0'}
          `}>
            {player.tempBuyIn && player.tempBuyIn > 0 ? player.tempBuyIn: dictionary.busted}
          </div>
          <div className={`
            absolute inset-0 flex items-center justify-center
            transition-opacity duration-300 ease-in-out
            ${showContent === 'showdown' ? 'opacity-100' : 'opacity-0'}
          `}>
            {renderShowdownOption()}
          </div>
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
        (player.currentBet > 0 && showdownMode === ShowdownMode.None) && (
          <div id={`bet-${player.id}`} className={`absolute ${css}`}> {/* Adjust the top position to place it above the position indicator */}
            <Chip amount={player.currentBet} />
          </div>
        )
      }
    </div>
  );
};

export default PlayerUnit;
