import React, { useRef, useEffect } from 'react';

interface RankSelectorProps {
  showdownMode: number;
  selectedRank?: number;
  onSelectWinner: (playerId: number, rank?: number) => void;
  playerId: number;
}

const RankSelector: React.FC<RankSelectorProps> = ({
  showdownMode,
  selectedRank,
  onSelectWinner,
  playerId,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        element.scrollTop += e.deltaY;
      };
      element.addEventListener('wheel', handleWheel, { passive: false });
      return () => element.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const ranks = Array.from({ length: showdownMode }, (_, i) => i + 1);
  
  const selectedClass = "w-full h-full font-bold text-base";
  const unselectedClass = "text-black";

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  return (
    <div 
      ref={scrollRef}
      className="w-full h-24 overflow-y-scroll scrollbar-none touch-pan-y"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {ranks.map((rank) => (
        <div 
          key={rank}
          className={`
            py-1 px-2 mb-1 rounded cursor-pointer text-center text-sm
            ${selectedRank === rank ? selectedClass : unselectedClass}
          `}
          onClick={() => onSelectWinner(playerId, rank)}
        >
          {`${rank}${getRankSuffix(rank)}`}
        </div>
      ))}
    </div>
  );
};

export default RankSelector;