import { useState } from 'react';
import Player from '@/type/interface/Player';

export const useBuyIn = (
  players: Player[], 
  bustedPlayers: Player[], 
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>, 
  setBustedPlayers: React.Dispatch<React.SetStateAction<Player[]>>
) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showBuyInModal, setShowBuyInModal] = useState(false);

  const handlePlayerSelect = (player: Player) => {
    if (player.id === selectedPlayer?.id) setSelectedPlayer(null);
    else setSelectedPlayer(player);
  };

  const openBuyInModal = () => {
    if (selectedPlayer) {
      setShowBuyInModal(true);
    }
  };

  const closeBuyInModal = () => {
    setShowBuyInModal(false);
    setSelectedPlayer(null);
  };

  const handleBuyIn = (amount: number) => {
    if (selectedPlayer) {
      const bustedPlayer = bustedPlayers.find(p => p.id === selectedPlayer.id);
      
      if (bustedPlayer) {
        // Handle busted player buy-in
        setBustedPlayers(currentBustedPlayers => 
          currentBustedPlayers.filter(p => p.id !== selectedPlayer.id)
        );
        setPlayers(currentPlayers => {
          const newPlayers = [...currentPlayers, {
            ...bustedPlayer,
            chips: amount,
            buyIn: selectedPlayer.buyIn + amount,
            chipChange: amount - (selectedPlayer.buyIn + amount),
            hasFolded: false,
            hasActed: false,
            hasBusted: false,
            currentBet: 0
          }];
          newPlayers.sort((a, b) => (a.id as number) - (b.id as number));
          return newPlayers;
        });
      } else {
        // Handle active player buy-in
        setPlayers(currentPlayers => 
          currentPlayers.map(player => {
            if (player.id === selectedPlayer.id) {
              const newChips = player.chips + amount;
              const newBuyIn = player.buyIn + amount;
              const chipChange = newChips - newBuyIn;
              return { ...player, chips: newChips, buyIn: newBuyIn, chipChange };
            }
            return player;
          })
        );
      }
      closeBuyInModal();
    }
  };

  return {
    selectedPlayer,
    showBuyInModal,
    handlePlayerSelect,
    openBuyInModal,
    closeBuyInModal,
    handleBuyIn
  };
};