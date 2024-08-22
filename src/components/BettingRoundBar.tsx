import React from 'react';

type BettingRound = 'Pre-flop' | 'Flop' | 'Turn' | 'River';

interface BettingRoundBarProps {
  currentRound: BettingRound;
  pot: number;
}

const BettingRoundBar: React.FC<BettingRoundBarProps> = ({ currentRound, pot }) => {
  const rounds: BettingRound[] = ['Pre-flop', 'Flop', 'Turn', 'River'];

  return (
    <div className="bg-gray-800 p-4 mb-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {rounds.map((round) => (
            <div
              key={round}
              className={`px-3 py-1 rounded ${
                currentRound === round ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              {round}
            </div>
          ))}
        </div>
        <div className="text-xl font-bold text-white">Pot: ${pot}</div>
      </div>
    </div>
  );
};

export default BettingRoundBar;