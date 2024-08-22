'use client';
import { useState } from 'react';

interface PlayerCardProps {
  player: {
    name: string;
    money: number;
    hasFolded: boolean;
    currentBet: number;
    position: string;
  };
  onNameChange: (newName: string) => void;
  onBet: (amount: number) => void;
  onFold: () => void;
  isCurrentPlayer: boolean;
  highestBet: number;
}

export default function PlayerCard({
  player,
  onNameChange,
  onBet,
  onFold,
  isCurrentPlayer,
  highestBet
}: PlayerCardProps) {
  const [betAmount, setBetAmount] = useState(highestBet);

  const canCheck = player.currentBet === highestBet;
  const canCall = player.currentBet < highestBet;
  const canRaise = player.money > highestBet - player.currentBet;

  return (
    <div className={`border p-4 rounded ${isCurrentPlayer ? 'bg-blue-900' : 'bg-gray-800'} ${player.hasFolded ? 'opacity-50' : ''}`}>
      <div className="text-sm mb-2">{player.position}</div>
      <input
        type="text"
        value={player.name}
        onChange={(e) => onNameChange(e.target.value)}
        className="font-bold mb-2 w-full bg-transparent"
      />
      <div className="text-xl">${player.money}</div>
      <div className="text-sm">Current bet: ${player.currentBet}</div>
      {!player.hasFolded && isCurrentPlayer && (
        <div className="mt-2">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            min={highestBet}
            max={player.money}
            className="border p-1 w-full bg-gray-700 text-white mb-2"
          />
          <div className="flex flex-wrap gap-2">
            {canCheck && (
              <button
                onClick={() => onBet(player.currentBet)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Check
              </button>
            )}
            {canCall && (
              <button
                onClick={() => onBet(highestBet)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Call ${highestBet - player.currentBet}
              </button>
            )}
            {canRaise && (
              <button
                onClick={() => onBet(betAmount)}
                className="bg-green-500 text-white px-2 py-1 rounded"
                disabled={betAmount <= highestBet || betAmount > player.money}
              >
                {player.currentBet === highestBet ? 'Raise' : 'Re-raise'}
              </button>
            )}
            <button
              onClick={onFold}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Fold
            </button>
          </div>
        </div>
      )}
      {player.hasFolded && <div className="mt-2 text-red-500">Folded</div>}
    </div>
  );
}