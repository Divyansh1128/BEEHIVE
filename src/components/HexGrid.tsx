import React from 'react';
import { useCallback } from 'react';

interface HexCellProps {
  value: number | null;
  color: string | null;
  isBeehive: boolean;
  onClick: () => void;
}

const HexCell: React.FC<HexCellProps> = ({ value, color, isBeehive, onClick }) => {
  const bgColor = color || 'bg-gray-100';
  const textColor = color ? 'text-white' : 'text-gray-800';
  
  return (
    <button
      onClick={onClick}
      className={`hex-cell w-16 h-16 ${bgColor} ${textColor} ${
        isBeehive ? 'bg-yellow-300 hover:bg-yellow-400' : 'hover:bg-gray-200'
      } flex items-center justify-center text-xl font-bold transform transition-all duration-200 hover:scale-105`}
    >
      {isBeehive ? '🐝' : value || ''}
    </button>
  );
};

interface HexGridProps {
  grid: Array<{ value: number | null; color: string | null }>;
  currentPlayer: number;
  currentNumber: number;
  beehivePosition: number | null;
  onCellClick: (index: number) => void;
}

const HexGrid: React.FC<HexGridProps> = ({
  grid,
  onCellClick,
  beehivePosition
}) => {
  const rowStructure = [
    [0, 1, 2, 3],
    [4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27],
    [28, 29, 30, 31, 32],
    [33, 34, 35, 36]
  ];

  const getRowOffset = (rowIndex: number): string => {
    const middleRow = 3;
    const offsetPerRow = 16;
    const offset = (middleRow - rowIndex) * offsetPerRow;
    return `${offset}px`;
  };

  return (
    <div className="hex-grid">
      {rowStructure.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="hex-row" 
          style={{ marginLeft: getRowOffset(rowIndex) }}
        >
          {row.map((cellIndex) => (
            <HexCell
              key={cellIndex}
              value={grid[cellIndex].value}
              color={grid[cellIndex].color}
              isBeehive={beehivePosition === cellIndex}
              onClick={() => onCellClick(cellIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default HexGrid;