'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import PlayerCard from '@/components/PlayerCard';
import Player from '@/type/interface/Player';
import Pot from '@/type/interface/Pot';
import case1 from '@/case/SidePot1';
import { Action, Stage } from '@/type/General';
import { useBuyIn } from '@/hooks/useBuyIn';

import BuyInModal from '@/components/BuyInModal';
import { Position } from '@/type/enum/Position';
import PlayerUnit from '@/components/PlayerUnit';
import { ActionButtons } from '@/components/ActionButtons';

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
  const [isEndRound, setIsEndRound] = useState(false);

  // Buy in state
  const {
    selectedPlayer,
    showBuyInModal,
    handlePlayerSelect,
    openBuyInModal,
    closeBuyInModal,
    handleBuyIn
  } = useBuyIn(players, bustedPlayers, setPlayers, setBustedPlayers);

  const [tableSize, setTableSize] = useState({ width: 0, height: 0 });

  // Use useRef to get a reference to the table div
  const tableRef = useRef<HTMLDivElement>(null);

  // Use useEffect to measure the table size after render
  useEffect(() => {
    if (tableRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setTableSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      });

      resizeObserver.observe(tableRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  const positions = (length: number): string[] => {
    if (length === 2) {
      return [Position.BTN, Position.BB];
    } else if (length === 3) {
      return [Position.BTN, Position.SB, Position.BB];
    } else if (length === 4) {
      return [Position.BTN, Position.SB, Position.BB, Position.UTG];
    } else if (length === 5) {
      return [Position.BTN, Position.SB, Position.BB, Position.UTG, Position.HJ];
    } else if (length === 6) {
      return [Position.BTN, Position.SB, Position.BB, Position.UTG, Position.HJ, Position.CO];
    } else if (length === 7) {
      return [Position.BTN, Position.SB, Position.BB, Position.UTG, Position.LJ, Position.HJ, Position.CO];
    } else {
      return [Position.BTN, Position.SB, Position.BB, Position.UTG, ...Array.from({ length: length - 7 }, (_, i) => `+${i+1}`), Position.LJ, Position.HJ, Position.CO];
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
      let eligiblePlayers: number[] = [];
      const initialPlayers = Array.from({ length: playerCount }, (_, i) => {
        const position = positions(playerCount)[i];
        let currentBet = 0;
        let chips = buyIn;
        eligiblePlayers.push(i + 1);
        return new Player(
          i + 1,
          `Player ${i + 1}`,
          chips,
          buyIn,
          position,
          currentBet,
          0,
          false,
          false,
          false
        )
      });
      setPlayers(initialPlayers);
      setCurrentBet(bb);
      setPots([{ amount: 0, eligiblePlayers }]);
      setActivePlayerIndex(playerCount === 2 ? 0 : 3 % playerCount); // Start with the player after BB
      setInitialed(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (initialed) {
      for (let player of players) {
        if (player.position === Position.SB) {
          player.currentBet = smallBlind;
          player.chips -= smallBlind;
        } else if (player.position === Position.BB) {
          player.currentBet = bigBlind;
          player.chips -= bigBlind;
          // As the last player who act will be the big blind
          player.hasActed = true;
        } else if (player.position === Position.BTN && players.length === 2) {
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
    if (isEndRound) {
      // If there is only one player left, declare the winner
      if (checkForLastPlayerStanding(players)) {
        // Logic executed in the function
      } 
      // If stage is river
      // If all players are all in
      // If there is only one player hasn't fold and all in, all other players are folded or all in
      else if (
        stage === 'River' || 
        players.every(player => player.chips === 0) ||
        players.length - 1 === (players.filter(p => p.chips === 0).length + players.filter(p => p.hasFolded).length)
      ) {
        // Showdown
        endHand();
      }
      else {
        nextStage();
      }
      setIsEndRound(false);
    }
  }, [isEndRound])

  useEffect(() => {
    if (reset) {
      nextHand();
      setReset(false);
    }
  }, [reset]);

  // TODO: Reset player bet smallBlind and bigBlind and maybe ante
  // SmallBlind should be not acted

  const resetBetsAndUpdateActivePlayer = () => {
    setPlayers(players.map(player => ({ 
      ...player, 
      currentBet: 0, 
      hasActed: false
    })));
    setCurrentBet(0);
    let nextPlayerIndex = players.length === 2 ? players.findIndex(p => p.position === Position.BB) : players.findIndex(p => p.position === Position.SB);
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

  const nextHand = () => {
    let tempPlayers: Player[] = players.map(p => ({...p}));
    let tempBustedPlayers: Player[] = bustedPlayers.map(p => ({...p}));
    let newPlayers: Player[] = [];
    let newBustedPlayers: Player[] = [];
    let bustedPlayerMap = new Map<string, Player>();
    let btnAt = 0;
    let btnNextPosition: string | null = null;

    // Busted player return to table handling (if any)
    
    // First case: BTN stays in the players list
    // Second case: BTN is removed from the players list
    // Finding the new BTN by knowing the next player 
    tempPlayers.forEach((p) => {
      if (p.tempBuyIn && p.tempBuyIn > 0) { 
        p.buyIn += p.tempBuyIn; // 100000 + tempBuyIn
        p.chips += p.tempBuyIn; // currentChips + tempBuyIn
        p.tempBuyIn = 0;
      }
    })
    tempBustedPlayers.forEach((p) => {
      if (p.tempBuyIn && p.tempBuyIn > 0) {
        p.buyIn += p.tempBuyIn;
        p.chips += p.tempBuyIn;
        p.tempBuyIn = 0;
        // Only place to set the status false to true
        p.hasBusted = false;
        tempPlayers.push(p);
      } else {
        // Still busted
        newBustedPlayers.push(p);
      }
    })
    // Sort the players by id
    tempPlayers = tempPlayers.sort((a, b) => (a.id as number) - (b.id as number));

    // Busted player handling:
    tempPlayers.forEach((p, i) => {
      if (p.chips === 0) { 
        let tempPlayer = resetPlayer(p);
        // tempPlayer.originalIndex = i;
        tempPlayer.hasBusted = true;
        newBustedPlayers.push(tempPlayer);
        bustedPlayerMap.set(p.position, tempPlayer);
      }
      else { 
        newPlayers.push(p)

        // As the player is newly added, set the btnAt to the new player
        if (p.position === Position.BTN) btnAt = newPlayers.length - 1
        
        // btnNextPosition for recording the position of the next BTN
        // If the BTN is busted, set the btnNextPosition to the position of the next player
        if (bustedPlayerMap.has(Position.BTN)) {
          btnNextPosition = p.position;
        }
      }
    })
    newBustedPlayers = newBustedPlayers.sort((a, b) => (a.id as number) - (b.id as number));
    setBustedPlayers(newBustedPlayers);

    if (bustedPlayerMap.has(Position.BTN)) {
      newPlayers.forEach((p, i) => {
        // If position is the same as btnNextPosition, set btnAt to the index
        if (p.position === btnNextPosition) {
          btnAt = i;
        }
      })
    }
    // End of busted player handling

    // Rotate positions
    setHandNumber(handNumber + 1);
    setStage('Preflop');
    // setDealerIndex((dealerIndex + 1) % newPlayers.length);

    const rotatedPositions = rotatePositions(newPlayers, btnAt + 1);
    // Set initial bets for SB and BB
    newPlayers = rotatedPositions.map((player: Player, index: number) => {
      return resetPlayer(player);
    })
    
    
    setCurrentBet(bigBlind);
    const bbIndex = newPlayers.findIndex(p => p.position === Position.BB);
    setActivePlayerIndex(bbIndex + 1 === newPlayers.length ? 0 : bbIndex + 1);
    // Set new players to state
    setPlayers(newPlayers);
    setInitialed(true)
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
      console.log("last player standing")
      console.log("activePlayers", activePlayers)
      const winner = activePlayers[0];
      declareWinners([winner.id]);
      return true;
    }
    return false;
  };

  const handleAction = (action: Action, amount?: number) => {
    const player = players[activePlayerIndex];
    let newPlayers = [...players];
    let newCurrentBet = currentBet;
    let newPots = [...pots];
    // Mark the player as having acted
    newPlayers[activePlayerIndex].hasActed = true;

    switch (action) {
      case 'Fold':
        newPlayers[activePlayerIndex].hasFolded = true;
        // Remove the folded player from all pots' eligible players
        newPots = newPots.map(pot => ({
          ...pot,
          eligiblePlayers: pot.eligiblePlayers.filter(id => id !== player.id)
        }));
        setPots(newPots);
        // // Immediately check if only one player remains
        // if (checkForLastPlayerStanding(newPlayers)) {
        //   return; // Exit the function if the hand is over
        // }
        break;
      case 'Check':
        // No additional action needed
        break;
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
          if (player.currentBet > secondHighestBet) {
            player.chips = player.currentBet - secondHighestBet;
            player.currentBet = secondHighestBet;
            newCurrentBet = player.currentBet;
          }
        }
      }
    }
    setPlayers(newPlayers);
    setCurrentBet(newCurrentBet);
    
    // Check if the round is complete
    if (isRoundComplete(newPlayers, newCurrentBet)) {
      // Update pots after each action
      newPots = updatePots(newPots, newPlayers);
      setPots(newPots);
      setIsEndRound(true);
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

    const printPots = (pots: Pot[]) => {
      pots.forEach((pot, index) => {
        console.log(`Pot ${index + 1} - Amount: ${pot.amount}, Eligible Players: ${pot.eligiblePlayers.join(', ')}`)
      })
    }
    
    let newPots: Pot[] = [...currentPots];
    let newPlayers = currentPlayers.map(p => ({...p}));
    let activePlayers = newPlayers.filter(p => !p.hasFolded && p.hasActed);
    let allInPlayers = activePlayers.filter(p => p.chips === 0);
    let remainingBets = newPlayers.map(p => p.currentBet);
    console.log("before")
    printPots(newPots)
    if (allInPlayers.length > 1) {
      // Sort all-in players by their bet amount, lowest to highest
      allInPlayers.sort((a, b) => a.currentBet - b.currentBet);
      console.log("allInPlayers", allInPlayers)
      // Create or update pots for each all-in player
      allInPlayers.forEach((allInPlayer) => {
        if (remainingBets.every(bet => bet === 0)) return newPots;
        let potAmount = 0;
        let eligiblePlayers = activePlayers.filter(p => p.currentBet >= allInPlayer.currentBet).map(p => p.id);
        
        let updatedBetIndex: number[] = [];
        remainingBets = remainingBets.map((bet, index) => {
          if (bet >= allInPlayer.currentBet) {
            potAmount += allInPlayer.currentBet;
            updatedBetIndex.push(index)
            return bet - allInPlayer.currentBet;
          }
          return 0;
        });
        updatedBetIndex.forEach(i => {
          const betOwner = currentPlayers[i];
          activePlayers.forEach((p) => {
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
        if (potIndex !== -1) {
          newPots[potIndex].amount += potAmount;
          newPots[potIndex].eligiblePlayers = eligiblePlayers;
        } else {
          newPots.push({ amount: potAmount, eligiblePlayers });
        }
        console.log("after")
        printPots(newPots)
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
      // Calculate the change based on buy-in
      let handChange = player.chips - player.buyIn; // Changed from initialChips to buyIn

      // Update the cumulative chipChange
      player.chipChange = handChange;
    });
  
    setPlayers(newPlayers);
    setPots([{ amount: 0, eligiblePlayers: newPlayers.map(p => p.id) }]);
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
    // if (bustedPlayers.length === 0) return players;

    let newPlayers: Player[] = [];
    let bustedPlayersMap = new Map<number, Player>();
    bustedPlayers.forEach(p => {
      bustedPlayersMap.set(p.id, p);
    })

    // Combine players and busted players
    let playerIndex = 0;
    for (let i=0; i<players.length + bustedPlayers.length; i++) {
      if (bustedPlayersMap.has(i + 1)) {
        newPlayers.push(bustedPlayersMap.get(i + 1) as Player);
      } else {
        newPlayers.push({ ...players[playerIndex], originalIndex: playerIndex });
        playerIndex++;
      }
    }
    return newPlayers;
  }

  const resetPlayer = (player: Player) => {
    return {
      ...player,
      currentBet: 0,
      hasActed: false,
      hasFolded: false,
    }
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

  const handleFold = () => {
    handleAction('Fold');
  };

  const handleCheck = () => {
    handleAction('Check');
  };

  const handleCall = () => {
    handleAction('Call');
  };

  const handleRaise = (amount: number) => {
    // You might want to open a modal or prompt for raise amount
    handleAction('Raise', amount);
  };

  const activePlayer = players[activePlayerIndex];
  const canCheck = activePlayer ? currentBet === activePlayer.currentBet : false;
  const callAmount = activePlayer ? currentBet - activePlayer.currentBet : 0;
  const minRaise = activePlayer ? Math.max(bigBlind, currentBet * 2 - activePlayer.currentBet) : bigBlind;
  
  return ( 
    <div className="
      h-full w-full bg-black text-white pt-10 flex flex-col items-center space-y-12 md:justify-start
      sh:h-[130%] sh:space-y-5
    ">
      <div 
        ref={tableRef}
        className="
          w-[100%] h-[60%]
          xs:w-[100%] xs:h-[60%]
          md:w-[100%] md:h-[75%]
          sh:w-[100%] sh:h-[90%]
          bg-grey rounded-full border-white border-4 xs:border-4 sm:border-6 md:border-8
          relative
          scale-85
        "
      >
        <div className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-1/3
          h-1/3
          sh:w-1/3
          sh:h-1/4
          rounded-xl
          border-2
          border-gray-400
          flex
          items-center
          justify-center
          text-white
          text-lg
          font-bold
        ">
          {/* Pot: $Add your pot amount here */}
        </div>
        {mappingPlayers().map((player, index) => {
          let isActive = player.originalIndex === activePlayerIndex;
          player.originalIndex = undefined;
          const position = getPlayerPosition(index, mappingPlayers().length, tableSize.width, tableSize.height);
          const [left, top] = position.match(/\d+/g) || []; 
          return (
            <div 
              key={player.id} 
              // style={{
              //   position: 'absolute',
              //   left: `${left}%`,
              //   top: `${top}%`,
              //   transform: 'translate(-50%, -50%)'
              // }}
              className={`absolute ${position}`}
            >
              <PlayerUnit
                key={player.id}
                player={player}
                isActive={isActive}
                isSelected={selectedPlayer?.id === player.id}
                currentBet={currentBet}
                bigBlind={bigBlind}
                onAction={handleAction}
                onNameChange={handleNameChange}
                onChipsChange={handleChipsChange}
                onSelect={handlePlayerSelect}
              />
            </div>
          )
        })}
      </div>
      <ActionButtons
        onFold={handleFold}
        onCheck={handleCheck}
        onCall={handleCall}
        onRaise={handleRaise}
        canCheck={canCheck}
        callAmount={callAmount}
        currentBet={currentBet}
        playerChips={activePlayer ? activePlayer.chips : 0}
        potSize={pots.reduce((total, pot) => total + pot.amount, 0)}
        minRaise={minRaise}
        disabled={!activePlayer}
      />
    </div>
  );
}

function getPlayerPosition(index: number, totalPlayers: number, tableWidth: number, tableHeight: number): string {
  const positions = [
    'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2',    // Bottom center
    'left-[25%] bottom-0 -translate-x-1/2 translate-y-1/2',  // Bottom left
    'left-[2.5%] bottom-[25%] -translate-x-1/2 translate-y-1/2',  // Left bottom
    'left-[2.5%] top-[25%] -translate-x-1/2 -translate-y-1/2',      // Left center
    'left-[25%] top-0 -translate-x-1/2 -translate-y-1/2',    // Top left
    'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',      // Top center
    'right-[25%] top-0 translate-x-1/2 -translate-y-1/2',    // Top right
    'right-[2.5%] top-[25%] translate-x-1/2 -translate-y-1/2', // Right center
    'right-[2.5%] bottom-[25%] translate-x-1/2 translate-y-1/2',  // Right bottom
    'right-[25%] bottom-0 translate-x-1/2 translate-y-1/2',  // Bottom right
  ];

  
  // { x: 50, y: 100 },  // Bottom center
  // { x: 25, y: 100 },   // Bottom left
  // { x: 2, y: 80 },    // Left Bottom
  // { x: 2, y: 25 },   // Left Top
  // { x: 25, y: 0 },    // Top Left
  // { x: 50, y: 0 },   // Top Center
  // { x: 75, y: 0 },  // Top Right
  // { x: 98, y: 25 },   // Right Top
  // { x: 98, y: 80 }, // Right Botto
  // { x: 75, y: 100 }  // Bottom right

  // Adjust index based on total players to maintain consistent positioning
  let adjustedIndex = index % positions.length;
  return positions[adjustedIndex];
}