import { PlayerLocation } from '@/type/enum/Location';
import Player from '@/type/interface/Player';
import React from 'react';

interface ChipProps {
  amount: number;
  type?: 'bet' | 'pot';
  player?: Player;
  playerLocation?: PlayerLocation;
}

const Chip: React.FC<ChipProps> = ({ amount, type = 'bet', player, playerLocation }) => {
  return (
    <div className={`
      flex items-center justify-center
      ${type === 'pot' ? 'bg-gray-700' : 'bg-white'}
      rounded-full w-12 h-12
      sh:w-7 sh:h-7 sh:text-xxs
      text-sm font-bold
      ${type === 'pot' ? 'text-white' : 'text-black'}
      shadow-md
      transition-all duration-500 ease-in-out
    `}>
      {amount}
    </div>
  );
};

export default Chip;