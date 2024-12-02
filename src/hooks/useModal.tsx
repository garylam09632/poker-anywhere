import { useEffect, useState } from 'react';
import Player from '@/type/interface/Player';
import { ModalType } from '@/type/enum/ModalType';

export const useModal = (
  players: Player[], 
  bustedPlayers: Player[],
  reset: boolean,
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>, 
  setBustedPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  setReset: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [type, setType] = useState(ModalType.PlayerSettings);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [visible, setVisible] = useState(false);
  const [withHeader, setWithHeader] = useState(false);

  const handlePlayerSelect = (player: Player) => {
    if (player.id === selectedPlayer?.id) setSelectedPlayer(null);
    else setSelectedPlayer(player);
  };

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setTimeout(() => {
      setSelectedPlayer(null);
    }, 300);
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
      if (players.length === 1) setReset(!reset);
    }
  };

  return {
    selectedPlayer,
    visible,
    withHeader,
    type,
    closeModal,
    handlePlayerSelect,
    openModal,
    handleBuyIn,
    setType,
    setWithHeader,
  };
};