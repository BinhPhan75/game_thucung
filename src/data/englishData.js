// Separate preschool English vocabulary and practice bank.
export const englishTopics = [
  { id: 'animals', label: 'Động vật', english: 'Animals' },
  { id: 'fruits', label: 'Trái cây & Nông sản', english: 'Fruits & Crops' },
  { id: 'colors', label: 'Màu sắc & Hình khối', english: 'Colors & Shapes' },
];

export const englishWords = [
  { id: 'cat', topic: 'animals', word: 'Cat', meaning: 'Mèo', symbol: '🐱' },
  { id: 'dog', topic: 'animals', word: 'Dog', meaning: 'Chó', symbol: '🐶' },
  { id: 'rabbit', topic: 'animals', word: 'Rabbit', meaning: 'Thỏ', symbol: '🐰' },
  { id: 'duck', topic: 'animals', word: 'Duck', meaning: 'Vịt', symbol: '🦆' },
  { id: 'fish', topic: 'animals', word: 'Fish', meaning: 'Cá', symbol: '🐟' },
  { id: 'apple', topic: 'fruits', word: 'Apple', meaning: 'Táo', symbol: '🍎' },
  { id: 'banana', topic: 'fruits', word: 'Banana', meaning: 'Chuối', symbol: '🍌' },
  { id: 'orange', topic: 'fruits', word: 'Orange', meaning: 'Cam', symbol: '🍊' },
  { id: 'carrot', topic: 'fruits', word: 'Carrot', meaning: 'Cà rốt', symbol: '🥕' },
  { id: 'red', topic: 'colors', word: 'Red', meaning: 'Đỏ', color: '#ef4444', shape: 'circle' },
  { id: 'blue', topic: 'colors', word: 'Blue', meaning: 'Xanh dương', color: '#2563eb', shape: 'circle' },
  { id: 'yellow', topic: 'colors', word: 'Yellow', meaning: 'Vàng', color: '#facc15', shape: 'circle' },
  { id: 'green', topic: 'colors', word: 'Green', meaning: 'Xanh lá', color: '#16a34a', shape: 'circle' },
  { id: 'circle', topic: 'colors', word: 'Circle', meaning: 'Hình tròn', color: '#a855f7', shape: 'circle' },
  { id: 'square', topic: 'colors', word: 'Square', meaning: 'Hình vuông', color: '#a855f7', shape: 'square' },
  { id: 'triangle', topic: 'colors', word: 'Triangle', meaning: 'Hình tam giác', color: '#a855f7', shape: 'triangle' },
];

function shuffle(items, random) {
  const result = [...items];
  for (let i=result.length-1;i>0;i--) {
    const j=Math.floor(random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}
// Cycle through every word before repeating, with visually distinct distractors.
export function createEnglishPicker(random = Math.random) {
  let remaining = [];
  let last = '';
  return () => {
    if (!remaining.length) {
      remaining=shuffle(englishWords,random);
      if (remaining[0].id===last) [remaining[0],remaining[1]]=[remaining[1],remaining[0]];
    }
    const target=remaining.shift();
    last=target.id;
    const pool=englishWords.filter(item=>item.id!==target.id && item.topic===target.topic &&
      (target.topic!=='colors' || (target.color==='#a855f7')===(item.color==='#a855f7')));
    return { target, options: shuffle([target,...shuffle(pool,random).slice(0,2)],random) };
  };
}
