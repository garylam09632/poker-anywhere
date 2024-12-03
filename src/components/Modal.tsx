import React from 'react';
import { ModalType } from '@/type/enum/ModalType';
import { StyledInput } from './StyledInput';
import { StyledButton } from './StyledButton';
import Player from '@/type/interface/Player';
import { useState, useEffect } from 'react';
import { BetSlider} from './BetSlider';
import { StyledSelect } from './StyledSelect';
import { Helper } from '@/utils/Helper';
import { LocalStorage } from '@/utils/LocalStorage';
import type { Settings } from '@/type/Settings';

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

interface SettingsProps {
  players: Player[];
  bustedPlayers: Player[];
  handleClose: () => void;
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
    (document.getElementById('raiseAmountInput') as HTMLInputElement)?.focus();
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
    } else if (type === ModalType.Settings) {
      return <Settings players={players} bustedPlayers={bustedPlayers} handleClose={handleClose} />
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
    <div className="space-y-6 w-[75vw] md:w-[20vw]">
      <StyledInput
        label="Player Name"
        value={name}
        onChange={(value) => setName(value)}
        type="text"
      />
      {/* <StyledInput
        label="Chips"
        value={chips}
        onChange={(value) => setChips(Number(value))}
        type="number"
      /> */}
      <StyledButton onClick={handleSave}>
        Save Settings
      </StyledButton>
    </div>
  )
}

const Settings: React.FC<SettingsProps> = ({ players, bustedPlayers, handleClose }) => {
  const [playerCount, setPlayerCount] = useState(String(players.length + bustedPlayers.length));
  const [smallBlind, setSmallBlind] = useState('1');
  const [bigBlind, setBigBlind] = useState('2');
  const [buyIn, setBuyIn] = useState('100');

  // Load initial values from LocalStorage
  useEffect(() => {
    const settings = LocalStorage.get('settings').toObject<Settings>();
    if (settings) {
      setPlayerCount(String(players.length + bustedPlayers.length));
      setSmallBlind(settings.smallBlind.toString());
      setBigBlind(settings.bigBlind.toString());
      setBuyIn(settings.buyIn.toString());
    }
  }, []);

  const handleSave = () => {
    LocalStorage.set('settings', { playerCount, smallBlind, bigBlind, buyIn });
    handleClose();
    // You might want to add some callback here to notify the parent component
  };

  return (
    <div className="w-[75vw] md:w-[40vw] space-y-6">
      {/* <StyledInput
        label="Players"
        value={playerCount}
        onChange={(value) => { if (isNaN(Number(value))) return; setPlayerCount(value); }}
        onBlur={(value) => { 
          if (Number(value) < 2) setPlayerCount('2');
          if (Number(value) > 10) setPlayerCount('10');
        }}
        type="text"
      /> */}
      <StyledInput
        label="SB"
        value={smallBlind}
        onChange={(value) => {
          const sb = Number(value);
          const bb = sb * 2;
          setSmallBlind(sb.toString());
          setBigBlind(bb.toString());
          setBuyIn((bb * 100).toString());
        }}
        type="number"
      />
      <StyledInput
        label="BB"
        value={bigBlind}
        onChange={(value) => {
          const bb = Number(value) > Number(smallBlind) ? Number(value) : Number(smallBlind);
          setBigBlind(bb.toString());
          setBuyIn((bb * 100).toString());
        }}
        type="number"
      />
      <StyledInput
        label="Buy-in"
        value={buyIn}
        onChange={(value) => setBuyIn(value)}
        type="number"
      />
      <StyledButton
        onClick={handleSave}
        disabled={Number(playerCount) < 2}
      >
        {Number(playerCount) < 2 ? 'At least 2 players required' : 'Save Settings'}
      </StyledButton>
    </div>
  );
};

const BuyIn: React.FC<BuyInProps> = ({ 
  players,
  bustedPlayers,
  maxBuyIn = 1000, 
  selectedPlayer, 
  handleBuyIn, 
  setSelectedPlayer 
}) => {
  const [buyInAmount, setBuyInAmount] = useState(0);
  const [customMaxBuyIn, setCustomMaxBuyIn] = useState(LocalStorage.get("settings").toObject<Settings>()?.buyIn || maxBuyIn);

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
    <div className="w-[75vw] md:w-[40vw] space-y-6 overflow-x-hidden">
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
    <div className="p-1 w-[65vw] md:w-[40vw]">
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <span className="font-semibold">Name</span>
          <span className="font-bold text-center">Buy In</span>
          <span className="font-bold text-right">P/L</span>
        </div>
        {players.sort((a, b) => b.chipChange - a.chipChange).map((player) => (
          <div key={player.id} className="grid grid-cols-3 gap-4">
            <span className="font-semibold">{player.name}</span>
            <span className="font-bold text-center">${player.buyIn}</span>
            <span className={`font-bold text-right ${
              player.chipChange > 0 
                ? 'bg-white text-black px-2 rounded' 
                : 'text-white'
            }`}>
              {player.chipChange > 0 ? '+' : player.chipChange < 0 ? '-' : ''}${Math.abs(player.chipChange)}
            </span>
          </div>
        ))}
        {bustedPlayers.map((player) => (
          <div key={player.id} className="grid grid-cols-3 gap-4 opacity-50">
            <span className="font-semibold">{player.name} (Busted)</span>
            <span className="font-bold text-center">${player.buyIn}</span>
            <span className="text-white font-bold text-right">
              -${Math.abs(player.chipChange)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Modal;
