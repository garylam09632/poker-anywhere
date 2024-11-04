import React from 'react';
import { ModalType } from '@/type/enum/ModalType';
import { StyledInput } from './StyledInput';
import { StyledButton } from './StyledButton';
import Player from '@/type/interface/Player';
import { useState, useEffect } from 'react';
import { BetSlider} from './BetSlider';
import { StyledSelect } from './StyledSelect';
import { Helper } from '@/utils/Helper';

interface ModalProps {
  type: ModalType;
  players: Player[];
  bustedPlayers: Player[];
  visible: boolean;
  withHeader?: boolean;
  selectedPlayer?: Player | null;
  closeOnOutsideClick?: boolean;
  onClose: () => void;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  handleBuyIn: (amount: number) => void;
  setSelectedPlayer: (player: Player) => void;
}

interface PlayerSettingsProps {
  player: Player;
  setPlayer: (value: Player) => void;
}

interface BuyInProps {
  selectedPlayer: Player | null;
  players: Player[];
  bustedPlayers: Player[];
  maxBuyIn?: number;
  handleBuyIn: (amount: number) => void;
  setSelectedPlayer: (player: Player) => void;
}

interface StaticsProps {
  players: Player[];
  bustedPlayers: Player[];
}

const Modal: React.FC<ModalProps> = ({ 
  type,
  players,
  visible, 
  withHeader = true,
  selectedPlayer = null,
  bustedPlayers,
  closeOnOutsideClick = true,
  onClose, 
  setPlayers,
  handleBuyIn,
  setSelectedPlayer,
}) => {
  // const [isClosing, setIsClosing] = useState(false);

  // useEffect(() => {
  //   if (!visible) {
  //     setIsClosing(true);
  //   } else {
  //     setIsClosing(false);
  //   }
  // }, [visible]);

  const handleClose = () => {
    // setIsClosing(true);
    setTimeout(onClose, 150);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  const setPlayer = (player: Player) => {
    setPlayers(players.map(p => p.id === player.id ? player : p));
    onClose();
  }

  const renderContent = () => {
    if (type === ModalType.PlayerSettings && selectedPlayer) {
      return <PlayerSettings player={selectedPlayer} setPlayer={setPlayer} />
    } else if (type === ModalType.BuyIn) {
      return (
        <BuyIn 
          handleBuyIn={handleBuyIn} 
          players={players} 
          bustedPlayers={bustedPlayers}
          selectedPlayer={selectedPlayer} 
          setSelectedPlayer={setSelectedPlayer} 
        />
      )
    } else if (type === ModalType.Statics) {
      return <Statics players={players} bustedPlayers={bustedPlayers} />
    }
  }

  return (
    <div 
      className={`fixed inset-0 z-[1000] flex items-center justify-centertransition-all duration-300 ${
        !visible ? 'pointer-events-none animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`relative mx-auto my-6 p-6 transition-all duration-300 ${
        !visible ? 'animate-slide-down' : 'animate-slide-up'
      }`}>
        <div className="relative flex flex-col w-full bg-black text-white border border-gray-700 rounded-lg shadow-2xl outline-none focus:outline-none">
          {withHeader && (
            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-gray-700">
              <h3 className="text-2xl font-semibold">{type}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={handleClose}
              >
                <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
          )}
          <div className="relative p-5 flex-auto overflow-y-auto max-h-[calc(100vh-200px)]">
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
    <div className="space-y-6 w-[40vw] md:w-[20vw]">
      <StyledInput
        label="Player Name"
        value={name}
        onChange={(value) => setName(value)}
        type="text"
      />
      <StyledInput
        label="Chips"
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

const BuyIn: React.FC<BuyInProps> = ({ 
  players,
  bustedPlayers,
  maxBuyIn = 1000, 
  selectedPlayer, 
  handleBuyIn, 
  setSelectedPlayer 
}) => {
  const [buyInAmount, setBuyInAmount] = useState(0);
  const [customMaxBuyIn, setCustomMaxBuyIn] = useState(maxBuyIn);

  const handleBuyInChange = (newAmount: number) => {
    // Ensure the amount is within bounds
    const clampedAmount = Math.min(Math.max(0, newAmount), customMaxBuyIn);
    setBuyInAmount(clampedAmount);
  };

  // Get all players (players + bustedPlayers)
  const allPlayers = [...players, ...bustedPlayers];
  const playerOptions = allPlayers.map(player => ({
    value: player.id,
    label: player.name
  }));

  const sliderPoints = [
    { label: '$0', value: 0 },
    { label: `$${Helper.formatAbbreviatedNumber(customMaxBuyIn)}`, value: customMaxBuyIn }
  ];

  const handleSubmit = () => {
    if (selectedPlayer && buyInAmount > 0) {
      handleBuyIn(buyInAmount);
    }
  };

  return (
    <div className="w-[70vw] md:w-[40vw] space-y-6 overflow-x-hidden">
      <StyledSelect
        label="Player"
        value={selectedPlayer?.id || ''}
        onChange={(value) => {
          const player = allPlayers.find(p => p.id === Number(value));
          if (player) setSelectedPlayer(player);
          else alert("Player not found");
        }}
        options={playerOptions}
        placeholder="Select a player"
      />

      <StyledInput
        label="Maximum Buy In"
        value={customMaxBuyIn}
        onChange={(value) => {
          const newMax = Number(value);
          setCustomMaxBuyIn(newMax);
          setBuyInAmount(Math.min(buyInAmount, newMax));
        }}
        type="number"
      />

      <StyledInput
        label="Buy In Amount"
        value={buyInAmount}
        onChange={(value) => handleBuyInChange(Number(value))}
        type="number"
        disabled={!selectedPlayer}
      />

      <div className="w-full flex flex-row items-center justify-center">
        <div className="w-[90%]">
          <BetSlider
            points={sliderPoints}
            value={buyInAmount}
            onChange={handleBuyInChange}
            minValue={0}
            maxValue={customMaxBuyIn}
            disabled={!selectedPlayer}
          />
        </div>
      </div>

      <StyledButton 
        onClick={handleSubmit}
        disabled={!selectedPlayer || buyInAmount <= 0}
      >
        Confirm
      </StyledButton>
    </div>
  );
};

const Statics: React.FC<StaticsProps> = ({ players, bustedPlayers }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Game Statistics</h2>
      <div className="space-y-3">
        {players.map((player) => (
          <div key={player.id} className="flex justify-between items-center">
            <span className="font-semibold">{player.name}</span>
            {player.chipChange !== 0 && (
              <span className={`font-bold ${
                player.chipChange > 0 
                  ? 'bg-white text-black px-2 rounded' 
                  : 'text-white'
              }`}>
                {player.chipChange > 0 ? '+' : '-'}${Math.abs(player.chipChange)}
              </span>
            )}
          </div>
        ))}
        {bustedPlayers.map((player) => (
          <div key={player.id} className="flex justify-between items-center opacity-50">
            <span className="font-semibold">{player.name} (Busted)</span>
            <span className="text-white font-bold">
              -${Math.abs(player.chipChange)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Modal;
