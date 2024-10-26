import React, { useState, useEffect } from 'react';
import HexGrid from './components/HexGrid';
import DiceRoller from './components/DiceRoller';
import PlayerInfo from './components/PlayerInfo';
import { Trophy } from 'lucide-react';

function App() {
  const [grid, setGrid] = useState<Array<{ value: number | null; color: string | null }>>(
    Array(37).fill({ value: null, color: null })
  );
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [currentNumber, setCurrentNumber] = useState<number>(1);
  const [diceValues, setDiceValues] = useState<number[]>([0, 0, 0]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [playerOrder, setPlayerOrder] = useState<number[]>([]);
  const [scores, setScores] = useState<number[]>([0, 0, 0]);
  const [winner, setWinner] = useState<number | null>(null);
  const [placedNumbers, setPlacedNumbers] = useState<number>(0);
  const [beehivePosition, setBeehivePosition] = useState<number | null>(null);

  const getPlayerColor = (player: number): string => {
    switch (player) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-blue-500';
      case 3: return 'bg-black';
      default: return '';
    }
  };

  const getNeighborIndices = (index: number): number[] => {
    // Define neighbors based on the hexagonal grid structure
    const neighbors: { [key: number]: number[] } = {
      // Row 1
      0: [1, 4, 5],
      1: [0, 2, 5, 6],
      2: [1, 3, 6, 7],
      3: [2, 7, 8],
      // Row 2
      4: [0, 5, 9, 10],
      5: [0, 1, 4, 6, 10, 11],
      6: [1, 2, 5, 7, 11, 12],
      7: [2, 3, 6, 8, 12, 13],
      8: [3, 7, 13, 14],
      // ... Continue for all cells
    };
    return neighbors[index] || [];
  };

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    const rollInterval = setInterval(() => {
      setDiceValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      setIsRolling(false);
      const finalValues = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      setDiceValues(finalValues);
      
      if (!gameStarted) {
        const order = [1, 2, 3].sort((a, b) => finalValues[b - 1] - finalValues[a - 1]);
        setPlayerOrder(order);
        setCurrentPlayer(order[0]);
        setGameStarted(true);
      }
    }, 1000);
  };

  const handleCellClick = (index: number) => {
    if (!gameStarted || grid[index].value !== null || beehivePosition === index || currentNumber > 12) return;

    const newGrid = [...grid];
    newGrid[index] = { value: currentNumber, color: getPlayerColor(currentPlayer) };
    setGrid(newGrid);
    setPlacedNumbers(prev => prev + 1);

    // If this was the last number (36th placement), set the remaining cell as beehive
    if (placedNumbers === 35) {
      const emptyCell = grid.findIndex((cell, idx) => cell.value === null);
      setBeehivePosition(emptyCell);
      calculateScores(newGrid, emptyCell);
    } else {
      const nextPlayer = playerOrder[(playerOrder.indexOf(currentPlayer) + 1) % 3];
      setCurrentPlayer(nextPlayer);
      
      if (playerOrder.indexOf(currentPlayer) === 2) {
        setCurrentNumber(prev => prev + 1);
      }
    }
  };

  const calculateScores = (finalGrid: typeof grid, beehive: number) => {
    const neighbors = getNeighborIndices(beehive);
    const playerScores = [0, 0, 0];

    neighbors.forEach(neighbor => {
      const cell = finalGrid[neighbor];
      if (cell.value && cell.color) {
        const playerIndex = cell.color === 'bg-red-500' ? 0 : 
                          cell.color === 'bg-blue-500' ? 1 : 2;
        playerScores[playerIndex] += cell.value;
      }
    });

    setScores(playerScores);
    const winningScore = Math.min(...playerScores);
    const winningPlayer = playerOrder[playerScores.indexOf(winningScore)];
    setWinner(winningPlayer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-amber-800">
          Hexagonal Beehive Game
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <HexGrid
                grid={grid}
                currentPlayer={currentPlayer}
                currentNumber={currentNumber}
                beehivePosition={beehivePosition}
                onCellClick={handleCellClick}
              />
            </div>
          </div>

          <div className="space-y-6">
            {!gameStarted ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Roll to Start</h2>
                <p className="mb-4">Each player rolls the dice. Highest roll chooses the playing order.</p>
                <DiceRoller
                  diceValues={diceValues}
                  onRollDice={rollDice}
                  isRolling={isRolling}
                />
              </div>
            ) : (
              <>
                <PlayerInfo
                  currentPlayer={currentPlayer}
                  currentNumber={Math.min(currentNumber, 12)}
                  scores={scores}
                  playerOrder={playerOrder}
                  maxNumber={12}
                />
                
                {winner && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-8 h-8" />
                      <h2 className="text-2xl font-bold">Winner!</h2>
                    </div>
                    <p className="text-xl">
                      Player {winner} wins with a score of {scores[winner - 1]}!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;