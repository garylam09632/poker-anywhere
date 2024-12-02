'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StyledInput } from '../components/StyledInput';
import { StyledButton } from '../components/StyledButton';
import { LocalStorage } from '@/utils/LocalStorage';

export default function Home() {
  const [playerCount, setPlayerCount] = useState('2');
  const [smallBlind, setSmallBlind] = useState('1');
  const [bigBlind, setBigBlind] = useState('2');
  const [buyIn, setBuyIn] = useState('100');
  const router = useRouter();

  const handleStartGame = () => {
    if (Number(playerCount) >= 2) {
      router.push(`/test`);
      LocalStorage.set('settings', { playerCount, smallBlind, bigBlind, buyIn });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="container mx-auto p-8 xxs:items-center xxs:pr-5 xxs:pl-5">
        <h1 className="text-4xl font-bold mb-2 text-center">Poker Anywhere!</h1>
        <p className="text-md mb-8 text-center text-gray-400">Focus on the game, not the chips</p>
        <div className="max-w-md mx-auto bg-black text-white p-8 rounded-lg shadow-2xl border border-gray-700">
          <div className="space-y-6">
            <StyledInput
              label="Players"
              value={playerCount}
              onChange={(value) => { if (isNaN(Number(value))) return; setPlayerCount(value); }}
              onBlur={(value) => { 
                if (Number(value) < 2) setPlayerCount('2');
                if (Number(value) > 10) setPlayerCount('10');
              }}
              type="text"
            />
            <StyledInput
              label="SB"
              value={smallBlind}
              onChange={(value) => {
                const newValue = Number(value);
                setSmallBlind(newValue.toString());
                setBigBlind(Math.max(newValue * 2, Number(bigBlind)).toString());
              }}
              type="number"
            />
            <StyledInput
              label="BB"
              value={bigBlind}
              onChange={(value) => setBigBlind(Math.max(Number(smallBlind) * 2, Number(value)).toString())}
              type="number"
            />
            <StyledInput
              label="Buy-in"
              value={buyIn}
              onChange={(value) => setBuyIn(value)}
              type="number"
            />
            <StyledButton
              onClick={handleStartGame}
              disabled={Number(playerCount) < 2}
            >
              {Number(playerCount) < 2 ? 'At least 2 players required' : 'Start Game'}
            </StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
}