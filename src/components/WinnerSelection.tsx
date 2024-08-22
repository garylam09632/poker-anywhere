import React from 'react';

interface WinnerSelectionProps {
  players: { name: string; hasFolded: boolean }[];
  onSelectWinner: (index: number) => void;
  onDraw: () => void;
}

const WinnerSelection: React.FC<WinnerSelectionProps> = ({ players, onSelectWinner, onDraw }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Select the winner</h2>
        <div className="space-y-2">
          {players.map((player, index) => (
            !player.hasFolded && (
              <button
                key={index}
                onClick={() => onSelectWinner(index)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded"
              >
                {player.name}
              </button>
            )
          ))}
          <button
            onClick={onDraw}
            className="w-full bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Draw
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerSelection;