'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PlayerCard from '@/components/PlayerCard';
import Player from '@/type/interface/Player';
import Pot from '@/type/interface/Pot';
import case1 from '@/case/SidePot1';
import { Action, Stage } from '@/type/General';

const TEST = false;

export default function Game() {
  const searchParams = useSearchParams();

  // Game state
  const [players, setPlayers] = useState<Player[]>([]);
  const [pots, setPots] = useState<Pot[]>([{ amount: 0, eligiblePlayers: [] }]);
  const [smallBlind, setSmallBlind] = useState(1);
  const [bigBlind, setBigBlind] = useState(2);
  const [handNumber, setHandNumber] = useState(1);
  const [stage, setStage] = useState<Stage>('Preflop');
  const [currentBet, setCurrentBet] = useState(0);
  const [dealerIndex, setDealerIndex] = useState(0);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [showdownMode, setShowdownMode] = useState(false);
  const [selectedWinners, setSelectedWinners] = useState<number[]>([]);
  const [bustedPlayers, setBustedPlayers] = useState<Player[]>([]);

  // State for trigger useEffect
  const [reset, setReset] = useState(false);
  const [initialed, setInitialed] = useState(false);

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
    const buyIn = Number(searchParams.get('buyIn') || 100);
    let sb = Number(searchParams.get('smallBlind') || 1);
    let bb = Number(searchParams.get('bigBlind') || 2);
    setSmallBlind(sb);
    setBigBlind(bb);

    if (TEST) {
      const { players, currentBet, pots, stage, dealerIndex, activePlayerIndex, initialed } = case1;
      setPlayers(players)
      setCurrentBet(currentBet)
      setPots(pots)
      setStage(stage)
      setDealerIndex(dealerIndex)
      setActivePlayerIndex(activePlayerIndex)
      setInitialed(initialed)
    } else {
      const initialPlayers = Array.from({ length: playerCount }, (_, i) => {
        const position = positions(playerCount)[i];
        let currentBet = 0;
        let chips = buyIn;
    
        return {
          id: i + 1,
          name: `Player ${i + 1}`, // Default name
          chips,
          initialChips: chips,
          position,
          hasFolded: false,
          currentBet,
          hasActed: false,
          chipChange: 0, // Initialize chipChange
        };
      });
      setPlayers(initialPlayers);
      setCurrentBet(bb);
      setActivePlayerIndex(playerCount === 2 ? 0 : 3 % playerCount); // Start with the player after BB
      setInitialed(true);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("initialed", players)
    if (initialed) {
      console.log("smallBlind", smallBlind)
      console.log("bigBlind", bigBlind)
      for (let player of players) {
        if (player.position === 'SB') {
          player.currentBet = smallBlind;
          player.chips -= smallBlind;
        } else if (player.position === 'BB') {
          player.currentBet = bigBlind;
          player.chips -= bigBlind;
        } else if (player.position === "BTN" && players.length === 2) {
          // When there are only 2 players, the BTN acts as the SB
          player.currentBet = smallBlind;
          player.chips -= smallBlind;
        }
      }
      setPlayers(players);
      setInitialed(false);
    } 
  }, [initialed, players]);

  useEffect(() => {
    if (reset) {
      nextHand();
      setReset(false);
    }
  }, [reset]);

  const resetBetsAndUpdateActivePlayer = () => {
    console.log("resetBetsAndUpdateActivePlayer", players) 
    setPlayers(players.map(player => ({ 
      ...player, 
      currentBet: 0, 
      hasActed: false
    })));
    setCurrentBet(0);
    let nextPlayerIndex = players.length === 2 ? players.findIndex(p => p.position === 'BB') : players.findIndex(p => p.position === 'SB');
    while (players[nextPlayerIndex].hasFolded || players[nextPlayerIndex].chips === 0) {
      nextPlayerIndex = nextPlayerIndex + 1 % players.length === players.length ? 0 : nextPlayerIndex + 1;
    }
    setActivePlayerIndex(nextPlayerIndex);
  };

  const handleNameChange = (id: number, name: string) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, name } : player
    ));
  };

  const handleChipsChange = (id: number, chips: number) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, chips } : player
    ));
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

  // First case: BTN stays in the players list
  // UTG, HJ, BTN, SB, BB
  // UTG, BTN, SB
  // SB, BB, BTN

  // Second case: BTN is removed from the players list
  // Finding the new BTN by knowing the next player 
  // UTG, HJ, BTN, SB, BB
  // UTG, SB, BB
  
  // BB, BTN, SB

  // BB, UTG, HJ, BTN, SB
  // UTG, HJ, BTN
  // BTN, SB, BB

  const nextHand = () => {
    let newPlayers: Player[] = [];
    let tempBustedPlayers: Player[] = [...bustedPlayers];
    let bustedPlayerMap = new Map<string, Player>();
    let btnAt = 0;
    let btnNextLocation: string | null = null;
    players.forEach((p, i) => {
      if (p.chips === 0) { 
        tempBustedPlayers.push({ ...p, originalIndex: i })
        bustedPlayerMap.set(p.position, p);
      }
      else { 
        newPlayers.push(p)
        if (p.position === "BTN") btnAt = newPlayers.length - 1
        if (bustedPlayerMap.has("BTN")) {
          btnNextLocation = p.position;
        }
      }
    })
    tempBustedPlayers = tempBustedPlayers.sort((a, b) => (a.originalIndex as number) - (b.originalIndex as number));
    setBustedPlayers(tempBustedPlayers);

    // // If BTN isn't busted
    // if (!bustedPlayerMap.has("BTN")) {
    //   setDealerIndex((btnAt + 1) % newPlayers.length)
    // }
    // If BTN is busted
    if (bustedPlayerMap.has("BTN")) {
      newPlayers.forEach((p, i) => {
        if (p.position === btnNextLocation) {
          btnAt = i;
        }
      })
    }

    setHandNumber(handNumber + 1);
    setStage('Preflop');
    // setDealerIndex((dealerIndex + 1) % newPlayers.length);

    const rotatedPositions = rotatePositions(newPlayers, btnAt + 1);
    // Set initial bets for SB and BB
    newPlayers = rotatedPositions.map((player: Player, index: number) => {
      let params: Player = {
        ...player,
        // initialChips: player.chips,
        hasFolded: false,
        currentBet: 0,
        hasActed: false,
      }
      if (player.position === 'SB') {
        params.chips -= smallBlind;
        params.currentBet = smallBlind;
        // params.chipChange -= smallBlind; // Update chipChange for SB
      } else if (player.position === 'BB') {
        params.chips -= bigBlind;
        params.currentBet = bigBlind;
        // params.chipChange -= bigBlind; // Update chipChange for BB
      }
      return params;
    })
    
    
    setCurrentBet(bigBlind);

    const bbIndex = rotatedPositions.findIndex(p => p.position === 'BB');
    setActivePlayerIndex(bbIndex + 1 === players.length ? 0 : bbIndex + 1);
    
    // Set new players to state
    setPlayers(newPlayers);
  };

  const rotatePositions = (currentPlayers: Player[], newDealerIndex: number): Player[] => {
    const newPositions = positions(currentPlayers.length);
    console.log("newPositions", currentPlayers.map((player, index) => ({
      ...player,
      position: newPositions[(index - newDealerIndex + currentPlayers.length) % currentPlayers.length],
    })))
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
    console.log("handleAction activePlayerIndex", activePlayerIndex)
    const player = players[activePlayerIndex];
    let newPlayers = [...players];
    let newCurrentBet = currentBet;
    let newPots = [...pots];
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
        break;
      // case 'Call':
      //   {
      //     const callAmount = Math.min(currentBet - player.currentBet, player.chips);
      //     newPlayers[activePlayerIndex].chips -= callAmount;
      //     newPlayers[activePlayerIndex].currentBet += callAmount;
      //     newPots = updatePots(newPots, newPlayers, activePlayerIndex, callAmount);
      //   }
      //   break;
      case 'Call':
      case 'Bet':
      case 'Raise':
      case 'ALL IN':
        let betAmount;
        if (action === "Call") {
          if (currentBet > player.chips) {
            betAmount = player.chips
          } else {
            betAmount = Math.min(currentBet - player.currentBet, player.chips);
          }
        } else if (action === "ALL IN") {
          betAmount = player.chips;
        } else {
          if (!amount || amount < currentBet * 2) {
            console.error('Invalid bet amount');
            return;
          }
          betAmount = Math.min(amount - player.currentBet, player.chips);
        }
        newPlayers[activePlayerIndex].chips -= betAmount;
        newPlayers[activePlayerIndex].currentBet += betAmount;
        newCurrentBet = Math.max(newCurrentBet, newPlayers[activePlayerIndex].currentBet);
        
        if (action === 'Bet' || action === 'Raise') {
          // Reset hasActed for all players except the current player and folded players
          newPlayers = newPlayers.map(p => ({
            ...p,
            hasActed: p.id === player.id || p.hasFolded ? p.hasActed : false
          }));
        }
        
        break;
      } 
    
    let activePlayers = newPlayers.filter(p => !p.hasFolded);
    // If all active players goes all in
    let allPlayerAllIn = activePlayers.every(player => player.chips === 0);
    {
      if (allPlayerAllIn) {
        let highestBet = -Infinity;
        let secondHighestBet = -Infinity;
        if (players.length === 2) {
          secondHighestBet = Math.min(players[0].currentBet, players[1].currentBet);
          return players.filter(player => player.currentBet > secondHighestBet);   
        }
  
        for (const player of activePlayers) {
          if (player.currentBet > highestBet) {
            secondHighestBet = highestBet;
            highestBet = player.currentBet;
          } else if (player.currentBet > secondHighestBet && player.currentBet < highestBet) {
            secondHighestBet = player.currentBet;
          }
        }
        // All all in players have equal bet
        if (secondHighestBet === -Infinity) {
          secondHighestBet = highestBet;
        }
        
        // For all players which their bet are higher than others bet, they get back the remaining chips
        for (let player of newPlayers) {
          console.log("player", player)
          console.log("secondHighestBet", secondHighestBet)
          if (player.currentBet > secondHighestBet) {
            player.chips = player.currentBet - secondHighestBet;
            player.currentBet = secondHighestBet;
            newCurrentBet = player.currentBet;
          }
        }
      }
    }
    console.log("handleAction", newPlayers)
    setPlayers(newPlayers);
    setCurrentBet(newCurrentBet);
    
    // Check if only one player remains after this action
    if (checkForLastPlayerStanding(newPlayers)) {
      return;
    }
    
    // Check if the round is complete
    if (isRoundComplete(newPlayers, newCurrentBet)) {
      // Update pots after each action
      newPots = updatePots(newPots, newPlayers);
      setPots(newPots);

      if (stage === 'River' || allPlayerAllIn) {
        endHand();
      } else {
        nextStage();
      }
    } else {
      moveToNextPlayer(newPlayers);
    }
  };

  const isRoundComplete = (currentPlayers: Player[], currentBet: number): boolean => {
    const activePlayers = currentPlayers.filter(p => !p.hasFolded && p.chips !== 0);
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


  const updatePots = (currentPots: Pot[], currentPlayers: Player[]): Pot[] => {
    // if (currentPlayers[activePlayerIndex].hasFolded) return currentPots;
    let newPots: Pot[] = [...currentPots];
    let activePlayers = currentPlayers.filter(p => !p.hasFolded && p.hasActed);
    let allInPlayers = activePlayers.filter(p => p.chips === 0);
    let remainingBets = currentPlayers.map(p => p.currentBet);
    if (allInPlayers.length > 1) {
      // Sort all-in players by their bet amount, lowest to highest
      allInPlayers.sort((a, b) => a.currentBet - b.currentBet);
      // Create or update pots for each all-in player
      allInPlayers.forEach((allInPlayer, index) => {
        let potAmount = 0;
        let eligiblePlayers = activePlayers.filter(p => p.currentBet >= allInPlayer.currentBet).map(p => p.id);
        
        let updatedBetIndex: number[] = [];
        remainingBets = remainingBets.map((bet, index) => {
          console.log(bet, allInPlayer.currentBet)
          if (bet >= allInPlayer.currentBet) {
            potAmount += allInPlayer.currentBet;
            updatedBetIndex.push(index)
            return bet - allInPlayer.currentBet;
          }
          return 0;
        });

        updatedBetIndex.forEach(i => {
          const betOwner = currentPlayers[i];
          allInPlayers.forEach((p) => {
            // Find out the bet owner in allInPlayers array
            if (betOwner.id === p.id) {
              // Set their currentBet to new value
              p.currentBet -= allInPlayer.currentBet
            }
          })
        })
        // Find existing pot or create new one
        let potIndex = newPots.findIndex(pot => 
          pot.eligiblePlayers.length === eligiblePlayers.length && 
          pot.eligiblePlayers.every(id => eligiblePlayers.includes(id))
        );
        if (stage === "Preflop") potIndex = 0;
        
        if (potIndex !== -1) {
          console.log("potAmount", potAmount)
          console.log("eligiblePlayers", eligiblePlayers)
          newPots[potIndex].amount = potAmount;
          newPots[potIndex].eligiblePlayers = eligiblePlayers;
        } else {
          newPots.push({ amount: potAmount, eligiblePlayers });
        }
      });
    }

    // Create or update main pot with remaining bets
    let mainPotAmount = remainingBets.reduce((sum, bet) => sum + bet, 0);
    if (mainPotAmount > 0) {
      let eligiblePlayers = activePlayers.filter(p => p.currentBet > 0).map(p => p.id);
      // console.log("mainPotAmount", mainPotAmount)
      // console.log("eligiblePlayers", eligiblePlayers)
      // Find existing main pot or create new one
      let mainPotIndex = newPots.findIndex(pot => 
        pot.eligiblePlayers.length === eligiblePlayers.length && 
        pot.eligiblePlayers.every(id => eligiblePlayers.includes(id))
      );
      if (stage === "Preflop") mainPotIndex = 0;
      
      if (mainPotIndex !== -1) {
        console.log("NONONONONON")
        console.log(mainPotAmount)
        newPots[mainPotIndex].amount += mainPotAmount;
        newPots[mainPotIndex].eligiblePlayers = eligiblePlayers;
      } else {
        newPots.push({ amount: mainPotAmount, eligiblePlayers });
      }
    }
    return newPots;
  };

  const declareWinners = (winnerIds: number[]) => {
    if (winnerIds.length === 0) return;

    const newPlayers = [...players];
    let remainingPots = [...pots];
    console.log("remainingPots", remainingPots)
  
    const settle = (winners: number[], pot: Pot) => {
      const share = Math.floor(pot.amount / winners.length);
      const remainder = pot.amount % winners.length;
      winners.forEach((winnerId, index) => {
        const winnerIndex = newPlayers.findIndex(p => p.id === winnerId);
        newPlayers[winnerIndex].chips += share;
        // Distribute remainder chips to the first winner(s)
        if (index < remainder) {
          newPlayers[winnerIndex].chips += 1;
        }
      });
    }
    
    remainingPots.forEach((pot, index) => {
      const eligibleWinners = winnerIds.filter(id => pot.eligiblePlayers.includes(id));
      // If this pot has eligible winners
      if (eligibleWinners.length > 0) {
        settle(eligibleWinners, pot)
      } else {
        // If this pot is a side pot, and winner is not in this side pot, distribute the pot evenly
        if (index > 0) {
          settle(pot.eligiblePlayers, pot)
        }
      }

    });

    // Calculate changes for this hand
    newPlayers.forEach(player => {
      // console.log(player)
      // console.log(player.chips)
      // console.log(player.initialChips)
      // Calculate the change based on initial chips
      let handChange = player.chips - player.initialChips;

      // Update the cumulative chipChange
      player.chipChange = handChange;
    });
  
    setPlayers(newPlayers);
    setPots([{ amount: 0, eligiblePlayers: [] }]);
    setShowdownMode(false);
    setSelectedWinners([]);
    setReset(true);
  };

  const extractGameState = () => {
    console.log({
      players,
      currentBet,
      pots,
      stage,
      dealerIndex,
      activePlayerIndex,
      initialed,
    });
  };

  const mappingPlayers = (): Player[] => {
    if (bustedPlayers.length === 0) return players;

    let newPlayers: Player[] = [];
    let bustedPlayersMap = new Map<number, Player>();
    bustedPlayers.forEach(p => {
      // Busted player must have originalIndex
      if (p.originalIndex !== undefined && p.originalIndex !== null) bustedPlayersMap.set(p.originalIndex, p);
    })

    // Combine players and busted players
    let playerIndex = 0;
    for (let i=0; i<players.length + bustedPlayers.length; i++) {
      if (bustedPlayersMap.has(i)) {
        newPlayers.push(bustedPlayersMap.get(i) as Player);
      } else {
        newPlayers.push(players[playerIndex]);
        playerIndex++;
      }
    }
    return newPlayers;
  }

  const buyIn = (playerId: number, chips: number) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      player.chips = chips;
    }
    setPlayers(players);
  }

  // ic: 10000

  // currentChip: 8800
  // change: -1200

  // buy in: 10000
  // currentChip: 18800

  // 18800 - 10000 
  // initialChip - (currentChip - buyIn) = hasChangedChip
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Poker Game</h1>
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Hand #{handNumber}</h2>
          <p className="text-lg">Current Stage: {stage}</p>
          <p className="text-lg">Total Pot: ${pots.reduce((sum, pot) => sum + pot.amount, 0)}</p>
          {pots.length > 1 && (
            <div className="mt-2">
              <p className="text-md font-semibold">Pots:</p>
              {pots.map((pot, index) => (
                <p key={index} className="text-sm">
                  {index === pots.length - 1 ? "Main Pot" : `Side Pot ${index + 1}`}: ${pot.amount}
                </p>
              ))}
            </div>
          )}
          <p className="text-lg">Current Bet: ${currentBet}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mappingPlayers().map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              isActive={index === activePlayerIndex}
              currentBet={currentBet}
              bigBlind={bigBlind}
              onAction={handleAction}
              onNameChange={handleNameChange}
              onChipsChange={handleChipsChange}
            />
          ))}
        </div>
        <div className="flex flex-row gap-4">
          <button
            onClick={extractGameState}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Extract
          </button>
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