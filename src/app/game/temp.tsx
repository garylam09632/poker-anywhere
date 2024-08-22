'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PlayerCard from '@/components/PlayerCard';

interface Player {
  id: number;
  chips: number;
  position: string;
  hasFolded: boolean;
  currentBet: number;
  hasActed: boolean; // New property to track if the player has acted in the current round
}

type Stage = 'Preflop' | 'Flop' | 'Turn' | 'River';
type Action = 'Check' | 'Call' | 'Bet' | 'Raise' | 'Fold';

export default function Game() {
  const searchParams = useSearchParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [handNumber, setHandNumber] = useState(1);
  const [stage, setStage] = useState<Stage>('Preflop');
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [dealerIndex, setDealerIndex] = useState(0);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [smallBlind, setSmallBlind] = useState(1);
  const [bigBlind, setBigBlind] = useState(2);
  const [showdownMode, setShowdownMode] = useState(false);
  const [reset, setReset] = useState(false);
  const [selectedWinners, setSelectedWinners] = useState<number[]>([]);

  const positions = (length: number) => {
    if (length === 2) {
      return ['BTN', 'BB'];
    } else if (length === 3) {
      return ['BTN', 'SB', 'BB'];
    } else {
      return ['BTN', 'SB', 'BB', ...Array(Math.max(0, length - 3)).fill('').map((_, i) => `Player ${i + 4}`)]
    }
  }

  useEffect(() => {
    const playerCount = Number(searchParams.get('players') || 2);
    const sb = Number(searchParams.get('smallBlind') || 1);
    const bb = Number(searchParams.get('bigBlind') || 2);
    const buyIn = Number(searchParams.get('buyIn') || 100);

    setSmallBlind(sb);
    setBigBlind(bb);
    const initialPlayers = Array.from({ length: playerCount }, (_, i) => {
      const position = positions(playerCount)[i];
      let currentBet = 0;
      let chips = buyIn;
  
      if (position === 'SB') {
        currentBet = sb;
        chips -= sb;
      } else if (position === 'BB') {
        currentBet = bb;
        chips -= bb;
      }
  
      return {
        id: i + 1,
        chips,
        position,
        hasFolded: false,
        currentBet,
        hasActed: false, // Initialize hasActed to false for all players
      };
    });
    setPlayers(initialPlayers);
    setCurrentBet(bb);
    setPot(sb + bb);
    setActivePlayerIndex(3 % playerCount); // Start with the player after BB
  }, [searchParams]);

  useEffect(() => {
    if (reset) {
      nextHand();
      setReset(false);
    }
  }, [reset]);

  const resetBetsAndUpdateActivePlayer = () => {
    setPlayers(players.map(player => ({ 
      ...player, 
      currentBet: 0, 
      hasActed: false 
    })));
    setCurrentBet(0);
    let nextPlayerIndex = players.findIndex(p => p.position === 'SB');
    while (players[nextPlayerIndex].hasFolded || players[nextPlayerIndex].chips === 0) {
      nextPlayerIndex = nextPlayerIndex + 1 % players.length === players.length ? 0 : nextPlayerIndex + 1;
    }
    setActivePlayerIndex(nextPlayerIndex);
  };

  const nextStage = () => {
    switch (stage) {
      case 'Preflop':
        setStage('Flop');
        break;
      case 'Flop':
        setStage('Turn');
        break;
      case 'Turn':
        setStage('River');
        break;
      case 'River':
        nextHand();
        break;
    }
    resetBetsAndUpdateActivePlayer();
  };

  const nextHand = () => {
    setHandNumber(handNumber + 1);
    setStage('Preflop');
    console.log((dealerIndex + 1) % players.length);
    setDealerIndex((dealerIndex + 1) % players.length);
    setPot(0);

    const rotatedPositions = rotatePositions(players, dealerIndex + 1);
    
    // Set initial bets for SB and BB
    setPlayers(rotatedPositions.map((player: Player, index: number) => {
      let params: Player = {
        ...player,
        hasFolded: false,
        currentBet: 0,
        hasActed: false,
      }
      if (index === 1) {
        params.chips -= smallBlind;
        params.currentBet = smallBlind;
      } else if (index === 2) {
        params.chips -= bigBlind;
        params.currentBet = bigBlind;
      }
      return params;
    }));

    setCurrentBet(bigBlind);
    setPot(smallBlind + bigBlind);
    setActivePlayerIndex(3 % players.length);
  };

  const rotatePositions = (currentPlayers: Player[], newDealerIndex: number): Player[] => {
    const newPositions = positions(currentPlayers.length);
    return currentPlayers.map((player, index) => ({
      ...player,
      position: newPositions[(index - newDealerIndex + currentPlayers.length) % currentPlayers.length],
    }));
  };

  const checkForLastPlayerStanding = (currentPlayers: Player[]): boolean => {
    const activePlayers = currentPlayers.filter(p => !p.hasFolded);
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      declareWinners([winner.id]);
      nextHand();
      return true;
    }
    return false;
  };

  const handleAction = (action: Action, amount?: number) => {
    const player = players[activePlayerIndex];
    let newPlayers = [...players];
    let newCurrentBet = currentBet;

    // Mark the player as having acted
    newPlayers[activePlayerIndex].hasActed = true;

    switch (action) {
      case 'Fold':
        newPlayers[activePlayerIndex].hasFolded = true;
        // Immediately check if only one player remains
        if (checkForLastPlayerStanding(newPlayers)) {
          return; // Exit the function if the hand is over
        }
        break;
      case 'Check':
        // No additional action needed
        newPlayers[activePlayerIndex].hasActed = true;
        break;
      case 'Call':
        {
          const callAmount = Math.min(currentBet - player.currentBet, player.chips);
          newPlayers[activePlayerIndex].chips -= callAmount;
          newPlayers[activePlayerIndex].currentBet += callAmount;
          setPot(pot + callAmount);
        }
        break;
      case 'Bet':
      case 'Raise':
        {
          if (!amount || amount < currentBet * 2) {
            console.error('Invalid bet amount');
            return;
          }
          const betAmount = Math.min(amount - player.currentBet, player.chips);
          newPlayers[activePlayerIndex].chips -= betAmount;
          newPlayers[activePlayerIndex].currentBet += betAmount;
          newCurrentBet = newPlayers[activePlayerIndex].currentBet;
          setPot(pot + betAmount);
          
          // Reset hasActed for all players except the current player and folded players
          newPlayers = newPlayers.map(p => ({
            ...p,
            hasActed: p.id === player.id || p.hasFolded ? p.hasActed : false
          }));
        }
        break;
    }

    setPlayers(newPlayers);
    setCurrentBet(newCurrentBet);

    // Check if only one player remains after this action
    checkForLastPlayerStanding(newPlayers);

    // Check if the round is complete
    if (isRoundComplete(newPlayers, newCurrentBet)) {
      if (stage === 'River') {
        endHand();
      } else {
        nextStage();
      }
    } else {
      moveToNextPlayer(newPlayers);
    }
  };

  const isRoundComplete = (currentPlayers: Player[], currentBet: number): boolean => {
    const activePlayers = currentPlayers.filter(p => !p.hasFolded);
    const playersWithChips = activePlayers.filter(p => p.chips > 0);
    
    // All players are all-in or have matched the current bet
    const allEqualBets = playersWithChips.every(p => p.currentBet === currentBet || p.chips === 0);
    
    // All players have acted
    const allPlayersActed = activePlayers.every(p => p.hasActed);
    
    return allEqualBets && allPlayersActed;
  };

  const moveToNextPlayer = (currentPlayers: Player[]) => {
    let nextPlayerIndex = (activePlayerIndex + 1) % currentPlayers.length;
    while (currentPlayers[nextPlayerIndex].hasFolded || currentPlayers[nextPlayerIndex].chips === 0) {
      nextPlayerIndex = nextPlayerIndex + 1 % currentPlayers.length === currentPlayers.length ? 0 : nextPlayerIndex + 1;
    }
    setActivePlayerIndex(nextPlayerIndex);
  };

  const endHand = () => {
    setShowdownMode(true);
  };

  const toggleWinner = (playerId: number) => {
    setSelectedWinners(prev => 
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const declareWinners = (winnerIds: number[]) => {
    if (winnerIds.length === 0) return;

    const winningAmount = Math.floor(pot / winnerIds.length);
    const remainingChips = pot % winnerIds.length;

    const newPlayers = players.map(player => {
      if (winnerIds.includes(player.id)) {
        return { ...player, chips: player.chips + winningAmount };
      }
      return player;
    });

    // Distribute any remaining chips to the first winner (in case of uneven division)
    if (remainingChips > 0) {
      const firstWinnerId = winnerIds[0];
      const firstWinnerIndex = newPlayers.findIndex(p => p.id === firstWinnerId);
      newPlayers[firstWinnerIndex].chips += remainingChips;
    }

    setPlayers(newPlayers);
    setPot(0);
    setShowdownMode(false);
    setSelectedWinners([]);
    setReset(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Poker Game</h1>
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Hand #{handNumber}</h2>
          <p className="text-lg">Current Stage: {stage}</p>
          <p className="text-lg">Current Pot: ${pot}</p>
          <p className="text-lg">Current Bet: ${currentBet}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              isActive={index === activePlayerIndex}
              currentBet={currentBet}
              onAction={handleAction}
            />
          ))}
        </div>
      </div>

      {showdownMode && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Select Winner(s)</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {players.filter(p => !p.hasFolded).map(player => (
              <button
                key={player.id}
                onClick={() => toggleWinner(player.id)}
                className={`font-bold py-2 px-4 rounded ${
                  selectedWinners.includes(player.id)
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                Player {player.id}
              </button>
            ))}
          </div>
          <button
            onClick={() => declareWinners(selectedWinners)}
            disabled={selectedWinners.length === 0}
            className={`font-bold py-2 px-4 rounded ${
              selectedWinners.length > 0
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white`}
          >
            Declare Winner(s)
          </button>
        </div>
      )}
    </div>
  );
}