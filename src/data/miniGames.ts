export function shuffle<T>(values: readonly T[], random = Math.random): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const MEMORY_PICTURES = ['🐰', '🐶', '🐥', '🍎', '🍌', '🐱', '🐟', '🧸', '🚗', '🌸'];
export function makeMemoryDeck() {
  return shuffle(shuffle(MEMORY_PICTURES).slice(0, 4).flatMap((symbol, pair) =>
    [{ id: pair * 2, symbol }, { id: pair * 2 + 1, symbol }]));
}

// Broad, branching paths; every maze has a route from top-left to bottom-right.
export const MAZES = [
  ['...##', '##.##', '.....', '.###.', '...#.'],
  ['.#...', '.#.#.', '...#.', '##.#.', '...#.'],
  ['...#.', '.#.#.', '.#...', '.###.', '.....'],
];
export function canMove(maze: string[], from: number, to: number) {
  const n = maze.length;
  return to >= 0 && to < n * n && maze[Math.floor(to / n)][to % n] !== '#'
    && Math.abs(Math.floor(from / n) - Math.floor(to / n)) + Math.abs(from % n - to % n) === 1;
}
