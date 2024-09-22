import { PlayerLocation } from '@/type/enum/Location';
import React from 'react';

interface ChipProps {
  amount: number;
  isPot?: boolean;
  position?: 'bet' | 'pot';
  playerLocation?: PlayerLocation;
}

const Chip: React.FC<ChipProps> = ({ amount, isPot = false, position = 'player', playerLocation }) => {
  let positionClass = '';
  
  if (position === 'bet') {
    switch (playerLocation) {
      case PlayerLocation.TopCenter:
        positionClass = 'top-0 left-1/2 transform -translate-x-1/2 translate-y-3/1';
        break;
      case PlayerLocation.TopLeft:
        positionClass = 'top-0 right-0 transform translate-x-full translate-y-3/1';
        break;
      case PlayerLocation.TopRight:
        positionClass = 'top-0 left-0 transform -translate-x-full translate-y-3/1';
        break;
      case PlayerLocation.BottomCenter:
        positionClass = 'bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-3/1';
        break;
      case PlayerLocation.BottomLeft:
        positionClass = 'bottom-0 right-0 transform translate-x-full -translate-y-3/1';
        break;
      case PlayerLocation.BottomRight:
        positionClass = 'bottom-0 left-0 transform -translate-x-full -translate-y-3/1';
        break;
      case PlayerLocation.LeftCenter:
        positionClass = 'left-0 top-1/2 transform translate-x-3/1 translate-y-2/3';
        break;
      case PlayerLocation.LeftBottom:
        positionClass = 'left-0 bottom-0 transform translate-x-3/1  -translate-y-3/2';
        break;
      case PlayerLocation.RightCenter:
        positionClass = 'right-0 top-1/2 transform -translate-x-3/1 translate-y-2/3';
        break;
      case PlayerLocation.RightBottom:
        positionClass = 'right-0 bottom-0 transform -translate-x-3/1 -translate-y-3/2';
        break;
      default:
        positionClass = 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full';
    }
  } else if (position === 'pot') {
    positionClass = 'left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2';
  }

  return (
    <div className={`
      absolute
      flex items-center justify-center
      ${isPot ? 'bg-gray-700' : 'bg-white'}
      rounded-full w-12 h-12
      sh:w-9 sh:h-9 sh:text-xs
      text-sm font-bold
      ${isPot ? 'text-white' : 'text-black'}
      shadow-md
      ${positionClass}
      transition-all duration-500 ease-in-out
    `}>
      {amount}
    </div>
  );
};

export default Chip;