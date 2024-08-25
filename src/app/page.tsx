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
    if (playerCount >= 2) {
      router.push(`/game?players=${playerCount}&smallBlind=${smallBlind}&bigBlind=${bigBlind}&buyIn=${buyIn}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2 text-center">Poker Anywhere!</h1>
        <p className="text-md mb-8 text-center text-gray-400">Focus on the game, not the chips</p>
        <div className="max-w-md mx-auto bg-white text-black p-8 rounded-lg shadow-2xl">
          <div className="space-y-6">
            <div>
              <label htmlFor="playerCount" className="block text-sm font-medium mb-2">Number of Players</label>
              <input
                type="number"
                id="playerCount"
                value={playerCount}
                onChange={(e) => setPlayerCount(Math.max(2, Math.min(10, Number(e.target.value))))}
                min="2"
                max="10"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="smallBlind" className="block text-sm font-medium mb-2">Small Blind</label>
              <input
                type="number"
                id="smallBlind"
                value={smallBlind}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setSmallBlind(value);
                  setBigBlind(Math.max(value * 2, bigBlind));
                }}
                min="1"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="bigBlind" className="block text-sm font-medium mb-2">Big Blind</label>
              <input
                type="number"
                id="bigBlind"
                value={bigBlind}
                onChange={(e) => setBigBlind(Math.max(smallBlind * 2, Number(e.target.value)))}
                min={smallBlind * 2}
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="buyIn" className="block text-sm font-medium mb-2">Buy-in</label>
              <input
                type="number"
                id="buyIn"
                value={buyIn}
                onChange={(e) => setBuyIn(Math.max(bigBlind * 20, Number(e.target.value)))}
                min={bigBlind * 20}
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button
              onClick={handleStartGame}
              disabled={playerCount < 2}
              className={`w-full font-bold py-3 px-4 rounded-md transition duration-300 ${
                playerCount < 2
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {playerCount < 2 ? 'At least 2 players required' : 'Start Game'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}