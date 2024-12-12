import { Dictionary } from '@/type/Dictionary';
import { StyledInput } from './StyledInput';
import { StyledButton } from './StyledButton';
import { Validator } from '@/utils/Validator';
import { useState } from 'react';

interface GameSettingsFormProps {
  dictionary: Dictionary;
  playerCount: string;
  smallBlind: string;
  bigBlind: string;
  buyIn: string;
  hasPlayerCountInput?: boolean;
  setPlayerCount: (value: string) => void;
  setSmallBlind: (value: string) => void;
  setBigBlind: (value: string) => void;
  setBuyIn: (value: string) => void;
  onSubmit: () => void;
}

export function GameSettingsForm({ 
  dictionary,
  playerCount,
  smallBlind,
  bigBlind,
  buyIn,
  hasPlayerCountInput = true,
  setPlayerCount,
  setSmallBlind,
  setBigBlind,
  setBuyIn,
  onSubmit
}: GameSettingsFormProps) {
  const [reset, setReset] = useState(false);
  return (
    <div className="space-y-10">
      {hasPlayerCountInput && (
        <StyledInput
          label={dictionary.players}
          value={playerCount}
          onChange={(value) => { if (isNaN(Number(value))) return; setPlayerCount(value); }}
          onBlur={(value) => { 
            if (Number(value) < 2) setPlayerCount('2');
            if (Number(value) > 10) setPlayerCount('10');
          }}
          type="text"
        />
      )}
      <StyledInput
        id="smallBlind"
        label={dictionary.smallBlind}
        value={smallBlind}
        onChange={(value) => {
          const newValue = Number(value);
          const bigBlindValue = Math.max(newValue * 2, Number(bigBlind));
          setSmallBlind(newValue.toString());
          setBigBlind(bigBlindValue.toString());
          setBuyIn((bigBlindValue * 100).toString());
          setReset(!reset);
        }}
        onValidate={(value) => Validator.validateSmallBlind(value, dictionary)}
        type="number"
      />
      <StyledInput
        id="bigBlind"
        label={dictionary.bigBlind}
        value={bigBlind}
        onChange={(value) => {
          const newValue = Number(value);
          setBigBlind(newValue.toString());
          setBuyIn((newValue * 100).toString());
          setReset(!reset);
        }}
        onValidate={(value) => Validator.validateBigBlind(value, smallBlind, dictionary)}
        type="number"
        reset={reset}
      />
      <StyledInput
        id="buyIn"
        label={dictionary.buyIn}
        value={buyIn}
        onChange={(value) => {
          setBuyIn(value);
          setReset(!reset);
        }}
        type="number"
        onValidate={(value) => Validator.validateBuyIn(value, bigBlind, dictionary)}
        reset={reset}
      />
      <StyledButton
        size="md"
        onClick={onSubmit}
        disabled={
          Number(playerCount) < 2 ||
          Number(smallBlind) < 1 ||
          Number(bigBlind) < Number(smallBlind) ||
          Number(buyIn) < Number(bigBlind) * 2
        }
      >
        {Number(playerCount) < 2 ? dictionary.message.atLeast2PlayersRequired : dictionary.start}
      </StyledButton>
    </div>
  );
}