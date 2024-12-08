'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '@/utils/LocalStorage';
import { Dictionary } from '@/type/Dictionary';
import { GameSettingsForm } from '../GameSettingForm';
import OrientationGuard from '../OrientationGuard';
import { DeviceType } from '@/type/General';

export default function Home({
  dictionary,
}: {
  dictionary: Dictionary;
}) {
  const [playerCount, setPlayerCount] = useState('2');
  const [smallBlind, setSmallBlind] = useState('1');
  const [bigBlind, setBigBlind] = useState('2');
  const [buyIn, setBuyIn] = useState('100');
  const [loaded, setLoaded] = useState(false);

  const router = useRouter();
  
  const handleStartGame = () => {
    if (Number(playerCount) >= 2) {
      router.push(`/game`);
      LocalStorage.set('settings', { playerCount, smallBlind, bigBlind, buyIn });
    }
  };

  useEffect(() => { 
    setLoaded(true);
  }, []);

  return loaded && (
    <OrientationGuard deviceType={document?.documentElement.dataset.device as DeviceType}>
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="container mx-auto p-8 xxs:items-center xxs:pr-5 xxs:pl-5">
        <h1 className="text-4xl font-bold mb-2 text-center">Poker Anywhere!</h1>
        <p className="text-md mb-8 text-center text-gray-400">{dictionary.slogan}</p>
        <div className="max-w-md mx-auto bg-black text-white p-8 rounded-lg shadow-2xl border border-gray-700">
          <GameSettingsForm 
            dictionary={dictionary} 
            playerCount={playerCount}
            smallBlind={smallBlind}
            bigBlind={bigBlind}
            buyIn={buyIn}
            setPlayerCount={setPlayerCount}
            setSmallBlind={setSmallBlind}
            setBigBlind={setBigBlind}
            setBuyIn={setBuyIn}
            onSubmit={handleStartGame}
          />
        </div>
        </div>
      </div>
    </OrientationGuard>
  );
}