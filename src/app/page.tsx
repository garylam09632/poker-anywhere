'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [playerCount, setPlayerCount] = useState(2);
  const [smallBlind, setSmallBlind] = useState(1);
  const [bigBlind, setBigBlind] = useState(2);
  const [buyIn, setBuyIn] = useState(100);
  const router = useRouter();

  const handleStartGame = () => {
    router.push(`/game?players=${playerCount}&smallBlind=${smallBlind}&bigBlind=${bigBlind}&buyIn=${buyIn}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Poker Chip Calculator</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="playerCount" className="block">Number of Players:</label>
          <input
            type="number"
            id="playerCount"
            value={playerCount}
            onChange={(e) => setPlayerCount(Number(e.target.value))}
            min="2"
            max="10"
            className="border p-2"
          />
        </div>
        <div>
          <label htmlFor="smallBlind" className="block">Small Blind:</label>
          <input
            type="number"
            id="smallBlind"
            value={smallBlind}
            onChange={(e) => setSmallBlind(Number(e.target.value))}
            min="1"
            className="border p-2"
          />
        </div>
        <div>
          <label htmlFor="bigBlind" className="block">Big Blind:</label>
          <input
            type="number"
            id="bigBlind"
            value={bigBlind}
            onChange={(e) => setBigBlind(Number(e.target.value))}
            min="2"
            className="border p-2"
          />
        </div>
        <div>
          <label htmlFor="buyIn" className="block">Buy-in:</label>
          <input
            type="number"
            id="buyIn"
            value={buyIn}
            onChange={(e) => setBuyIn(Number(e.target.value))}
            min="1"
            className="border p-2"
          />
        </div>
        <button
          onClick={handleStartGame}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}