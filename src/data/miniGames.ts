export function shuffle<T>(values: readonly T[], random = Math.random): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}


export const MEMORY_THEMES = [
 {name:'Bạn thú đáng yêu',symbols:['🐰','🐶','🐥','🐱','🐟','🧸']},
 {name:'Giỏ trái cây',symbols:['🍎','🍌','🍓','🍉','🍇','🍊']},
 {name:'Xe cộ vui nhộn',symbols:['🚗','🚌','🚂','✈️','⛵']},
];
export const MEMORY_PICTURES=MEMORY_THEMES.flatMap(theme=>theme.symbols);
export function makeMemoryDeck(theme=MEMORY_THEMES[Math.floor(Math.random()*MEMORY_THEMES.length)]) {
 return shuffle(shuffle(theme.symbols).slice(0,4).flatMap((symbol,pair)=>[{id:pair*2,symbol},{id:pair*2+1,symbol}]));
}
// Seeded depth-first carving produces connected paths, branches and dead ends.
function carve(size:number, seed:number) {
 const cells=Array.from({length:size},()=>Array<string>(size).fill('#'));
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const visit=(x:number,y:number)=>{
  cells[y][x]='.';
  for(const [dx,dy] of shuffle([[2,0],[-2,0],[0,2],[0,-2]],random)) {
   const nx=x+dx,ny=y+dy;
   if(nx>=0&&ny>=0&&nx<size&&ny<size&&cells[ny][nx]==='#') {cells[y+dy/2][x+dx/2]='.';visit(nx,ny);}
  }
 };
 visit(0,0);return cells.map(row=>row.join(''));
}
export const MAZES=[carve(5,12),carve(5,73),carve(7,26),carve(7,91),carve(9,43)];
export const MAZE_NAMES=['Vườn cà rốt','Đồng cỏ vui','Rừng bí mật','Vườn cổ tích','Lâu đài cầu vồng'];
export const DIFFERENCE_THEMES=[
 {name:'Nông trại',sky:'#cdefff',ground:'#a6dc91',friend:'🐥',plant:'🌸',fly:'🦋',home:'🏡'},
 {name:'Khu rừng',sky:'#d7f5dc',ground:'#83c99b',friend:'🐰',plant:'🌸',fly:'🦋',home:'🌳'},
 {name:'Đại dương',sky:'#bceeff',ground:'#f5dca8',friend:'🐟',plant:'🌱',fly:'🐙',home:'🐳'},
 {name:'Sân chơi',sky:'#ffdfeb',ground:'#a6dcd4',friend:'🧸',plant:'⚽',fly:'🎈',home:'🚗'},
 {name:'Vườn hoa',sky:'#e8ddff',ground:'#c2e394',friend:'🐶',plant:'🌻',fly:'🐥',home:'🌳'},
];
export function createScenePicker(random=Math.random) {
 let bag:number[]=[];let last=-1;
 return ()=>{if(!bag.length)bag=shuffle(DIFFERENCE_THEMES.map((_,i)=>i),random);let index=bag.findIndex(i=>i!==last);if(index<0)index=0;last=bag.splice(index,1)[0];return last;};
}
export const pickDifferenceScene=createScenePicker();
export function canMove(maze: string[], from: number, to: number) {
  const n = maze.length;
  return to >= 0 && to < n * n && maze[Math.floor(to / n)][to % n] !== '#'
    && Math.abs(Math.floor(from / n) - Math.floor(to / n)) + Math.abs(from % n - to % n) === 1;
}
