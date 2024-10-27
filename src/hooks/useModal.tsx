import { useEffect, useState } from 'react';
import Player from '@/type/interface/Player';

export const useModal = (
  players: Player[], 
  bustedPlayers: Player[], 
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>, 
  setBustedPlayers: React.Dispatch<React.SetStateAction<Player[]>>
) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [visible, setVisible] = useState(false);

  const handlePlayerSelect = (player: Player) => {
    console.log("handlePlayerSelect", player);
    if (player.id === selectedPlayer?.id) setSelectedPlayer(null);
    else setSelectedPlayer(player);
  };

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setSelectedPlayer(null);
  };

  const handleBuyIn = (amount: number) => {
    if (selectedPlayer) {
      const bustedPlayer = bustedPlayers.find(p => p.id === selectedPlayer.id);

      let playerList: Player[];
      let setFunction: React.Dispatch<React.SetStateAction<Player[]>>;
      
      if (bustedPlayer) {
        // Handle busted player buy-in
        playerList = [...bustedPlayers];
        setFunction = setBustedPlayers;
      } else {
        // Handle active player buy-in
        playerList = [...players];
        setFunction = setPlayers;
      }
      setFunction(playerList.map(p => {
        if (p.id === selectedPlayer.id) p.tempBuyIn = amount;
        return p;
      }))
      closeModal();
    }
  };

  useEffect(() => {
    console.log(selectedPlayer);
  }, [selectedPlayer]);

  return {
    selectedPlayer,
    visible,
    handlePlayerSelect,
    openModal,
    closeModal,
    handleBuyIn
  };
};