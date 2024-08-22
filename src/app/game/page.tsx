'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PlayerCard from '@/components/PlayerCard';
import BettingRoundBar from '@/components/BettingRoundBar';
import WinnerSelection from '@/components/WinnerSelection';

type BettingRound = 'Pre-flop' | 'Flop' | 'Turn' | 'River';

interface Player {
  name: string;
  money: number;
  hasFolded: boolean;
  currentBet: number;
  position: string;
}

export default function Game() {
  const searchParams = useSearchParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [pot, setPot] = useState(0);
  const [smallBlind, setSmallBlind] = useState(0);
  const [bigBlind, setBigBlind] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentBettingRound, setCurrentBettingRound] = useState<BettingRound>('Pre-flop');
  const [highestBet, setHighestBet] = useState(0);
  const [dealerPosition, setDealerPosition] = useState(0);
  const [showWinnerSelection, setShowWinnerSelection] = useState(false);

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
        currentBet: 0,
        position: '',
      }))
    );

    setDealerPosition(0);
    setHighestBet(bigBlind);
  }, [searchParams]);

  useEffect(() => {
    updatePlayerPositions();
    setCurrentPlayerIndex(getFirstPlayerIndex());
  }, [dealerPosition, players.length, currentBettingRound]);

  const updatePlayerPositions = () => {
    const positions = (() => {
      switch (players.length) {
        case 2: return ['BTN', 'BB'];
        case 3: return ['SB', 'BB', 'BTN'];
        case 4: return ['SB', 'BB', 'UTG', 'BTN'];
        case 5: return ['SB', 'BB', 'UTG', 'CO', 'BTN'];
        default: {
          const utgPositions = players.length > 5 
            ? Array(players.length - 5).fill('').map((_, i) => `UTG${i > 0 ? `+${i}` : ''}`)
            : [];
          return ['SB', 'BB', ...utgPositions, 'CO', 'BTN'];
        }
      }
    })();

    setPlayers(prevPlayers => 
      prevPlayers.map((player, index) => ({
        ...player,
        position: positions[(index - dealerPosition + players.length) % players.length]
      }))
    );
  };

  const getFirstPlayerIndex = () => {
    if (currentBettingRound === 'Pre-flop') {
      return players.length === 2 ? dealerPosition : (dealerPosition + 3) % players.length;
    } else {
      return (dealerPosition + 1) % players.length;
    }
  };

  const handleBet = (index: number, amount: number) => {
    if (index !== currentPlayerIndex) return;

    setPlayers(prevPlayers => 
      prevPlayers.map((player, i) => 
        i === index ? { ...player, money: player.money - (amount - player.currentBet), currentBet: amount } : player
      )
    );
    setPot(prevPot => prevPot + (amount - players[index].currentBet));
    setHighestBet(Math.max(highestBet, amount));
    nextTurn();
  };

  const handleFold = (index: number) => {
    if (index !== currentPlayerIndex) return;

    setPlayers(prevPlayers => 
      prevPlayers.map((player, i) => 
        i === index ? { ...player, hasFolded: true } : player
      )
    );
    nextTurn();
  };

  const nextTurn = () => {
    const activePlayers = players.filter(p => !p.hasFolded);
    if (activePlayers.length === 1) {
      handleWinnerSelection(players.findIndex(p => !p.hasFolded));
      return;
    }

    const allPlayersBetEqual = activePlayers.every(p => p.currentBet === highestBet);
    if (allPlayersBetEqual) {
      if (currentBettingRound === 'River') {
        setShowWinnerSelection(true);
        return;
      }
      moveToNextBettingRound();
      return;
    }

    let nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    while (players[nextPlayerIndex].hasFolded) {
      nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
    }
    setCurrentPlayerIndex(nextPlayerIndex);
  };

  const moveToNextBettingRound = () => {
    const rounds: BettingRound[] = ['Pre-flop', 'Flop', 'Turn', 'River'];
    const currentIndex = rounds.indexOf(currentBettingRound);
    setCurrentBettingRound(rounds[currentIndex + 1]);
    setHighestBet(0);
    setPlayers(prevPlayers => 
      prevPlayers.map(player => ({ ...player, currentBet: 0 }))
    );
    setCurrentPlayerIndex(getFirstPlayerIndex());
  };

  const handleWinnerSelection = (winnerIndex: number) => {
    setPlayers(prevPlayers => 
      prevPlayers.map((player, index) => 
        index === winnerIndex ? { ...player, money: player.money + pot } : player
      )
    );
    setPot(0);
    startNewRound();
  };

  const handleDraw = () => {
    const activePlayers = players.filter(p => !p.hasFolded);
    const splitAmount = Math.floor(pot / activePlayers.length);
    setPlayers(prevPlayers => 
      prevPlayers.map(player => 
        player.hasFolded ? player : { ...player, money: player.money + splitAmount }
      )
    );
    setPot(pot % activePlayers.length);
    startNewRound();
  };

  const startNewRound = () => {
    setShowWinnerSelection(false);
    setCurrentBettingRound('Pre-flop');
    setHighestBet(bigBlind);
    setDealerPosition((prevPosition) => (prevPosition + 1) % players.length);
    setPlayers(prevPlayers => 
      prevPlayers.map(player => ({ ...player, hasFolded: false, currentBet: 0 }))
    );
    // Small and Big Blinds will be set in the next useEffect call
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
                onNameChange={(newName) => setPlayers(prevPlayers => 
                  prevPlayers.map((p, i) => i === index ? { ...p, name: newName } : p)
                )}
                onBet={(amount) => handleBet(index, amount)}
                onFold={() => handleFold(index)}
                isCurrentPlayer={index === currentPlayerIndex}
                highestBet={highestBet}
              />
            ))}
          </div>
        </div>
        {showWinnerSelection && (
          <WinnerSelection
            players={players}
            onSelectWinner={handleWinnerSelection}
            onDraw={handleDraw}
          />
        )}
      </div>
    </div>
  );
}