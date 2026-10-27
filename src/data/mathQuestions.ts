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
  ['🍑', 'quả đào'], ['🍋', 'quả chanh'], ['🍅', 'quả cà chua'], ['🍆', 'quả cà tím'],
  ['🥔', 'củ khoai tây'], ['🥒', 'quả dưa chuột'], ['🍇', 'chùm nho'], ['🥦', 'cây súp lơ'],
  ['🐷', 'chú heo'], ['🐮', 'chú bò'], ['🐵', 'chú khỉ'], ['🐘', 'chú voi'],
  ['🐯', 'chú hổ'], ['🦁', 'chú sư tử'], ['🐨', 'chú gấu túi'], ['🐧', 'chú chim cánh cụt'],
  ['🐬', 'chú cá heo'], ['🐳', 'chú cá voi'], ['🐙', 'chú bạch tuộc'], ['🦀', 'chú cua'],
  ['🐌', 'chú ốc sên'], ['🐜', 'chú kiến'], ['🐑', 'chú cừu'], ['🐴', 'chú ngựa'],
  ['🌻', 'bông hướng dương'], ['🌷', 'bông hoa tulip'], ['🌸', 'bông hoa anh đào'], ['🌹', 'bông hoa hồng'],
  ['⭐', 'ngôi sao'], ['🎈', 'quả bóng bay'], ['🎁', 'hộp quà'], ['🧸', 'chú gấu bông'],
] as const;
export const COLORS = [
  ['Đỏ', '#ef4444'], ['Xanh dương', '#2563eb'], ['Xanh lá', '#16a34a'],
  ['Vàng', '#facc15'], ['Hồng', '#ec4899'], ['Cam', '#f97316'], ['Tím', '#9333ea'],
  ['Nâu', '#92400e'], ['Trắng', '#ffffff'], ['Đen', '#1f2937'],
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
      result = { kind, prompt: pick([
        `Bé hãy tìm xem đâu là ${label}?`, `Bé chạm vào ${label} nhé!`,
        `Trong các hình này, hình nào là ${label}?`, `Mình cùng tìm ${label} nào!`,
        `Bé chọn ${label} giúp bạn thú cưng nhé!`, `Bé nhìn kỹ rồi tìm ${label} nhé!`,
      ]), answer: shape,
        choices: shuffle(SHAPES).map(([id, label], i) => ({ id, label, shape: id, color: COLORS[i][1] })) };
    } else if (kind === 'color') {
      const options = shuffle(COLORS).slice(0, 4);
      const target = pick(options);
      const colorName = target[0].toLowerCase();
      result = { kind, prompt: pick([
        `Đâu là chiếc áo màu ${colorName}?`, `Bé chọn chiếc áo màu ${colorName} nhé!`,
        `Mình cùng tìm áo màu ${colorName} nào!`, `Chiếc áo nào có màu ${colorName}?`,
        `Bé chạm vào áo màu ${colorName} giúp bạn nhé!`, `Trong các chiếc áo, đâu là áo màu ${colorName}?`,
      ]), answer: target[0],
        choices: options.map(([id, color]) => ({ id, label: `Áo màu ${id.toLowerCase()}`, color, object: 'shirt' })) };
    } else if (kind === 'size') {
      const axis = pick(['ball', 'tree', 'train'] as const);
      const big = random() < 0.5;
      const adjectives = { ball: ['to hơn', 'nhỏ hơn'], tree: ['cao hơn', 'thấp hơn'], train: ['dài hơn', 'ngắn hơn'] };
      const nouns = { ball: 'Quả bóng', tree: 'Cây', train: 'Đoàn tàu' };
      const noun = nouns[axis].toLowerCase();
      const adjective = adjectives[axis][big ? 0 : 1];
      result = { kind, prompt: pick([
        `${nouns[axis]} nào ${adjective}?`, `Bé chọn ${noun} ${adjective} nhé!`,
        `Bé chạm vào ${noun} ${adjective} nào!`, `Hai ${noun} khác nhau. Cái nào ${adjective}?`,
        `Mình cùng tìm ${noun} ${adjective} nhé!`, `Bé quan sát rồi chọn ${noun} ${adjective} nhé!`,
      ]), answer: big ? 'large' : 'small',
        choices: shuffle([{ id: 'small', label: `${nouns[axis]} nhỏ`, size: 0.5, object: axis },
          { id: 'large', label: `${nouns[axis]} lớn`, size: 1, object: axis }]) };
    } else if (kind === 'space') {
      const [position] = pick(POSITIONS);
      const animal = pick(PICTURE_POOL);
      result = { kind, prompt: pick([
        `Bé xem ${animal[1]} ở đâu so với chiếc hộp?`,
        `So với chiếc hộp, ${animal[1]} ở phía nào?`,
        `Bé tìm vị trí của ${animal[1]} so với chiếc hộp nhé!`,
        `Nhìn chiếc hộp nhé! ${animal[1]} nằm ở phía nào?`,
        `Bé quan sát: ${animal[1]} ở bên nào của chiếc hộp?`,
        `Bé chỉ vị trí của ${animal[1]} so với hộp nào!`,
      ]), emoji: animal[0], position, answer: position,
        choices: POSITIONS.map(([id, label]) => ({ id, label })) };
    } else if (kind === 'comparison') {
      const a = pick([1,2,3,4,5]);
      const b = pick([1,2,3,4,5].filter(n => n !== a));
      const more = random() < 0.5;
      const amount = more ? 'nhiều' : 'ít';
      result = { kind, prompt: pick([
        `Nhóm nào có ${amount} ${name} hơn?`, `Bé chọn nhóm có ${amount} ${name} hơn nhé!`,
        `Bên nào có ${amount} ${name} hơn nhỉ?`, `Cùng đếm nhé! Nhóm nào có ${amount} ${name} hơn?`,
        `Bé nhìn hai nhóm. Nhóm nào có ${amount} ${name} hơn?`, `Mình tìm nhóm có ${amount} ${name} hơn nào!`,
      ]),
        answer: (more ? a > b : a < b) ? 'a' : 'b',
        choices: [{ id: 'a', label: 'Nhóm bên trái', emoji, count: a }, { id: 'b', label: 'Nhóm bên phải', emoji, count: b }] };
    } else if (kind === 'addition') {
      const a = pick([1,2,3]); const b = pick(Array.from({length: 5-a}, (_, i) => i+1));
      result = { kind, prompt: pick([
        `Có ${a} ${name}, thêm ${b} ${name}. Có tất cả bao nhiêu?`,
        `Một nhóm có ${a} ${name}, nhóm kia có ${b}. Hai nhóm có bao nhiêu ${name}?`,
        `Gộp ${a} ${name} với ${b} ${name}. Bé đếm được bao nhiêu?`,
        `Bé thấy ${a} ${name} và ${b} ${name}. Tất cả là bao nhiêu?`,
        `${a} ${name} thêm ${b} ${name} nữa. Bé chọn số đúng nhé!`,
        `Mình đếm chung ${a} ${name} và ${b} ${name} nhé! Có mấy ${name}?`,
      ]), emoji,
        addends: [a,b], answer: String(a+b), choices: numeric(a+b) };
    } else {
      const count = pick([1,2,3,4,5]);
      result = { kind, prompt: pick([
        `Bé đếm xem có bao nhiêu ${name}?`, `Trong hình có mấy ${name} nhỉ?`,
        `Mình cùng đếm các ${name} nhé! Có tất cả bao nhiêu?`, `Bé chọn số bằng số ${name} trong hình nhé!`,
        `Có tất cả bao nhiêu ${name}? Bé đếm thật chậm nhé!`, `Bé giúp bạn đếm những ${name} này nào!`,
      ]), emoji, count, answer: String(count), choices: numeric(count) };
    }
    if (attempt >= 8 || !previous || JSON.stringify(result) !== JSON.stringify(previous)) return result;
  }
}
