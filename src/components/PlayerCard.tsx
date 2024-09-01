import { NormalRule, Rule } from '@/type/class/Rules';
import { Action } from '@/type/General';
import Player from '@/type/interface/Player';
import React, { useState } from 'react';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  currentBet: number;
  bigBlind: number;
  onAction: (action: Action, amount?: number) => void;
  onNameChange: (id: number, name: string) => void; // New prop
  onChipsChange: (id: number, chips: number) => void; // New prop
}


export default function PlayerCard({ player, isActive, currentBet, bigBlind, onAction, onNameChange, onChipsChange  }: PlayerCardProps) {
  const [betAmount, setBetAmount] = useState(currentBet);
  const [rule, setRule] = useState<Rule>(new NormalRule())

  const getAvailableActions = (): Action[] => {
    const actions: Action[] = ['Fold'];
    if (currentBet === 0) {
      actions.push('Check', 'Bet', 'ALL IN');
    } else if (player.currentBet < currentBet) {
      actions.push('Call', 'Raise', 'ALL IN');
    } else {
      actions.push('Check', 'Raise', 'ALL IN');
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

  const onBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let bet = Number(e.target.value);
    if (rule.canBet(player, bet, currentBet, bigBlind)) {
      setBetAmount(bet);
    }
  }

  return (
    <div className={`bg-gray-700 p-4 rounded-lg ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
      <input
        type="text"
        value={player.name}
        onChange={(e) => onNameChange(player.id, e.target.value)}
        className="text-xl font-semibold mb-2 bg-gray-600 text-white rounded px-2 py-1 w-full"
      />
      <p>Position: {player.position}</p>
      <div className="flex items-center">
        <p>Chips: $</p>
        <input
          type="number"
          value={player.chips}
          onChange={(e) => onChipsChange(player.id, Number(e.target.value))}
          className="bg-gray-600 text-white rounded px-2 py-1 w-24 ml-1"
        />
      </div>
      <p>Current Bet: ${player.currentBet}</p>
      {player.chipChange !== 0 && (
        <p className={`font-bold ${player.chipChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {player.chipChange > 0 ? '+' : '-'}${Math.abs(player.chipChange)}
        </p>
      )}
      {player.hasFolded && <p className="text-red-500">Folded</p>}
      {isActive && (
        <div className="mt-2">
          {getAvailableActions().map(action => (
            <React.Fragment key={action}>
              {(action === 'Bet' || action === 'Raise') && (
                <input
                  type="number"
                  value={betAmount}
                  onChange={onBetChange}
                  // min={currentBet * 2}
                  max={player.chips}
                  className="w-20 mr-2 px-2 py-1 bg-gray-600 text-white rounded"
                />
              )}
              {
                action === "ALL IN" ? (
                  <button
                    onClick={() => handleAction("ALL IN")}
                    className="mr-2 mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    {action}
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(action)}
                    className="mr-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    {action}
                  </button>
                )
              }
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}