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
        positionClass = 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2';
        break;
      case PlayerLocation.TopLeft:
        positionClass = 'bottom-0 left-1/2 transform -translate-x-1 translate-y-2/3';
        break;
        case PlayerLocation.TopRight:
        positionClass = 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2';
        break;
      case PlayerLocation.BottomCenter:
        positionClass = 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-12';
        break;
      case PlayerLocation.BottomLeft:
        positionClass = 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-12';
        break;
      case PlayerLocation.BottomRight:
        positionClass = 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-12';
        break;
      case PlayerLocation.LeftCenter:
        positionClass = 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2';
        break;
      case PlayerLocation.LeftBottom:
        positionClass = 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2';
        break;
      case PlayerLocation.RightCenter:
        positionClass = 'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2';
        break;
      case PlayerLocation.RightBottom:
        positionClass = 'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2';
        break;
      default:
        positionClass = 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2';
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