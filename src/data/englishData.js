// Separate preschool English vocabulary and practice bank.
export const englishTopics = [
  { id: 'animals', label: 'Động vật', english: 'Animals' },
  { id: 'fruits', label: 'Trái cây & Nông sản', english: 'Fruits & Crops' },
  { id: 'colors', label: 'Màu sắc & Hình khối', english: 'Colors & Shapes' },
  { id: 'numbers', label: 'Số đếm 1–10', english: 'Numbers' },
  { id: 'alphabet', label: 'Bảng chữ cái A–Z', english: 'Alphabet' },
];

const numberNames = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'];
const numberMeanings = ['Một','Hai','Ba','Bốn','Năm','Sáu','Bảy','Tám','Chín','Mười'];

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
  ...numberNames.map((word,index)=>({ id: `number-${index+1}`, topic: 'numbers', word,
    meaning: numberMeanings[index], count: index+1 })),
  ...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ',letter=>({ id: `letter-${letter}`, topic: 'alphabet',
    word: letter, meaning: `Chữ ${letter} · ${letter.toLowerCase()}`, letter })),
];

export function englishPronunciation(word) {
  // A sentence makes the TTS read the letter name, rather than the article “a”.
  return word.topic==='alphabet' ? `The letter ${word.word}.` : word.word;
}

function shuffle(items, random) {
  const result = [...items];
  for (let i=result.length-1;i>0;i--) {
    const j=Math.floor(random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}
// Cycle through every word before repeating, with visually distinct distractors.
export function createEnglishPicker(random = Math.random, topic = 'all') {
  const vocabulary=englishWords.filter(word=>topic==='all' || word.topic===topic);
  if (vocabulary.length<3) throw new Error('English practice requires at least three words');
  let remaining = [];
  let last = '';
  return () => {
    if (!remaining.length) {
      remaining=shuffle(vocabulary,random);
      if (remaining[0].id===last) [remaining[0],remaining[1]]=[remaining[1],remaining[0]];
    }
    const target=remaining.shift();
    last=target.id;
    const pool=englishWords.filter(item=>item.id!==target.id && item.topic===target.topic &&
      (target.topic!=='colors' || (target.color==='#a855f7')===(item.color==='#a855f7')));
    return { target, options: shuffle([target,...shuffle(pool,random).slice(0,2)],random) };
  };
}
