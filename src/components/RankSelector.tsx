import useWindowSize from '@/hooks/useWindowSize';
import React, { useRef, useEffect, useState } from 'react';

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
  const [currentRank, setCurrentRank] = useState(selectedRank || 1);
  const { height } = useWindowSize();

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = Math.sign(e.deltaY);
        updateRank(delta);
      };

      const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        element.dataset.startY = touch.clientY.toString();
      };

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const startY = Number(element.dataset.startY || 0);
        const deltaY = startY - touch.clientY;
        if (Math.abs(deltaY) > 10) {
          updateRank(Math.sign(deltaY));
          element.dataset.startY = touch.clientY.toString();
        }
      };

      element.addEventListener('wheel', handleWheel, { passive: false });
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchmove', handleTouchMove);

      return () => {
        element.removeEventListener('wheel', handleWheel);
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [showdownMode, onSelectWinner, playerId]);

  const updateRank = (delta: number) => {
    setCurrentRank((prev) => {
      const newRank = Math.max(1, Math.min(showdownMode, prev + delta));
      onSelectWinner(playerId, newRank);
      return newRank;
    });
  };

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  const renderRank = (rank: number, isCenter: boolean) => (
    <div
      key={rank}
      className={`absolute left-0 right-0 transition-all duration-300 ease-in-out ${
        isCenter ? 'text-2xl sh:text-sm font-bold' : 'text-sm sh:text-xs opacity-50'
      }`}
      style={{
        transform: `translateY(${(rank - currentRank) * getRankSpacing()}px)`,
      }}
    >
      <div className="flex items-center justify-center">
        {`${rank}${getRankSuffix(rank)}`}
      </div>
    </div>
  );

  // Determine the appropriate rank spacing based on viewport width
  const getRankSpacing = (): number => {
    if (height && height < 480) return 22; // sh
    if (height && height < 640) return 26; // mh
    return 35; // default
  };

  return (
    <div 
      ref={scrollRef}
      className="w-full h-full flex items-center justify-center cursor-ns-resize overflow-hidden relative"
    >
      {[currentRank - 1, currentRank, currentRank + 1]
        .filter(rank => rank > 0 && rank <= showdownMode)
        .map(rank => renderRank(rank, rank === currentRank))}
    </div>
  );
};

export default RankSelector;
