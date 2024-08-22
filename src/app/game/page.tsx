'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PlayerCard from '../../components/PlayerCard';
import BettingRoundBar from '../../components/BettingRoundBar';

interface Player {
  name: string;
  money: number;
  hasFolded: boolean;
}

type BettingRound = 'Pre-flop' | 'Flop' | 'Turn' | 'River';

export default function Game() {
  const searchParams = useSearchParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [pot, setPot] = useState(0);
  const [smallBlind, setSmallBlind] = useState(0);
  const [bigBlind, setBigBlind] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentBettingRound, setCurrentBettingRound] = useState<BettingRound>('Pre-flop');
  const [currentBet, setCurrentBet] = useState(0);

  useEffect(() => {
    const playerCount = Number(searchParams.get('players') || 2);
    const buyIn = Number(searchParams.get('buyIn') || 100);
    setSmallBlind(Number(searchParams.get('smallBlind') || 1));
    setBigBlind(Number(searchParams.get('bigBlind') || 2));

    setPlayers(
      Array.from({ length: playerCount }, (_, i) => ({
        name: `Player ${i + 1}`,
        money: buyIn,
        hasFolded: false,
      }))
    );

    // Set initial bet to big blind
    setCurrentBet(Number(searchParams.get('bigBlind') || 2));
  }, [searchParams]);

  const handleNameChange = (index: number, newName: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, i) =>
        i === index ? { ...player, name: newName } : player
      )
    );
  };

  const handleBet = (index: number, amount: number) => {
    if (index !== currentPlayerIndex) return;

    setPlayers((prevPlayers) =>
      prevPlayers.map((player, i) =>
        i === index ? { ...player, money: player.money - amount } : player
      )
    );
    setPot((prevPot) => prevPot + amount);
    setCurrentBet(Math.max(currentBet, amount));
    nextTurn();
  };

  const handleFold = (index: number) => {
    if (index !== currentPlayerIndex) return;

    setPlayers((prevPlayers) =>
      prevPlayers.map((player, i) =>
        i === index ? { ...player, hasFolded: true } : player
      )
    );
    nextTurn();
  };

  const nextTurn = () => {
    let nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    while (players[nextPlayerIndex].hasFolded) {
      nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
    }

    if (nextPlayerIndex === 0) {
      // Move to the next betting round
      const rounds: BettingRound[] = ['Pre-flop', 'Flop', 'Turn', 'River'];
      const currentIndex = rounds.indexOf(currentBettingRound);
      if (currentIndex < rounds.length - 1) {
        setCurrentBettingRound(rounds[currentIndex + 1]);
        setCurrentBet(0);
      } else {
        // End of game logic here
        console.log('End of game');
      }
    }

    setCurrentPlayerIndex(nextPlayerIndex);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <BettingRoundBar currentRound={currentBettingRound} pot={pot} />
        <div className="flex justify-center mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl">
            {players.map((player, index) => (
              <PlayerCard
                key={index}
                player={player}
                onNameChange={(newName) => handleNameChange(index, newName)}
                onBet={(amount) => handleBet(index, amount)}
                onFold={() => handleFold(index)}
                isCurrentPlayer={index === currentPlayerIndex}
                currentBet={currentBet}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}