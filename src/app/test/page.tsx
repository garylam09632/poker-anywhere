'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Player from '@/type/interface/Player';
import Pot from '@/type/interface/Pot';
import case1 from '@/case/SidePot1';
import { Action, Stage } from '@/type/General';
import { useModal } from '@/hooks/useModal';
import { Position } from '@/type/enum/Position';
import PlayerUnit from '@/components/PlayerUnit';
import { ActionButtons } from '@/components/ActionButtons';
import Chip from '@/components/Chip';
import { PlayerCSSLocation, PlayerLocation } from '@/type/enum/Location';
import { ShowdownMode } from '@/type/enum/ShowdownMode';
import Modal from '@/components/Modal';
import { ModalType } from '@/type/enum/ModalType';
import { IconButton } from '@/components/IconButton';
import { FiSettings } from 'react-icons/fi';
import { RiBarChartLine, RiMoneyDollarBoxLine } from 'react-icons/ri';

const TEST = false;

export default function Game() {
  const searchParams = useSearchParams();

  // Game state
  const [players, setPlayers] = useState<Player[]>([]);
  const [pots, setPots] = useState<Pot[]>([{ amount: 0, eligiblePlayers: [] }]);
  const [totalPot, setTotalPot] = useState<number>(0);
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
  const [chipMovement, setChipMovement] = useState<'bet' | 'pot'>('bet');
  const [selectedRanks, setSelectedRanks] = useState<{[key: number]: number}>({});

  // State for trigger useEffect
  const [reset, setReset] = useState(false);
  const [initialed, setInitialed] = useState(false);
  const [isEndRound, setIsEndRound] = useState(false);

  // Buy in state
  const {
    type: modalType,
    selectedPlayer,
    visible: modalVisible,
    withHeader: modalWithHeader,
    handlePlayerSelect,
    openModal,
    closeModal,
    handleBuyIn,
    setType: setModalType,
    setWithHeader: setModalWithHeader
  } = useModal(players, bustedPlayers, setPlayers, setBustedPlayers);

  // Use useRef to get a reference to the table div
  const tableRef = useRef<HTMLDivElement>(null);

  // Variables
  const activePlayer = players[activePlayerIndex];
  const canCheck = activePlayer ? currentBet === activePlayer.currentBet : false;
  const callAmount = activePlayer ? currentBet - activePlayer.currentBet : 0;
  const minRaise = activePlayer ? Math.max(bigBlind, currentBet * 2) : bigBlind;

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
        const location = locations(i);
        let currentBet = 0;
        let chips = buyIn;
        eligiblePlayers.push(i + 1);
        return new Player(
          i + 1,
          `Player ${i + 1}`,
          chips,
          buyIn,
          position,
          location,
          0,
          0,
          false,
          false,
          false
        )
      });
      setPlayers(initialPlayers);
      setCurrentBet(bb);
      setTotalPot(bb + sb);
      setPots([{ amount: bb + sb, eligiblePlayers }]);
      setActivePlayerIndex(playerCount === 2 ? 0 : 3 % playerCount); // Start with the player after BB
      setInitialed(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (pots.length === 0) return;
    if (initialed) {
      let sbIndex = 0, bbIndex = 0;
      for (let i=0; i<players.length; i++) {
        let player = players[i];
        if (player.position === Position.SB) {
          player.currentBet = smallBlind;
          player.chips -= smallBlind;
          player.betHistory.push(smallBlind);
          sbIndex = i;
        } else if (player.position === Position.BB) {
          player.currentBet = bigBlind;
          player.chips -= bigBlind;
          player.betHistory.push(bigBlind);
          bbIndex = i;
          // As the last player who act will be the big blind
          // player.hasActed = true;
        } else if (player.position === Position.BTN && players.length === 2) {
          // When there are only 2 players, the BTN acts as the SB
          player.currentBet = smallBlind;
          player.chips -= smallBlind;
          player.betHistory.push(smallBlind);
          sbIndex = i;
        }
      }
      pots[0].amount = smallBlind + bigBlind;
      pots[0].distribution = { [players[sbIndex].id]: smallBlind, [players[bbIndex].id]: bigBlind }
      setPots(pots)
      setPlayers(players);
      setInitialed(false);
    } 
  }, [initialed, players]);

  useEffect(() => {
    if (initialed) return;
    const lastPlayer = isLastPlayerStanding(players);
    if (lastPlayer) {
      declareWinners([lastPlayer]);
      return;
    } 

    if (!players[activePlayerIndex]?.hasActed) return;
    // Check if the round is complete
    if (isRoundComplete(players, currentBet)) {
      console.log("round complete")
      // Update pots after each action
      setChipMovement('pot');
      setIsEndRound(true);
    } else {
      console.log("round not complete")
      // If there is only one player left, declare the winner
      moveToNextPlayer(players);
    }
  }, [pots])

  useEffect(() => {
    if (isEndRound) {
      console.log("isEndRound")
      console.log("stage === 'River'", stage === 'River')
      console.log("players.every(player => player.chips === 0)", players.every(player => player.chips === 0))
      console.log("players.length - 1 === (players.filter(p => p.chips === 0).length + players.filter(p => p.hasFolded).length)", players.length - 1 === (players.filter(p => p.chips === 0).length + players.filter(p => p.hasFolded).length))
      // If stage is river
      // If all active players are all in
      const activePlayers = players.filter(p => !p.hasFolded);
      if (
        stage === 'River' || 
        activePlayers.every(player => player.chips === 0) ||
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

  useEffect(() => {
    console.log("selectedRanks", selectedRanks)
  }, [selectedRanks])

  // 20240522007G
  // 20241002004C 
  // TODO: Reset player bet smallBlind and bigBlind and maybe ante
  // SmallBlind should be not acted

  const resetBetsAndUpdateActivePlayer = () => {
    setPlayers(players.map(player => ({ 
      ...player, 
      currentBet: 0, 
      hasActed: false,
      betHistory: []
    })));
    setPots(pots.map(pot => ({
      ...pot,
      distribution: {}
    })))
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
    setPots([{ amount: 0, eligiblePlayers: newPlayers.map(p => p.id) }]);
    setChipMovement('bet');
    setInitialed(true)
  };

  const rotatePositions = (currentPlayers: Player[], newDealerIndex: number): Player[] => {
    const newPositions = positions(currentPlayers.length);
    return currentPlayers.map((player, index) => ({
      ...player,
      position: newPositions[(index - newDealerIndex + currentPlayers.length) % currentPlayers.length],
    }));

  };

  const isLastPlayerStanding = (currentPlayers: Player[]): number | null => {
    const activePlayers = currentPlayers.filter(p => !p.hasFolded);
    if (activePlayers.length === 1) {
      return activePlayers[0].id;
    }
    return null;
  }

  const getPlayerNotFolded = (): Player[] => {
    return players.filter(p => !p.hasFolded);
  }

  const handleAction = (action: Action, amount?: number) => {
    const player = players[activePlayerIndex];
    let newPlayers = [...players];
    let newCurrentBet = currentBet;
    let newPots = [...pots];
    let newPlayer = newPlayers[activePlayerIndex];
    // Mark the player as having acted
    newPlayer.hasActed = true;

    switch (action) {
      case 'Fold':
        newPlayer.hasFolded = true;
        newPlayer.actualBet = 0;
        // Remove the folded player from all pots' eligible players
        newPots = newPots.map(pot => ({
          ...pot,
          eligiblePlayers: pot.eligiblePlayers.filter(id => id !== player.id)
        }));
        // setPots(newPots);
        // // Immediately check if only one player remains
        // if (checkForLastPlayerStanding(newPlayers)) {
          //   return; // Exit the function if the hand is over
          // }
        break;
      case 'Check':
        newPlayer.actualBet = 0;
        break;
      case 'Call':
      case 'Bet':
      case 'Raise':
      case 'ALL IN':
        let betAmount;
        if (action === "Call") {
          if (currentBet - player.currentBet > player.chips) {
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
          // console.log("amount", amount)
          // console.log("player.currentBet", player.currentBet)
          // console.log("player.chips", player.chips)
          betAmount = Math.min(amount - player.currentBet, player.chips);
          // console.log("betAmount", betAmount)
        }
        newPlayer.chips -= betAmount;
        newPlayer.currentBet += betAmount;
        newPlayer.betHistory.push(betAmount);
        newPlayer.actualBet = betAmount;
        newCurrentBet = Math.max(newCurrentBet, newPlayer.currentBet);
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

    newPots = updatePots(newPots, newPlayers);
    setPots(newPots);
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
    console.log("endHand")
    setShowdownMode(true);
    if (getPlayerNotFolded().length > 2) {
      let selectedRanks: { [key: number]: number } = {};
      getPlayerNotFolded().forEach(p => {
        selectedRanks[p.id] = 1;
      })
      setSelectedRanks(selectedRanks);
    }
  };

  const toggleWinner = (playerId: number) => {
    setSelectedWinners(prev => 
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const updatePots = (currentPots: Pot[], currentPlayers: Player[]): Pot[] => {
    let newPots: Pot[] = [...currentPots];
    let newPlayers = currentPlayers.map(p => ({...p}));
    let activePlayer = newPlayers[activePlayerIndex];
    let eligiblePlayers = newPlayers.filter(p => !p.hasFolded).map(p => p.id);
    let allInPlayers = newPlayers.filter(p => !p.hasFolded && p.id !== activePlayer.id && p.chips === 0);

    // Find the highest bet amount within all in players
    let currentBet = activePlayer.currentBet;
    let remainingBets = 0;
    let newPotBaseUpdatedBy = 0;
    // Contains info of the pot index and the bet amount to be updated
    let potsUpdate: { 
      potIndex: number, 
      bet: number, 
      baseAmount?: number, 
      baseUpdatedBy?: number, 
      paidPlayers?: number[],
      potHasAllIn?: boolean,
      isFullPaid?: boolean
    }[] = [];
    
    remainingBets = currentBet;
    // console.log("initial remainingBets", remainingBets)
    // console.log("activePlayer", activePlayer)
    // Deduct all previous bets from the current bet besides the latest bet
    // activePlayer.betHistory.forEach((bet, index) => {
    //   if (index === activePlayer.betHistory.length - 1) return;
    //   remainingBets -= bet;
    // })
    for (let i=0; i<newPots.length; i++) {
      let pot = newPots[i];

      // If the player is folded, remove the player from each pot
      if (activePlayer.hasFolded) {
        pot.eligiblePlayers = pot.eligiblePlayers.filter(id => id !== activePlayer.id);
        continue;
      }

      let distribution = pot.distribution ? pot.distribution[activePlayer.id] || 0 : 0;
      let potHasAllIn = false;
      let isFullPaid = false;
      
      // Check if pot's eligible players include all in players
      for (let eligiblePlayer of pot.eligiblePlayers) {
        if (newPlayers[eligiblePlayer - 1]?.chips === 0 && eligiblePlayer !== activePlayer.id) {
          potHasAllIn = true;
        }
        if (potHasAllIn && pot.paidPlayers && pot.eligiblePlayers.every(id => pot.paidPlayers?.includes(id) || id === pot.baseUpdatedBy)) {
          isFullPaid = true;
        }
      }
      console.log("potHasAllIn", potHasAllIn, "isFullPaid", isFullPaid)
      if (isFullPaid) {
        // Pot distribution is set, deduct the distribution from the remaining bets
        // Every stage each pot distribution is clear to be {}, therefore bet will not be deducted 
        if (pot.distribution) remainingBets -= pot.distribution[activePlayer.id] || 0;
      }

      if (!potHasAllIn) {
        
        // No all in players
        // let potIndex = newPots.findIndex(pot => 
        //   pot.eligiblePlayers.length === eligiblePlayers.length && 
        //   pot.eligiblePlayers.every(id => eligiblePlayers.includes(id))
        // );
        let potIndex = i;        
        if (potIndex === -1) {
          alert("Error: potIndex === -1")
          return currentPots;
        }
        const isAllIn = activePlayer.chips === 0 && !activePlayer.hasFolded;
        potsUpdate.push({ 
          potIndex,
          bet: isAllIn ? remainingBets - distribution : activePlayer.actualBet, 
          baseAmount: remainingBets, 
          baseUpdatedBy: activePlayer.id 
        });
        remainingBets = 0;
      }

      console.log("Loop", i)
      // All in players exist
      if (potHasAllIn && !isFullPaid) {
        console.log("potHasAllIn && !isFullPaid")
        // If the remaining bet is 0, the is likely a call action
        if (remainingBets === 0) break;
        if (pot.baseAmount === undefined || pot.baseAmount === null) {
          alert("Error: newPots[i].baseAmount is undefined")
          return currentPots;
        }
        if (pot.paidPlayers && pot.paidPlayers.includes(activePlayer.id)) continue;
        if (remainingBets >= pot.baseAmount) {
          console.log("remainingBets >= pot.baseAmount")
          // If the remaining bet is greater than the this pot amount, the new pot will be created by the current player
          if (pot.baseUpdatedBy) newPotBaseUpdatedBy = activePlayer.id;
          console.log("before", remainingBets)
          remainingBets -= pot.baseAmount;
          console.log("after", remainingBets)
          console.log("distribution", distribution)
          console.log( { potIndex: i, bet: pot.baseAmount - distribution, paidPlayers: [...(pot.paidPlayers || []), activePlayer.id] }  )
          potsUpdate.push({ potIndex: i, bet: pot.baseAmount - distribution, paidPlayers: [...(pot.paidPlayers || []), activePlayer.id] });
        } else {
          console.log("remainingBets < pot.baseAmount")
          // If the remaining bet is less than the this pot amount, new pot need to be created by the current baseUpdatedBy
          if (pot.baseUpdatedBy) newPotBaseUpdatedBy = pot.baseUpdatedBy;
          let bet = remainingBets - (pot.baseAmount - remainingBets); // 5600 - (6600 - 5600)
          potsUpdate.push({ potIndex: i, bet, baseAmount: remainingBets, baseUpdatedBy: activePlayer.id, paidPlayers: [...(pot.paidPlayers || []), activePlayer.id] });
          remainingBets = pot.baseAmount - remainingBets; // 1000
          // console.log(`{ potIndex: ${i}, bet: ${bet}, baseAmount: ${remainingBets} }`)
        }
        // If after the loop, remainingBets is still greater than 0, it means the remaining bets are for the main pot
        // Will create a new pot for the remaining bets afterwards
      }
    }

    // If the active player is folded, return the pots after the update of eligible players but not the potsUpdate
    if (activePlayer.hasFolded) {
      return newPots
    }

    // Update the pots
    console.log("potsUpdate", potsUpdate)
    for (let { potIndex, bet, baseAmount, baseUpdatedBy, paidPlayers } of potsUpdate) {
      const pot = newPots[potIndex];
      pot.amount += bet;
      if (pot.distribution) {
        pot.distribution[activePlayer.id] = (pot.distribution[activePlayer.id] || 0) + bet;
      } else {
        pot.distribution = {};
        pot.distribution[activePlayer.id] = bet;
      }
      if (baseAmount) pot.baseAmount = baseAmount;
      if (baseUpdatedBy) pot.baseUpdatedBy = baseUpdatedBy;
      if (paidPlayers) pot.paidPlayers = paidPlayers;
    }

    if (remainingBets > 0) {
      console.log("remainingBets > 0")
      // if (isLessThanPotHighestBet) {
      //   eligiblePlayers = eligiblePlayers.filter(id => !newPots.map(p => p.baseUpdatedBy).includes(id));
      // }
      eligiblePlayers = eligiblePlayers.filter(id => !newPots.map(p => p.baseUpdatedBy).includes(id));
      newPots.push({ 
        amount: remainingBets, 
        eligiblePlayers, 
        baseAmount: remainingBets, 
        baseUpdatedBy: activePlayer.id, 
        distribution: { [activePlayer.id]: remainingBets } 
      });
    }
    printPots(newPots)
    return newPots;
  }

  // const updatePots = (currentPots: Pot[], currentPlayers: Player[]): Pot[] => {
  //   // if (currentPlayers[activePlayerIndex].hasFolded) return currentPots;

  //   const printPots = (pots: Pot[]) => {
  //     pots.forEach((pot, index) => {
  //       console.log(`Pot ${index + 1} - Amount: ${pot.amount}, Eligible Players: ${pot.eligiblePlayers.join(', ')}`)
  //     })
  //   }
    
  //   let newPots: Pot[] = [...currentPots];
  //   let newPlayers = currentPlayers.map(p => ({...p}));
  //   let activePlayers = newPlayers.filter(p => !p.hasFolded && p.hasActed);
  //   let allInPlayers = activePlayers.filter(p => p.chips === 0);
  //   let remainingBets = newPlayers.map(p => p.currentBet);
  //   console.log("before")
  //   printPots(newPots)
  //   if (allInPlayers.length > 1) {
  //     // Sort all-in players by their bet amount, lowest to highest
  //     allInPlayers.sort((a, b) => a.currentBet - b.currentBet);
  //     console.log("allInPlayers", allInPlayers)
  //     // Create or update pots for each all-in player
  //     allInPlayers.forEach((allInPlayer) => {
  //       if (remainingBets.every(bet => bet === 0)) return newPots;
  //       let potAmount = 0;
  //       let eligiblePlayers = activePlayers.filter(p => p.currentBet >= allInPlayer.currentBet).map(p => p.id);
        
  //       let updatedBetIndex: number[] = [];
  //       remainingBets = remainingBets.map((bet, index) => {
  //         if (bet >= allInPlayer.currentBet) {
  //           potAmount += allInPlayer.currentBet;
  //           updatedBetIndex.push(index)
  //           return bet - allInPlayer.currentBet;
  //         }
  //         return 0;
  //       });
  //       updatedBetIndex.forEach(i => {
  //         const betOwner = currentPlayers[i];
  //         activePlayers.forEach((p) => {
  //           // Find out the bet owner in allInPlayers array
  //           if (betOwner.id === p.id) {
  //             // Set their currentBet to new value
  //             p.currentBet -= allInPlayer.currentBet
  //           }
  //         })
  //       })
  //       // Find existing pot or create new one
  //       let potIndex = newPots.findIndex(pot => 
  //         pot.eligiblePlayers.length === eligiblePlayers.length && 
  //         pot.eligiblePlayers.every(id => eligiblePlayers.includes(id))
  //       );
  //       if (potIndex !== -1) {
  //         newPots[potIndex].amount += potAmount;
  //         newPots[potIndex].eligiblePlayers = eligiblePlayers;
  //       } else {
  //         newPots.push({ amount: potAmount, eligiblePlayers });
  //       }
  //       console.log("after")
  //       printPots(newPots)
  //     });
  //   }
  //   // Create or update main pot with remaining bets
  //   let mainPotAmount = remainingBets.reduce((sum, bet) => sum + bet, 0);
  //   if (mainPotAmount > 0) {
  //     let eligiblePlayers = activePlayers.filter(p => !p.hasFolded).map(p => p.id);
  //     // console.log("mainPotAmount", mainPotAmount)
  //     // console.log("eligiblePlayers", eligiblePlayers)
  //     // Find existing main pot or create new one
  //     let mainPotIndex = newPots.findIndex(pot => 
  //       pot.eligiblePlayers.length === eligiblePlayers.length && 
  //       pot.eligiblePlayers.every(id => eligiblePlayers.includes(id))
  //     );
  //     if (stage === "Preflop") mainPotIndex = 0;
      
  //     if (mainPotIndex !== -1) {
  //       newPots[mainPotIndex].amount += mainPotAmount;
  //       newPots[mainPotIndex].eligiblePlayers = eligiblePlayers;
  //     } else {
  //       newPots.push({ amount: mainPotAmount, eligiblePlayers });
  //     }
  //   }
  //   return newPots;
  // };

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
    // setPots([{ amount: 0, eligiblePlayers: newPlayers.map(p => p.id) }]);
    setShowdownMode(false);
    setSelectedWinners([]);
    setReset(true);
  };

  const declareWinnerRanking = () => {
    console.log("declareWinnerRanking", selectedRanks)
    const newPots = [...pots];
    const newPlayers = [...players];

    // Create a object with rank as key, playerIds as value of array
    const sortedRanks = Object.entries(selectedRanks).sort((a, b) => a[1] - b[1]).reduce((acc: { [key: number]: string[] }, [playerId, rank]) => {
      acc[rank] = [...(acc[rank] || []), playerId];
      return acc;
    }, {});
    printPots(newPots);
    console.log("sortedRanks", sortedRanks)

    const settle = (playerIds: string[]) => {
      let potIndex: number[] = [];
      for (let playerId of playerIds) {
        for (let i=0; i<newPots.length; i++) {
          let pot = newPots[i];
          // If the pot amount is 0 which means it has been settled, skip it
          if (pot.amount === 0) continue;
          // If the player is eligible for this pot
          if (pot.eligiblePlayers.includes(parseInt(playerId))) {
            // Even each players in playerIds have same rank, but the player might not be in the pot
            let playerEligibles = pot.eligiblePlayers.filter(id => playerIds.includes(id.toString()));
            // Use Math.round to distribute the pot evenly
            let share = Math.round(pot.amount / playerEligibles.length);
            newPlayers[parseInt(playerId) - 1].chips += share
            console.log(`Pot ${i + 1} - Player ${playerId} - Share: ${share}`)
            potIndex.push(i);
          }
        }
      }
      for (let i=0; i<potIndex.length; i++) {
        newPots[potIndex[i]].amount = 0;
      }
    }
    
    // for each rank, distribute the pot evenly to the players
    for (let [rank, playerIds] of Object.entries(sortedRanks)) {
      console.log("playerIds", playerIds, "rank", rank)
      settle(playerIds);
    }
    console.log("newPlayers", newPlayers)
    console.log("newPots", newPots)
    setPlayers(newPlayers);
    setShowdownMode(false);
    setSelectedRanks({});
    setSelectedWinners([]);
    setReset(true);
  }

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

  const printPots = (pots: Pot[]) => {
    pots.forEach((pot, index) => {
      console.log(`Pot ${index + 1} - Amount: ${pot.amount}, Base Amount: ${pot.baseAmount} ${pot.baseUpdatedBy ? `(Updated by ${pot.baseUpdatedBy})` : ''}, Eligible Players: ${pot.eligiblePlayers.join(', ')}`)
    })
  }

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

  const renderDeclareWinnerButton = () => {
    return (
      <div className="relative h-32 sh:h-8 w-full flex items-center justify-center">
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out 
            ${selectedWinners.length > 0 || Object.keys(selectedRanks).length > 0 ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="text-white text-3xl sh:text-2xl font-bold">
            Who wins?
          </div>
        </div>
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out 
            ${selectedWinners.length > 0 || Object.keys(selectedRanks).length > 0 ? 'opacity-100' : 'opacity-0'}`}
        >
          <button 
            className={`
              bg-white text-black rounded-full transition-all duration-200 ease-in-out
              hover:scale-120
              px-6 py-6 text-2xl sh:px-4 sh:py-4 sh:text-base
              ${selectedWinners.length > 0 || Object.keys(selectedRanks).length > 0  ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={() => getPlayerNotFolded().length > 2 ? declareWinnerRanking() : declareWinners(selectedWinners)}
          >
            OK
          </button>
        </div>
      </div>
    );
  };

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

  // const moveChipsToPot = useCallback(() => {
  //   setChipMovement('pot');
  //   setTimeout(() => {
  //     // Update pots and reset player bets
  //     const newPots = updatePots(pots, players);
  //     setPots(newPots);
  //     setPlayers(players.map(p => ({ ...p, currentBet: 0 })));
  //     setChipMovement('bet');
  //   }, 500); // Wait for animation to complete
  // }, [pots, players]);

  // useEffect(() => {
  //   if (isEndRound) {
  //     moveChipsToPot();
  //     // ... (rest of the isEndRound effect)
  //   }
  // }, [isEndRound, moveChipsToPot]);

  const handleFold = () => {
    handleAction('Fold');
  };

  const handleCheck = () => {
    handleAction('Check');
  };

  const handleCall = () => {
    handleAction('Call');
  };

  const handleRaise = (amount: number, isRaise?: boolean) => {
    // You might want to open a modal or prompt for raise amount
    handleAction(isRaise ? 'Raise' : 'ALL IN', amount);
  };

  const handleSelectWinner = (playerId: number, rank?: number) => {
    console.log("playerId", playerId)
    const activePlayers = players.filter(p => !p.hasFolded);
    if (activePlayers.length === 2) {
      toggleWinner(playerId);
    } else if (activePlayers.length > 2) {
      setSelectedRanks(prev => ({
        ...prev,
        [playerId]: rank || 1
      }));
    }
  };

  const onShowPlayerSettings = (player: Player) => {
    handlePlayerSelect(player);
    setModalType(ModalType.PlayerSettings);
    setModalWithHeader(false);
    openModal();
  }

  const onShowBuyIn = () => {
    setModalType(ModalType.BuyIn);
    setModalWithHeader(true);
    openModal();
  }
  
  const onShowStatics = () => {
    setModalType(ModalType.Statics);
    setModalWithHeader(true);
    openModal();
  }
  
  return (
    <>
      <div className="
        h-full w-full bg-black text-white pt-10 flex flex-col items-center space-y-12 md:justify-start
        sh:h-[130%] sh:space-y-5 mh:space-y-10
      ">
        {/* Add button area */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
          <IconButton
            icon={<RiMoneyDollarBoxLine />}
            onClick={onShowBuyIn}
            tooltip="Buy In"
          />
          <IconButton
            icon={<RiBarChartLine />}
            onClick={onShowStatics}
            tooltip="Statics"
          />
          <IconButton
            icon={<FiSettings />}
            onClick={() => extractGameState()}
            tooltip="Game State"
          />
        </div>
        <div 
          ref={tableRef}
          className="
            w-[100%] h-[60%]
            xs:w-[100%] xs:h-[60%]
            md:w-[100%] md:h-[75%]
            sh:w-[100%] sh:h-[90%]
            mh:w-[90%] mh:h-[75%]
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
            w-[92%]
            h-[90%]
            md:w-[96%]
            md:h-[90%]
            rounded-full
            border-2
            border-gray-400
            flex
            flex-col
            items-center
            justify-center
            text-white
            text-lg
            font-bold
          ">
            <div className="flex flex-col items-center space-y-6 -translate-y-10 sh:space-y-2 sh:-translate-y-5">
              <div 
                className={
                  `rounded-full text-sm sm:text-xs md:text-base font-bold bg-white text-black px-3 py-1
                  sh:-bottom-3 sh:px-2 sh:py-0 sh:text-xxs`
                }
              >
                { showdownMode ? `#${handNumber} Showdown` : `#${handNumber} ${stage}`}
              </div>
              {
                pots.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {pots.map((pot, index) => (
                      <div key={index} className="flex items-center space-x-2">
                      <Chip amount={pot.amount} type="pot" />
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          </div>
          {mappingPlayers().map((player, index) => {
            let isActive = player.originalIndex === activePlayerIndex;
            let isEligible = pots[0].eligiblePlayers.includes(player.id);
            player.originalIndex = undefined;
            if (showdownMode) isActive = isEligible ? true : false;
            return (
              <div 
                key={player.id} 
                className={`absolute ${PlayerCSSLocation[player.location]}`}
              >
                <PlayerUnit
                  key={player.id}
                  player={player}
                  isActive={isActive}
                  isSelected={selectedPlayer?.id === player.id}
                  currentBet={currentBet}
                  bigBlind={bigBlind}
                  selectedWinners={selectedWinners}
                  selectedRank={selectedRanks[player.id]}
                  showdownMode={showdownMode ? getPlayerNotFolded().length : ShowdownMode.None}
                  isEligible={isEligible}
                  openModal={openModal}
                  onAction={handleAction}
                  onNameChange={handleNameChange}
                  onChipsChange={handleChipsChange}
                  onSelect={onShowPlayerSettings}
                  onSelectWinner={handleSelectWinner}
                />
              </div>
            )
          })}
        </div>
        {
          showdownMode ? (
            renderDeclareWinnerButton()
          ) : (
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
          )
        }
      </div>
      <Modal
        players={players}
        bustedPlayers={bustedPlayers}
        type={modalType}
        visible={modalVisible}
        withHeader={modalWithHeader}
        selectedPlayer={selectedPlayer}
        setPlayers={setPlayers}
        onClose={closeModal}
        setSelectedPlayer={handlePlayerSelect}
        handleBuyIn={handleBuyIn}
      />
    </>
  );
}

const locations = (index: number): PlayerLocation => {
  const positions = [
    PlayerLocation.BottomCenter,    // Bottom center
    PlayerLocation.BottomLeft,      // Bottom left
    PlayerLocation.LeftBottom,      // Left bottom
    PlayerLocation.LeftCenter,      // Left center
    PlayerLocation.TopLeft,         // Top left
    PlayerLocation.TopCenter,       // Top center
    PlayerLocation.TopRight,        // Top right
    PlayerLocation.RightCenter,     // Right center
    PlayerLocation.RightBottom,     // Right bottom
    PlayerLocation.BottomRight,     // Bottom right
  ];
  return positions[index % positions.length];
}


const getPlayerPosition = (index: number, totalPlayers: number, tableWidth: number, tableHeight: number): string => {
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
  // const positions = [
  //   PlayerCSSLocation.BottomCenter,    // Bottom center
  //   PlayerCSSLocation.BottomLeft,      // Bottom left
  //   PlayerCSSLocation.LeftBottom,      // Left bottom
  //   PlayerCSSLocation.LeftCenter,      // Left center
  //   PlayerCSSLocation.TopLeft,         // Top left
  //   PlayerCSSLocation.TopCenter,       // Top center
  //   PlayerCSSLocation.TopRight,        // Top right
  //   PlayerCSSLocation.RightCenter,     // Right center
  //   PlayerCSSLocation.RightBottom,     // Right bottom
  //   PlayerCSSLocation.BottomRight,     // Bottom right
  // ];

  
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

const getChipPosition = (index: number, totalPlayers: number): PlayerLocation => {
  const positions = [
    PlayerLocation.BottomCenter,    // Bottom center
    PlayerLocation.BottomLeft,      // Bottom left
    PlayerLocation.LeftBottom,      // Left bottom
    PlayerLocation.LeftCenter,      // Left center
    PlayerLocation.TopLeft,         // Top left
    PlayerLocation.TopCenter,       // Top center
    PlayerLocation.TopRight,        // Top right
    PlayerLocation.RightCenter,     // Right center
    PlayerLocation.RightBottom,     // Right bottom
    PlayerLocation.BottomRight,     // Bottom right
  ];

  let adjustedIndex = index % positions.length;
  return positions[adjustedIndex];
};

