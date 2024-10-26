import React from 'react';
import { User } from 'lucide-react';

interface PlayerInfoProps {
  currentPlayer: number;
  currentNumber: number;
  scores: number[];
  playerOrder: number[];
  maxNumber: number;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  currentPlayer,
  currentNumber,
  scores,
  playerOrder,
  maxNumber,
}) => {
  const getPlayerColor = (player: number) => {
    switch (player) {
      case 1: return 'text-red-500';
      case 2: return 'text-blue-500';
      case 3: return 'text-black';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Game Status</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Current Number:</span>
          <span className="text-xl">{currentNumber} / {maxNumber}</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">Players:</h3>
          <div className="flex flex-col gap-2">
            {playerOrder.map((player, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 ${getPlayerColor(player)} ${
                  currentPlayer === player ? 'ring-2 ring-offset-2 ring-indigo-500 p-2 rounded-lg' : ''
                }`}
              >
                <User />
                <span>Player {player}</span>
                {scores[player - 1] !== undefined && scores[player - 1] > 0 && (
                  <span className="font-mono">Score: {scores[player - 1]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;