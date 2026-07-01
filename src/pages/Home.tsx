import { useMemo, useState } from 'react';

type Cell = 'X' | 'O' | null;

const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board: Cell[]): { winner: Cell; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

export default function Home() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const result = useMemo(() => calculateWinner(board), [board]);
  const isDraw = !result && board.every((c) => c !== null);
  const gameOver = !!result || isDraw;

  const handleClick = (i: number) => {
    if (board[i] || gameOver) return;
    const next = board.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext(!xIsNext);

    const finished = calculateWinner(next);
    if (finished) {
      setScores((s) => ({ ...s, [finished.winner as 'X' | 'O']: s[finished.winner as 'X' | 'O'] + 1 }));
    } else if (next.every((c) => c !== null)) {
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
    }
  };

  const resetRound = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const resetAll = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const status = result
    ? `Player ${result.winner} wins!`
    : isDraw
    ? "It's a draw."
    : `Player ${xIsNext ? 'X' : 'O'}'s turn`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-red-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-extrabold text-red-700 tracking-tight drop-shadow-sm">
            Tic Tac Toe
          </h1>
          <p className="mt-2 text-red-500 font-medium">A classic in crimson.</p>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl bg-white border-2 border-red-200 p-3 text-center shadow-sm">
            <div className="text-xs uppercase tracking-wider text-red-400 font-semibold">Player X</div>
            <div className="text-2xl font-bold text-red-700">{scores.X}</div>
          </div>
          <div className="rounded-xl bg-white border-2 border-red-200 p-3 text-center shadow-sm">
            <div className="text-xs uppercase tracking-wider text-red-400 font-semibold">Draws</div>
            <div className="text-2xl font-bold text-red-700">{scores.draws}</div>
          </div>
          <div className="rounded-xl bg-white border-2 border-red-200 p-3 text-center shadow-sm">
            <div className="text-xs uppercase tracking-wider text-red-400 font-semibold">Player O</div>
            <div className="text-2xl font-bold text-red-700">{scores.O}</div>
          </div>
        </div>

        {/* Status */}
        <div
          className={`text-center rounded-xl py-3 mb-5 font-semibold text-lg shadow-sm border-2 ${
            result
              ? 'bg-red-600 text-white border-red-700'
              : isDraw
              ? 'bg-rose-200 text-red-800 border-rose-300'
              : 'bg-white text-red-700 border-red-200'
          }`}
        >
          {status}
        </div>

        {/* Board */}
        <div className="rounded-2xl bg-red-600 p-3 shadow-xl shadow-red-300/50">
          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, i) => {
              const winning = result?.line.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  disabled={!!cell || gameOver}
                  className={`aspect-square rounded-xl text-5xl font-black flex items-center justify-center transition-all select-none
                    ${
                      winning
                        ? 'bg-yellow-300 text-red-800 scale-105'
                        : cell
                        ? 'bg-red-50 text-red-700'
                        : 'bg-white text-red-700 hover:bg-red-100 active:scale-95'
                    }
                    ${!cell && !gameOver ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  {cell}
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={resetRound}
            className="rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 shadow-md transition"
          >
            New Round
          </button>
          <button
            onClick={resetAll}
            className="rounded-xl bg-white hover:bg-red-50 active:bg-red-100 text-red-700 font-semibold py-3 border-2 border-red-300 shadow-sm transition"
          >
            Reset Scores
          </button>
        </div>

        <p className="text-center text-red-400 text-xs mt-6">
          Take turns tapping a square. Three in a row wins.
        </p>
      </div>
    </div>
  );
}
