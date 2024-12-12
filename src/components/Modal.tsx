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
import { Tab, TabGroup } from './Tab';
import { Dictionary } from '@/type/Dictionary';
import { GameSettingsForm } from './GameSettingForm';
import { GameState } from '@/type/GameState';
import { versions} from '@/data/Versions';

interface ModalProps {
  type: ModalType;
  players: Player[];
  bustedPlayers: Player[];
  visible: boolean;
  withHeader?: boolean;
  selectedPlayer?: Player | null;
  closeOnOutsideClick?: boolean;
  dictionary: Dictionary;
  onClose: () => void;
  getGameState: () => GameState;
  handleBuyIn: (amount: number) => void;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setSelectedPlayer: (player: Player) => void;
}

interface CommonModalProps {
  dictionary: Dictionary;
}

interface PlayerSettingsProps extends CommonModalProps {
  player: Player;
  setPlayer: (value: Player) => void;
}

interface SettingsProps extends CommonModalProps {
  players: Player[];
  bustedPlayers: Player[];
  handleClose: () => void;
  getGameState: () => GameState;
}

interface GameSettingsProps extends CommonModalProps {
  players: Player[];
  bustedPlayers: Player[];
  handleClose: () => void;
}

interface DisplaySettingsProps extends CommonModalProps {
  handleClose: () => void;
  getGameState: () => GameState;
}

interface BuyInProps extends CommonModalProps {
  selectedPlayer: Player | null;
  players: Player[];
  bustedPlayers: Player[];
  maxBuyIn?: number;
  handleBuyIn: (amount: number) => void;
  setSelectedPlayer: (player: Player) => void;
}

interface StaticsProps extends CommonModalProps {
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
  dictionary,
  closeOnOutsideClick = true,
  onClose, 
  getGameState,
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

  const getModalTitle = () => {
    if (type === ModalType.PlayerSettings) return `${dictionary.players.replace('s', '')}${dictionary.settings}`;
    if (type === ModalType.BuyIn) return dictionary.buyIn;
    if (type === ModalType.Statics) return dictionary.statics;
    if (type === ModalType.Settings) return dictionary.settings;
    if (type === ModalType.Information) return dictionary.information;
    return '';
  }

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
    const gameState = LocalStorage.get('history').toObject<GameState[]>();
    if (gameState) {
      let newState = gameState?.length > 0 ? { ...gameState[gameState.length - 1] }: null;
      if (newState) {
        newState.players = players;
        newState.bustedPlayers = bustedPlayers;
        LocalStorage.set('history', [...gameState, newState]);
        console.log(LocalStorage.get('history').toObject<GameState[]>())
      }
    }
    onClose();
  }

  const renderContent = () => {
    if (type === ModalType.PlayerSettings && selectedPlayer) {
      return <PlayerSettings player={selectedPlayer} setPlayer={setPlayer} dictionary={dictionary} />
    } else if (type === ModalType.BuyIn) {
      return (
        <BuyIn 
          handleBuyIn={handleBuyIn} 
          players={players} 
          bustedPlayers={bustedPlayers}
          selectedPlayer={selectedPlayer} 
          setSelectedPlayer={setSelectedPlayer} 
          dictionary={dictionary}
        />
      )
    } else if (type === ModalType.Statics) {
      return <Statics players={players} bustedPlayers={bustedPlayers} dictionary={dictionary} />
    } else if (type === ModalType.Settings) {
      return (
        <Settings 
          players={players} 
          bustedPlayers={bustedPlayers} 
          handleClose={handleClose} 
          getGameState={getGameState} 
          dictionary={dictionary} 
        />
      )
    } else if (type === ModalType.Information) {
      return <Information dictionary={dictionary} />
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
              <h3 className="text-2xl font-semibold">{getModalTitle()}</h3>
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

const PlayerSettings: React.FC<PlayerSettingsProps> = ({ player, setPlayer, dictionary }) => {
  const [name, setName] = useState(player.name);
  const [chips, setChips] = useState(player.chips);

  const handleSave = () => {
    setPlayer({ ...player, name, chips });
  };

  return (
    <div className="space-y-6 w-[75vw] md:w-[20vw]">
      <StyledInput
        label={dictionary.name}
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
        {dictionary.save}
      </StyledButton>
    </div>
  )
}

const Settings: React.FC<SettingsProps> = ({ 
  players, 
  bustedPlayers, 
  dictionary, 
  handleClose, 
  getGameState,
}) => {
  const [activeTab, setActiveTab] = useState('game');

  const tabs = [
    { id: 'game', label: `${dictionary.game} ${dictionary.settings}` },
    { id: 'display', label: `${dictionary.display} ${dictionary.settings}` }
  ];

  return (
    <div className="w-[75vw] md:w-[40vw] min-h-[400px] flex flex-col">
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <Tab label={`${dictionary.game} ${dictionary.settings}`} isActive={activeTab === 'game'}>
          <GameSettings players={players} bustedPlayers={bustedPlayers} handleClose={handleClose} dictionary={dictionary} />
        </Tab>        
        <Tab label={`${dictionary.display} ${dictionary.settings}`} isActive={activeTab === 'display'}>
          <DisplaySettings handleClose={handleClose} getGameState={getGameState} dictionary={dictionary} />
        </Tab>
      </TabGroup>

    </div>
  );
};

const GameSettings: React.FC<GameSettingsProps> = ({ players, bustedPlayers, handleClose, dictionary }) => {
  const [playerCount, setPlayerCount] = useState(String(players.length + bustedPlayers.length));
  const [smallBlind, setSmallBlind] = useState('1');
  const [bigBlind, setBigBlind] = useState('2');
  const [buyIn, setBuyIn] = useState('100');

  const handleGameSettingsSave = () => {
    LocalStorage.set('settings', { playerCount, smallBlind, bigBlind, buyIn });
    handleClose();
    // You might want to add some callback here to notify the parent component
  };

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

  return (
    <GameSettingsForm
      dictionary={dictionary}
      playerCount={playerCount}
      smallBlind={smallBlind}
      bigBlind={bigBlind}
      buyIn={buyIn}
      hasPlayerCountInput={false}
      setPlayerCount={setPlayerCount}
      setSmallBlind={setSmallBlind}
      setBigBlind={setBigBlind}
      setBuyIn={setBuyIn}
      onSubmit={handleGameSettingsSave}
    />
  )
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({ handleClose, getGameState, dictionary }) => {
  
  const [language, setLanguage] = useState(window.location.pathname.split('/')[1]);
  
  const languageOptions = [];
  for (const [key, value] of Object.entries(dictionary.languageOptions)) {
    languageOptions.push({ value: key, label: value });
  }

  const handleDisplaySettingsSave = () => {
    LocalStorage.set('tempGameState', getGameState());
    handleClose();
    window.location.href = `/${language}/game`;
  }

  return (
    <div className="space-y-6">
      <StyledSelect
        label={dictionary.language}
        value={language}
        onChange={(value) => {
          setLanguage(value);
        }}
        options={languageOptions}
      />
      <StyledButton onClick={handleDisplaySettingsSave}>
        {dictionary.save}
      </StyledButton>
    </div>
  )
}

const BuyIn: React.FC<BuyInProps> = ({ 
  players,
  bustedPlayers,
  maxBuyIn = 1000, 
  selectedPlayer, 
  dictionary,
  handleBuyIn, 
  setSelectedPlayer,
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
        label={dictionary.player}
        value={selectedPlayer?.id || ''}
        onChange={(value) => {
          const player = allPlayers.find(p => p.id === Number(value));
          if (player) setSelectedPlayer(player);
          else alert(dictionary.message.playerNotFound);
        }}
        options={playerOptions}
        placeholder={dictionary.message.selectPlayer}
      />

      <StyledInput
        label={`${dictionary.max} ${dictionary.buyIn}`}
        value={customMaxBuyIn}
        onChange={(value) => {
          const newMax = Number(value);
          setCustomMaxBuyIn(newMax);
          setBuyInAmount(Math.min(buyInAmount, newMax));
        }}
        type="number"
      />

      <StyledInput
        label={dictionary.amount}
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
        {dictionary.confirm}
      </StyledButton>
    </div>
  );
};

const Statics: React.FC<StaticsProps> = ({ players, bustedPlayers, dictionary }) => {
  return (
    <div className="p-1 w-[65vw] md:w-[40vw]">
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <span className="font-semibold">{dictionary.name}</span>
          <span className="font-bold text-center">{dictionary.buyIn}</span>
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

const Information: React.FC<CommonModalProps> = ({ dictionary }) => {
  const [activeTab, setActiveTab] = useState('tutorial');

  const tabs = [
    { id: 'tutorial', label: dictionary.tutorial },
    { id: 'patchNotes', label: dictionary.patchNotes }
  ];

  // Function to replace {{key}} with the actual key component
  const replaceKey = (text: string, key: string) => {
    const parts = text.split('{{key}}');
    return (
      <>
        {parts[0]}
        <kbd className="bg-gray-700 px-2 py-1 mx-1 rounded">{key}</kbd>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="w-[75vw] md:w-[40vw] min-h-[400px] flex flex-col">
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <Tab label={dictionary.tutorial} isActive={activeTab === 'tutorial'}>
          <div className="space-y-5">
            <div>
              <h3 className="font-bold mb-2">{dictionary.keyboardControls}</h3>
              <p>{replaceKey(dictionary.tutorialKeyboardControls, 'Ctrl')}</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">{dictionary.chipDisplay}</h3>
              <p>{replaceKey(dictionary.tutorialChipDisplay, 'Shift')}</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">{dictionary.rollback}</h3>
              <p>{dictionary.tutorialGameHistory}</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">{dictionary.showdown}</h3>
              <p>{dictionary.tutorialShowdown}</p>
            </div>
          </div>
        </Tab>        
        <Tab label={dictionary.patchNotes} isActive={activeTab === 'patchNotes'}>
          <div className="space-y-6">
            {versions.map((version) => (
              <div 
                key={version.version} 
                className="border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition-colors"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold">v{version.version}</h2>
                  <span className="text-sm text-gray-400">{version.date}</span>
                </div>
                <ul className="list-disc list-inside space-y-2">
                  {version.changes.map((change, index) => (
                    <li key={index} className="text-gray-300">
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Tab>
      </TabGroup>
      <br />
      <div className="flex flex-col items-center space-y-2">
        <p>{dictionary.contactMe}</p>
        <p 
          className="bg-white text-black px-2 py-1 rounded w-fit select-text cursor-pointer"           
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText('garylamoffical@gmail.com');
            alert('Copied!');
          }}
        >
          garylamoffical@gmail.com
        </p>
      </div>
    </div>
  );
}

export default Modal;
