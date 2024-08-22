import { useState } from 'react';

interface PlayerCardProps {
  player: { name: string; money: number; hasFolded: boolean };
  onNameChange: (newName: string) => void;
  onBet: (amount: number) => void;
  onFold: () => void;
  isCurrentPlayer: boolean;
  currentBet: number;
}

export default function PlayerCard({ player, onNameChange, onBet, onFold, isCurrentPlayer, currentBet }: PlayerCardProps) {
  const [betAmount, setBetAmount] = useState(currentBet);

  return (
    <div className={`border p-4 rounded ${isCurrentPlayer ? 'bg-blue-900' : 'bg-gray-800'} ${player.hasFolded ? 'opacity-50' : ''}`}>
      <input
        type="text"
        value={player.name}
        onChange={(e) => onNameChange(e.target.value)}
        className="font-bold mb-2 w-full bg-transparent"
      />
      <div className="text-xl">${player.money}</div>
      {!player.hasFolded && isCurrentPlayer && (
        <div className="mt-2">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            min={currentBet}
            max={player.money}
            className="border p-1 w-20 bg-gray-700 text-white"
          />
          <button
            onClick={() => {
              onBet(betAmount);
              setBetAmount(currentBet);
            }}
            className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
            disabled={betAmount < currentBet || betAmount > player.money}
          >
            Bet
          </button>
          <button
            onClick={onFold}
            className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            Fold
          </button>
        </div>
      )}
      {player.hasFolded && <div className="mt-2 text-red-500">Folded</div>}
    </div>
  );
}