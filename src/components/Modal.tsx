import React from 'react';
import { ModalType } from '@/type/enum/ModalType';
import { StyledInput } from './StyledInput';
import { StyledButton } from './StyledButton';
import Player from '@/type/interface/Player';
import { useState } from 'react';

interface ModalProps {
  type: ModalType;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  visible: boolean;
  onClose: () => void;
  title?: string;
  withHeader?: boolean;
  selectedPlayer?: Player | null;
}

interface PlayerSettingsProps {
  player: Player;
  setPlayer: (value: Player) => void;
}

const Modal: React.FC<ModalProps> = ({ 
  type,
  players,
  setPlayers,
  visible, 
  onClose, 
  title, 
  withHeader = true,
  selectedPlayer = null
}) => {
  if (!visible) return null;

  const setPlayer = (player: Player) => {
    setPlayers(players.map(p => p.id === player.id ? player : p));
    onClose();
  }

  const renderContent = () => {

    console.log(type, selectedPlayer);
    if (type === ModalType.PlayerSettings && selectedPlayer) {
      return <PlayerSettings player={selectedPlayer} setPlayer={setPlayer} />
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md mx-auto my-6 p-6">
        <div className="relative flex flex-col w-full bg-black text-white border border-gray-700 rounded-lg shadow-2xl outline-none focus:outline-none">
          {withHeader && (
            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-gray-700">
              <h3 className="text-2xl font-semibold">{title}</h3>
              <button
              className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
              </button>
            </div>
          )}
          <div className="relative p-6 flex-auto overflow-y-auto max-h-[calc(100vh-200px)]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayerSettings: React.FC<PlayerSettingsProps> = ({ player, setPlayer }) => {
  const [name, setName] = useState(player.name);
  const [chips, setChips] = useState(player.chips);

  const handleSave = () => {
    setPlayer({ ...player, name, chips });
  };

  return (
    <div className="space-y-6">
      <StyledInput
        label="Player Name"
        value={name}
        onChange={(value) => setName(value)}
        type="text"
      />
      <StyledInput
        label="Buy-in"
        value={chips}
        onChange={(value) => setChips(Number(value))}
        type="number"
      />
      <StyledButton onClick={handleSave}>
        Save Settings
      </StyledButton>
    </div>
  )
}

export default Modal;
