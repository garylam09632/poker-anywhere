import React, { useState } from 'react';
import Player from '@/type/interface/Player';

interface BuyInModalProps {
  player: Player;
  onClose: () => void;
  onBuyIn: (amount: number) => void;
}

const BuyInModal: React.FC<BuyInModalProps> = ({ player, onClose, onBuyIn }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const buyInAmount = Number(amount);
    if (buyInAmount > 0) {
      onBuyIn(buyInAmount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Buy In for {player.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="buyInAmount" className="block text-sm font-medium mb-2">
              Buy In Amount
            </label>
            <input
              type="number"
              id="buyInAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Buy In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyInModal;