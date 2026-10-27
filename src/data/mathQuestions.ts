export type Lesson = 'counting' | 'comparison' | 'addition' | 'shape' | 'size' | 'color' | 'space';
export type Shape = 'circle' | 'square' | 'triangle' | 'rectangle';
export type Position = 'above' | 'below' | 'left' | 'right';
export interface Choice {
  id: string; label: string; emoji?: string; count?: number;
  shape?: Shape; color?: string; size?: number; object?: 'ball' | 'tree' | 'train' | 'shirt';
}
export interface Question {
  kind: Lesson; prompt: string; choices: Choice[]; answer: string;
  emoji?: string; count?: number; addends?: [number, number]; position?: Position;
}
export const LESSONS: { id: Lesson; label: string; icon: string }[] = [
  { id: 'counting', label: 'Đếm số', icon: '🍎' },
  { id: 'comparison', label: 'Nhiều · Ít', icon: '🐥' },
  { id: 'addition', label: 'Cộng vui', icon: '➕' },
  { id: 'shape', label: 'Hình khối', icon: '🔺' },
  { id: 'size', label: 'Kích thước', icon: '🌳' },
  { id: 'color', label: 'Màu sắc', icon: '🎨' },
  { id: 'space', label: 'Vị trí', icon: '📦' },
];

// Also remembers the last lesson when the popup is closed and reopened.
let lastLesson: Lesson | undefined;
export function makeRandomQuestion(previous?: Question, random: () => number = Math.random): Question {
  const excluded = previous?.kind ?? lastLesson;
  const choices = LESSONS.filter(lesson => lesson.id !== excluded);
  const kind = choices[Math.floor(random() * choices.length)].id;
  lastLesson = kind;
  return makeQuestion(kind, previous, random);
}
export const PICTURE_POOL = [
  ['🍎', 'quả táo'], ['🍐', 'quả lê'], ['🍊', 'quả cam'], ['🍓', 'quả dâu'],
  ['🍌', 'quả chuối'], ['🍉', 'miếng dưa hấu'], ['🍍', 'quả dứa'], ['🥭', 'quả xoài'],
  ['🥝', 'quả kiwi'], ['🍒', 'cặp anh đào'], ['🥕', 'củ cà rốt'], ['🌽', 'bắp ngô'],
  ['🐥', 'chú gà con'], ['🐰', 'chú thỏ'], ['🐱', 'chú mèo'], ['🐶', 'chú cún'],
  ['🐢', 'chú rùa'], ['🦋', 'chú bướm'], ['🐝', 'chú ong'], ['🐠', 'chú cá'],
  ['🐸', 'chú ếch'], ['🐞', 'chú bọ rùa'], ['🦆', 'chú vịt'], ['🐼', 'chú gấu trúc'],
] as const;
export const COLORS = [
  ['Đỏ', '#ef4444'], ['Xanh dương', '#2563eb'], ['Xanh lá', '#16a34a'],
  ['Vàng', '#facc15'], ['Hồng', '#ec4899'], ['Cam', '#f97316'], ['Tím', '#9333ea'],
] as const;
const SHAPES: [Shape, string][] = [['circle', 'hình tròn'], ['square', 'hình vuông'], ['triangle', 'hình tam giác'], ['rectangle', 'hình chữ nhật']];
export const POSITIONS: [Position, string][] = [['above', 'Trên'], ['below', 'Dưới'], ['left', 'Trái'], ['right', 'Phải']];

export function makeQuestion(kind: Lesson, previous?: Question, random: () => number = Math.random): Question {
  const pick = <T,>(items: readonly T[]): T => items[Math.floor(random() * items.length)];
  const shuffle = <T,>(items: readonly T[]): T[] => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const numeric = (answer: number) => shuffle([answer, ...shuffle([1,2,3,4,5].filter(n => n !== answer)).slice(0,2)])
    .map(n => ({ id: String(n), label: String(n) }));
  let result: Question;
  for (let attempt = 0; ; attempt++) {
    const [emoji, name] = pick(PICTURE_POOL);
    if (kind === 'shape') {
      const [shape, label] = pick(SHAPES);
      result = { kind, prompt: `Bé hãy tìm xem đâu là ${label}?`, answer: shape,
        choices: shuffle(SHAPES).map(([id, label], i) => ({ id, label, shape: id, color: COLORS[i][1] })) };
    } else if (kind === 'color') {
      const options = shuffle(COLORS).slice(0, 4);
      const target = pick(options);
      result = { kind, prompt: `Đâu là chiếc áo màu ${target[0].toLowerCase()}?`, answer: target[0],
        choices: options.map(([id, color]) => ({ id, label: `Áo màu ${id.toLowerCase()}`, color, object: 'shirt' })) };
    } else if (kind === 'size') {
      const axis = pick(['ball', 'tree', 'train'] as const);
      const big = random() < 0.5;
      const adjectives = { ball: ['to hơn', 'nhỏ hơn'], tree: ['cao hơn', 'thấp hơn'], train: ['dài hơn', 'ngắn hơn'] };
      const nouns = { ball: 'Quả bóng', tree: 'Cây', train: 'Đoàn tàu' };
      result = { kind, prompt: `${nouns[axis]} nào ${adjectives[axis][big ? 0 : 1]}?`, answer: big ? 'large' : 'small',
        choices: shuffle([{ id: 'small', label: `${nouns[axis]} nhỏ`, size: 0.5, object: axis },
          { id: 'large', label: `${nouns[axis]} lớn`, size: 1, object: axis }]) };
    } else if (kind === 'space') {
      const [position] = pick(POSITIONS);
      const animal = pick([['🐱', 'Chú mèo'], ['🐥', 'Chú gà'], ['🐰', 'Chú thỏ'], ['🍎', 'Quả táo']] as const);
      result = { kind, prompt: `${animal[1]} ở đâu so với chiếc hộp?`, emoji: animal[0], position, answer: position,
        choices: POSITIONS.map(([id, label]) => ({ id, label })) };
    } else if (kind === 'comparison') {
      const a = pick([1,2,3,4,5]);
      const b = pick([1,2,3,4,5].filter(n => n !== a));
      const more = random() < 0.5;
      result = { kind, prompt: `Nhóm nào có ${more ? 'nhiều' : 'ít'} ${name} hơn?`,
        answer: (more ? a > b : a < b) ? 'a' : 'b',
        choices: [{ id: 'a', label: 'Nhóm bên trái', emoji, count: a }, { id: 'b', label: 'Nhóm bên phải', emoji, count: b }] };
    } else if (kind === 'addition') {
      const a = pick([1,2,3]); const b = pick(Array.from({length: 5-a}, (_, i) => i+1));
      result = { kind, prompt: `Có ${a} ${name}, thêm ${b} ${name}. Có tất cả bao nhiêu?`, emoji,
        addends: [a,b], answer: String(a+b), choices: numeric(a+b) };
    } else {
      const count = pick([1,2,3,4,5]);
      result = { kind, prompt: `Bé đếm xem có bao nhiêu ${name}?`, emoji, count, answer: String(count), choices: numeric(count) };
    }
    if (attempt >= 8 || !previous || JSON.stringify(result) !== JSON.stringify(previous)) return result;
  }
}
