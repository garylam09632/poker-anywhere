import { useState } from 'react';
import Player from '@/type/interface/Player';
import { LocalStorage } from '@/utils/LocalStorage';
import { GameState } from '@/type/GameState';

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

      let playerList: Player[];
      // let setFunction: React.Dispatch<React.SetStateAction<Player[]>>;

      let setFunction: (players: Player[]) => void;
      
      const gameState = LocalStorage.get('history').toObject<GameState[]>();
      let newState = gameState && gameState?.length > 0 ? { ...gameState[gameState.length - 1] }: null;
      if (bustedPlayer) {
        // Handle busted player buy-in
        playerList = [...bustedPlayers];
        setFunction = (players: Player[]) => { 
          setBustedPlayers(players);
          if (newState && gameState) { 
            newState.bustedPlayers = players;
            LocalStorage.set('history', [...gameState, newState]);
          }
        };
      } else {
        // Handle active player buy-in
        playerList = [...players];
        setFunction = (players: Player[]) => { 
          setPlayers(players);
          if (newState && gameState) { 
            newState.players = players; 
            LocalStorage.set('history', [...gameState, newState]);
          }
        };
      }
      setFunction(playerList.map(p => {
        if (p.id === selectedPlayer.id) p.tempBuyIn = amount;
        return p;
      }))
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