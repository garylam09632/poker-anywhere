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
        console.log("bustedPlayer", bustedPlayer);
        // Handle busted player buy-in
        setBustedPlayers(currentBustedPlayers => 
          currentBustedPlayers.filter(p => p.id !== selectedPlayer.id)
        );
        setPlayers(currentPlayers => {
          const updatedPlayer = {
            ...bustedPlayer,
            chips: amount,
            buyIn: selectedPlayer.buyIn + amount,
            chipChange: amount - (selectedPlayer.buyIn + amount),
            hasFolded: false,
            hasActed: false,
            currentBet: 0
          };
          
          if (updatedPlayer.originalIndex !== undefined) {
            let index = updatedPlayer.originalIndex;
            delete updatedPlayer.originalIndex;
            // Insert the player back at their original index
            console.log("updatedPlayer", updatedPlayer);
            console.log("index", index);
            console.log("newPlayers before splice", currentPlayers);
            const newPlayers = [
              ...currentPlayers.slice(0, index),
              updatedPlayer,
              ...currentPlayers.slice(index)
            ];
            console.log("newPlayers after splice", newPlayers);
            return newPlayers;
          } else {
            // If no originalIndex, just add to the end
            return [...currentPlayers, updatedPlayer];
          }
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