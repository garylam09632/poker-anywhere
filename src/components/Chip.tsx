import { PlayerLocation } from '@/type/enum/Location';
import Player from '@/type/interface/Player';
import { Helper } from '@/utils/Helper';
import { LocalStorage } from '@/utils/LocalStorage';
import React, { useEffect } from 'react';

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
      rounded-full
      ${LocalStorage.get('cdm').toString() === 'bigBlind' ? 'w-auto h-auto p-2 xxs:w-[140%]' : 'w-12 h-12'}
      sh:w-7 sh:h-7 sh:text-xxs
      text-sm font-bold
      ${type === 'pot' ? 'text-white' : 'text-black'}
      shadow-md
    `}>
      {Helper.cdm(amount)}
    </div>
  );
};

export default Chip;