import React from 'react';
import { Dice6 } from 'lucide-react';

interface DiceRollerProps {
  diceValues: number[];
  onRollDice: () => void;
  isRolling: boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ diceValues, onRollDice, isRolling }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        {diceValues.map((value, index) => (
          <div
            key={index}
            className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center text-2xl font-bold"
          >
            {isRolling ? <Dice6 className="animate-spin" /> : value}
          </div>
        ))}
      </div>
      <button
        onClick={onRollDice}
        disabled={isRolling}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
};

export default DiceRoller;