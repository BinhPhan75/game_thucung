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

export const MAZES=[carve(7,12),carve(7,73),carve(9,26),carve(11,91),carve(11,43),carve(13,62),carve(13,84),carve(15,33),carve(17,51),carve(19,96)];
export const MAZE_NAMES=['Vườn cà rốt','Đồng cỏ vui','Bờ suối nhỏ','Rừng bí mật','Đồi hoa','Vườn cổ tích','Đảo bướm','Thung lũng sao','Rừng cầu vồng','Lâu đài Bông Bông'];
export function mazeRoute(maze:string[], start=0, goal=maze.length**2-1):number[] {
 const n=maze.length, queue=[start], parents=new Map<number,number>([[start,-1]]);
 for(let i=0;i<queue.length;i++) {
  const at=queue[i];if(at===goal){const path=[];for(let p=goal;p!==-1;p=parents.get(p)!)path.unshift(p);return path;}
  for(const next of [at-1,at+1,at-n,at+n])if(canMove(maze,at,next)&&!parents.has(next)){parents.set(next,at);queue.push(next);}
 }
 return [];
}
export const MAZE_LEVELS=MAZES.map((maze,index)=>{
 const route=mazeRoute(maze), count=[1,2,2,3,3,3,3,4,5,5][index];
 const carrots=Array.from({length:count},(_,i)=>route[Math.floor((i+1)*(route.length-1)/(count+1))]);
 const traps=index<7?[]:maze.flatMap((row,y)=>[...row].flatMap((cell,x)=>{
  const id=y*maze.length+x;
  return cell!== '#'&&!route.includes(id)&&[id-1,id+1,id-maze.length,id+maze.length].filter(to=>canMove(maze,id,to)).length===1?[id]:[];
 })).slice(0,2);
 return {maze,carrots,traps,required:index>=7,name:MAZE_NAMES[index]};
});
// Follow skipped pointer samples only in a straight corridor, never through walls.
export function traceMazeMove(maze:string[],from:number,to:number):number[] {
 const n=maze.length;if(from===to)return [];
 if(Math.floor(from/n)!==Math.floor(to/n)&&from%n!==to%n)return [];
 const step=Math.floor(from/n)===Math.floor(to/n)?Math.sign(to-from):Math.sign(to-from)*n;
 const path:number[]=[];for(let at=from;at!==to;){const next=at+step;if(!canMove(maze,at,next))break;path.push(next);at=next;}return path;
}
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
