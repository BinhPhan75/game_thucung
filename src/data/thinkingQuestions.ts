import type { BankEntry } from './questionBank';

export type SortItem = { id: string; label: string; group: string; symbol?: string; color?: string; size?: 'big'|'small' };
export type ThinkingActivity =
  | { kind: 'connect'; name: string; points: [number,number][]; color: string }
  | { kind: 'puzzle'; name: string; symbol: string; rows: number; columns: number }
  | { kind: 'sort'; groups: {id:string;label:string}[]; items: SortItem[] };

const outlines: {name:string; points:[number,number][]; color:string}[] = [
  {name:'ngôi sao',color:'#facc15',points:[[50,8],[60,35],[88,35],[66,53],[75,82],[50,65],[25,82],[34,53],[12,35],[40,35]]},
  {name:'ngôi nhà',color:'#f9a8d4',points:[[15,45],[32,29],[50,12],[68,29],[85,45],[85,65],[85,85],[50,85],[15,85],[15,65]]},
  {name:'chú cá',color:'#7dd3fc',points:[[15,50],[30,30],[52,22],[73,35],[90,20],[90,80],[73,65],[52,78],[30,70],[20,60]]},
  {name:'chiếc thuyền',color:'#a5b4fc',points:[[10,60],[35,60],[35,10],[70,42],[48,42],[52,60],[90,60],[75,85],[35,85],[17,75]]},
];
const activities: {question:string; activity:ThinkingActivity}[] = outlines.map(outline=>({
  question:`Bé nối các số từ 1 đến 10 để vẽ ${outline.name} nhé!`,activity:{kind:'connect',...outline},
}));
export const PUZZLE_PICTURES = [
  ['chú mèo','🐱'], ['bông hoa','🌸'], ['chú thỏ','🐰'], ['chú cún','🐶'],
  ['gà con','🐥'], ['ô tô','🚗'], ['ngôi nhà','🏡'], ['cây xanh','🌳'],
  ['gấu bông','🧸'], ['chú cá','🐟'],
] as const;
for (const [rows,columns] of [[2,2],[2,3],[3,3],[3,4]]) {
  for (const [name,symbol] of PUZZLE_PICTURES) activities.push({
    question:`Bé ghép ${rows*columns} mảnh thành tranh ${name} nhé!`,activity:{kind:'puzzle',name,symbol,rows,columns},
  });
}
activities.push({question:'Bé đưa con vật vào nhóm sống trên cạn hoặc sống dưới nước nhé!',activity:{kind:'sort',
  groups:[{id:'land',label:'Trên cạn'},{id:'water',label:'Dưới nước'}],items:[
    {id:'cat',label:'Mèo',symbol:'🐱',group:'land'},{id:'fish',label:'Cá',symbol:'🐟',group:'water'},
    {id:'dog',label:'Chó',symbol:'🐶',group:'land'},{id:'whale',label:'Cá voi',symbol:'🐳',group:'water'},
    {id:'rabbit',label:'Thỏ',symbol:'🐰',group:'land'},{id:'octopus',label:'Bạch tuộc',symbol:'🐙',group:'water'},
  ]}});
activities.push({question:'Bé xếp các quả bóng vào nhóm cùng màu nhé!',activity:{kind:'sort',
  groups:[{id:'red',label:'Màu đỏ'},{id:'blue',label:'Màu xanh dương'},{id:'yellow',label:'Màu vàng'}],
  items:['red','blue','yellow','blue','red','yellow'].map((group,i)=>({id:`ball-${i}`,label:`Bóng ${group==='red'?'đỏ':group==='blue'?'xanh dương':'vàng'}`,group,color:{red:'#ef4444',blue:'#2563eb',yellow:'#facc15'}[group]})),
}});
activities.push({question:'Bé xếp đồ vật vào nhóm to hoặc nhỏ nhé!',activity:{kind:'sort',
  groups:[{id:'big',label:'To'},{id:'small',label:'Nhỏ'}],
  items: (['big','small','small','big','big','small'] as const).map((size,i)=>({id:`size-${i}`,label:`${['Táo','Táo','Thỏ','Thỏ','Hoa','Hoa'][i]} ${size==='big'?'to':'nhỏ'}`,group:size,size,symbol:['🍎','🍎','🐰','🐰','🌸','🌸'][i]})),
}});
activities.push({question:'Bé phân loại con vật, trái cây và đồ dùng nhé!',activity:{kind:'sort',
  groups:[{id:'animal',label:'Con vật'},{id:'fruit',label:'Trái cây'},{id:'object',label:'Đồ dùng'}],items:[
    {id:'rabbit',label:'Thỏ',symbol:'🐰',group:'animal'},{id:'apple',label:'Táo',symbol:'🍎',group:'fruit'},
    {id:'umbrella',label:'Ô',symbol:'☂️',group:'object'},{id:'cat',label:'Mèo',symbol:'🐱',group:'animal'},
    {id:'banana',label:'Chuối',symbol:'🍌',group:'fruit'},{id:'pencil',label:'Bút chì',symbol:'✏️',group:'object'},
  ]}});

export const THINKING_QUESTIONS: BankEntry[] = activities.map(({question,activity},i)=>({
  id:`thinking-${i+1}`,category:{connect:'T16',puzzle:'T17',sort:'T18'}[activity.kind],difficulty:1,
  question,options:[],correctAnswer:'complete',explanation:'Bé đã hoàn thành thử thách!',
  visual:{type:'interactive',activity},
}));

export function shuffledPieces(count:number,random:()=>number=Math.random) {
  const order=Array.from({length:count},(_,i)=>i);
  for(let i=count-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  if(order.every((value,i)=>value===i)) order.push(order.shift()!);
  return order;
}

// Exhaust the picture bag before repeating; also avoid repeats at cycle boundaries.
export function createPuzzlePicker(random:()=>number=Math.random) {
  let remaining:string[]=[];
  let last='';
  return ()=>{
    if(!remaining.length) remaining=shuffledPieces(PUZZLE_PICTURES.length,random).map(i=>PUZZLE_PICTURES[i][1]);
    const index=Math.max(0,remaining.findIndex(symbol=>symbol!==last));
    last=remaining.splice(index,1)[0];
    const choices=THINKING_QUESTIONS.filter(entry=>entry.visual.activity?.kind==='puzzle' && entry.visual.activity.symbol===last);
    return choices[Math.floor(random()*choices.length)];
  };
}
export const pickPuzzleQuestion=createPuzzlePicker();
