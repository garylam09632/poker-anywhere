import React, { useState } from 'react';

interface Player {
  id: number;
  chips: number;
  position: string;
  hasFolded: boolean;
  currentBet: number;
}

type Action = 'Check' | 'Call' | 'Bet' | 'Raise' | 'Fold';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  currentBet: number;
  onAction: (action: Action, amount?: number) => void;
}

export default function PlayerCard({ player, isActive, currentBet, onAction }: PlayerCardProps) {
  const [betAmount, setBetAmount] = useState(currentBet * 2);

  const getAvailableActions = (): Action[] => {
    const actions: Action[] = ['Fold'];
    if (currentBet === 0) {
      actions.push('Check', 'Bet');
    } else if (player.currentBet < currentBet) {
      actions.push('Call', 'Raise');
    } else {
      actions.push('Check', 'Raise');
    }
    return actions;
  };

  const handleAction = (action: Action) => {
    if (action === 'Bet' || action === 'Raise') {
      onAction(action, betAmount);
    } else {
      onAction(action);
    }
  };

  return (
    <div className={`bg-gray-700 p-4 rounded-lg ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
      <h3 className="text-xl font-semibold mb-2">Player {player.id}</h3>
      <p>Position: {player.position}</p>
      <p>Chips: ${player.chips}</p>
      <p>Current Bet: ${player.currentBet}</p>
      {player.hasFolded && <p className="text-red-500">Folded</p>}
      {isActive && (
        <div className="mt-2">
          {getAvailableActions().map(action => (
            <React.Fragment key={action}>
              {(action === 'Bet' || action === 'Raise') && (
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(currentBet * 2, Number(e.target.value)))}
                  min={currentBet * 2}
                  max={player.chips}
                  className="w-20 mr-2 px-2 py-1 bg-gray-600 text-white rounded"
                />
              )}
              <button
                onClick={() => handleAction(action)}
                className="mr-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                {action}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}