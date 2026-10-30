import React, { useEffect, useRef, useState } from 'react';
import { GamePicture, pictureUrl } from './GamePicture';
import { MAZES, MAZE_NAMES, MEMORY_THEMES, DIFFERENCE_THEMES, pickDifferenceScene, canMove, makeMemoryDeck } from '../data/miniGames';
import { playPopSound, playCelebrationSound, speakVietnamese, stopSpeech } from '../utils/audio';
import { celebrateStars } from '../utils/celebrate';
import { questReward } from '../utils/questReward';
import type { PetState } from '../types/game';
import '../miniGames.css';

type Mode = 'differences' | 'memory' | 'maze';
const MODES: {id: Mode; title: string; icon: string; instruction: string}[] = [
  {id:'differences', title:'Tìm điểm khác biệt', icon:'🔍', instruction:'Bé chạm vào bốn điểm khác nhau ở hai bức tranh nhé!'},
  {id:'memory', title:'Lật thẻ tìm cặp', icon:'🃏', instruction:'Bé lật hai thẻ để tìm hai hình giống nhau nhé!'},
  {id:'maze', title:'Mê cung tìm đường', icon:'🥕', instruction:'Đưa thỏ về nhà, nhặt cà rốt trên đường. Chạm ô bên cạnh hoặc kéo thỏ nhé!'},
];
type Props = {pet:PetState; onUpdatePet:(pet:PetState)=>void; onClose:()=>void; isMuted:boolean; onToggleSound:()=>void};
type GameProps = {onComplete:()=>void; onSuccess:()=>void};

export function MiniGames({pet,onUpdatePet,onClose,isMuted,onToggleSound}:Props) {
  const dialog=useRef<HTMLDialogElement>(null);
  const awarded=useRef(false);
  const [mode,setMode]=useState<Mode|null>(null);
  const [round,setRound]=useState(0);
  const [mazeLevel,setMazeLevel]=useState(0);
  const nextMaze=useRef(0);
  const [complete,setComplete]=useState(false);
  const info=MODES.find(item=>item.id===mode);
  useEffect(()=>{
    const node=dialog.current; node?.showModal();
    return ()=>{node?.close();stopSpeech();};
  },[]);
  function start(next:Mode) {
    if(next==='maze')setMazeLevel(nextMaze.current);
    stopSpeech();awarded.current=false;setComplete(false);setMode(next);setRound(value=>value+1);
    if(!isMuted)speakVietnamese(MODES.find(item=>item.id===next)!.instruction);
  }
  function finish() {
    if(awarded.current)return;
    awarded.current=true;setComplete(true);
    if(mode==='maze')nextMaze.current=(mazeLevel+1)%MAZES.length;
    onUpdatePet(questReward(pet,pet.hunger<=pet.thirst?'food':'water'));
    celebrateStars(dialog.current);
    if(!isMuted){playCelebrationSound();speakVietnamese('Hoan hô! Bé đã hoàn thành rồi! Bé giỏi quá!');}
  }
  const gameProps={onComplete:finish,onSuccess:()=>{if(!isMuted)playPopSound();}};
  return <dialog ref={dialog} className="mini-dialog" aria-label="Trò chơi vui" onCancel={onClose}>
    <div className="mini-shell">
      <header className="mini-header">
        {mode&&<button aria-label="Về danh sách trò chơi" onClick={()=>{stopSpeech();setMode(null);setComplete(false);}}>‹</button>}
        <h2>{info?.title||'🌈 Trò chơi vui'}</h2>
        <button aria-label={isMuted?'Bật âm thanh':'Tắt âm thanh'} onClick={onToggleSound}>{isMuted?'🔇':'🔊'}</button>
        <button aria-label="Đóng trò chơi" onClick={onClose}>×</button>
      </header>
      {!mode ? <div className="mini-menu">{MODES.map(item=><button key={item.id} onClick={()=>start(item.id)}><span>{item.icon}</span><strong>{item.title}</strong><small>Chạm để chơi →</small></button>)}</div> : <>
        <p className="mini-instruction">{info!.instruction}</p>
        <div className="mini-play" key={`${mode}-${round}`} inert={complete}>
          {mode==='differences'&&<Differences {...gameProps}/>}
          {mode==='memory'&&<Memory {...gameProps}/>}
          {mode==='maze'&&<Maze {...gameProps} level={mazeLevel}/>}
        </div>
      </>}
      {complete&&<div className="mini-celebration" role="dialog" aria-modal="true" aria-label="Hoàn thành trò chơi">
        <div><span className="mini-trophy">🌟</span><h3>Bé làm được rồi!</h3><p>+10 xu · +25 EXP · +1 sao</p><p>Thú cưng được chăm sóc thêm nhé!</p>
          <button autoFocus onClick={()=>start(mode!)}>{mode==='maze'?'Mê cung tiếp theo 🥕':'Chơi tiếp 🎉'}</button>
          <button onClick={()=>{setMode(null);setComplete(false);}}>Chọn trò chơi khác</button>
        </div>
      </div>}
    </div>
  </dialog>;
}

const SPOTS=[{x:25,y:49,label:'bạn nhỏ'},{x:76,y:68,label:'đồ vật bên dưới'},{x:72,y:22,label:'bạn ở trên cao'},{x:15,y:16,label:'ông mặt trời'}];
function Differences({onComplete,onSuccess}:GameProps) {
  const [found,setFound]=useState<number[]>([]);
  const [miss,setMiss]=useState(false);
  const [theme]=useState(pickDifferenceScene);
  function choose(index:number) {
    if(found.includes(index))return;
    const next=[...found,index];setFound(next);setMiss(false);onSuccess();
    if(next.length===SPOTS.length)onComplete();
  }
  return <div className="mini-game differences-game">
    <p className="mini-progress" role="status">{miss?'Gần đúng rồi! Bé nhìn kỹ thêm nhé 💛':`⭐ Đã tìm thấy ${found.length}/4 điểm khác biệt`}</p>
    <div className="difference-pair">{[false,true].map((changed,side)=><div key={side} className="difference-scene" onClick={()=>setMiss(true)}>
      <DifferenceArt theme={theme} changed={changed}/>
      <span className="scene-label">{side===0?'Tranh A':'Tranh B'} · {DIFFERENCE_THEMES[theme].name}</span>
      {SPOTS.map((spot,i)=><button key={i} className={`difference-spot ${found.includes(i)?'found':''}`} style={{left:`${spot.x}%`,top:`${spot.y/90*100}%`}} aria-label={`Kiểm tra ${spot.label} trong tranh ${side===0?'A':'B'}`} aria-pressed={found.includes(i)} onClick={event=>{event.stopPropagation();choose(i);}}>{found.includes(i)?'⭐':''}</button>)}
    </div>)}</div>
  </div>;
}

function Memory({onComplete,onSuccess}:GameProps) {
  const [theme]=useState(()=>MEMORY_THEMES[Math.floor(Math.random()*MEMORY_THEMES.length)]);
  const [deck]=useState(()=>makeMemoryDeck(theme));
  const [open,setOpen]=useState<number[]>([]);
  const [matched,setMatched]=useState<number[]>([]);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  function flip(id:number) {
    if(open.length===2||open.includes(id)||matched.includes(id))return;
    onSuccess();const next=[...open,id];setOpen(next);
    if(next.length!==2)return;
    if(deck.find(c=>c.id===next[0])!.symbol===deck.find(c=>c.id===id)!.symbol){
      const pairs=[...matched,...next];setMatched(pairs);setOpen([]);
      if(pairs.length===deck.length)onComplete();
    } else timer.current=setTimeout(()=>{setOpen([]);timer.current=null;},1000);
  }
  return <div className="mini-game memory-game">
    <p className="mini-progress" role="status">{theme.name} · ⭐ {matched.length/2}/4 cặp {open.length===2?'· Bé nhớ hai hình này nhé!':''}</p>
    <div className="memory-grid">{deck.map((card,i)=>{
      const visible=open.includes(card.id)||matched.includes(card.id);
      return <button key={card.id} className={`memory-card ${visible?'flipped':''} ${matched.includes(card.id)?'matched':''}`} aria-label={`Thẻ ${i+1}${matched.includes(card.id)?', đã ghép đôi':visible?', đã lật':''}`} aria-pressed={visible} disabled={matched.includes(card.id)||open.length===2} onClick={()=>flip(card.id)}>
        <span className="memory-flipper"><span className="memory-back" aria-hidden="true">✦<small>{i+1}</small></span><span className="memory-front" aria-hidden="true"><GamePicture symbol={card.symbol}/></span></span>
      </button>;
    })}</div>
  </div>;
}

function Maze({onComplete,onSuccess,level}:GameProps & {level:number}) {
  const maze=MAZES[level];
  const n=maze.length, goal=n*n-1;
  const [carrots,setCarrots]=useState<number[]>([]);
  const treats=maze.flatMap((row,y)=>[...row].flatMap((cell,x)=>cell!=='#'&&(x+y)%4===2?[y*n+x]:[])).slice(0,3);
  const [position,setPosition]=useState(0);
  const positionRef=useRef(0);
  const [visited,setVisited]=useState([0]);
  const [message,setMessage]=useState('Bông Bông muốn về nhà!');
  const dragging=useRef(false);
  function move(cell:number) {
    if(positionRef.current===goal||cell===positionRef.current)return;
    if(!canMove(maze,positionRef.current,cell)){setMessage('Bé chọn ô đường ngay bên cạnh thỏ nhé!');return;}
    positionRef.current=cell;setPosition(cell);setVisited(previous=>previous.includes(cell)?previous:[...previous,cell]);
    if(treats.includes(cell)&&!carrots.includes(cell)){setCarrots(previous=>[...previous,cell]);setMessage('Nhặt được cà rốt rồi! Giỏi quá! 🥕');}else setMessage('Đúng đường rồi! Đi tiếp nào 🥕');onSuccess();if(cell===goal)onComplete();
  }
  return <div className="mini-game maze-game"><p className="mini-progress" role="status">Chặng {level+1}/5 · {MAZE_NAMES[level]} · 🥕 {carrots.length}/{treats.length}<br/>{message}</p>
    <div className="maze-board" style={{gridTemplateColumns:`repeat(${n},1fr)`,gridTemplateRows:`repeat(${n},1fr)`}} onPointerDown={event=>{dragging.current=true;const cell=(event.target as HTMLElement).closest<HTMLElement>('[data-maze-cell]');if(cell)move(Number(cell.dataset.mazeCell));event.currentTarget.setPointerCapture(event.pointerId);}}
      onPointerUp={()=>{dragging.current=false;}} onPointerCancel={()=>{dragging.current=false;}}
      onPointerMove={event=>{if(!dragging.current)return;const node=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-maze-cell]');if(node&&event.currentTarget.contains(node))move(Number(node.dataset.mazeCell));}}>
      {maze.flatMap((row,y)=>[...row].map((cell,x)=>{const id=y*n+x;return <button key={id} data-maze-cell={id} className={`maze-cell ${cell==='#'?'hedge':''} ${visited.includes(id)?'visited':''}`} disabled={cell==='#'} aria-label={`Ô đường hàng ${y+1}, cột ${x+1}${id===goal?', ngôi nhà':''}${id===position?', thỏ đang ở đây':''}`} onClick={()=>move(id)}>{id===goal?<GamePicture symbol="🏡"/>:treats.includes(id)&&!carrots.includes(id)?<GamePicture symbol="🥕"/>:cell==='#'?<span aria-hidden="true">✿</span>:visited.includes(id)?<span aria-hidden="true">·</span>:null}</button>;}))}
      <div className="maze-bunny" aria-hidden="true" style={{width:`${100/n}%`,height:`${100/n}%`,left:`${position%n*100/n}%`,top:`${Math.floor(position/n)*100/n}%`}}><GamePicture symbol="🐰"/></div>
    </div>
  </div>;
}

function DifferenceArt({theme,changed}:{theme:number;changed:boolean}) {
 const scene=DIFFERENCE_THEMES[theme];
 const art=(symbol:string,x:number,y:number,size:number)=> <image href={pictureUrl(symbol)} x={x} y={y} width={size} height={size}/>;
 return <svg viewBox="0 0 100 90" aria-hidden="true">
  <rect width="100" height="90" rx="6" fill={scene.sky}/>
  {theme===2?<g fill="none" stroke="#ffffff80"><circle cx="43" cy="17" r="5"/><circle cx="54" cy="29" r="3"/><path d="M0 36q10-5 20 0t20 0t20 0t20 0t20 0"/></g>:<g fill="white"><ellipse cx="46" cy="17" rx="14" ry="5"/><circle cx="43" cy="13" r="6"/><circle cx="52" cy="13" r="5"/></g>}
  <path d="M0 65Q25 48 50 64T100 60V90H0Z" fill={scene.ground}/>
  {theme===0&&<g fill="#fff9e3" stroke="#bc9876" strokeWidth=".7">{[2,9,16,23,30,37,44,51,58,65,72,79,86,93].map(x=><rect key={x} x={x} y="58" width="3" height="15" rx="1"/>)}<path d="M0 62H100M0 69H100"/></g>}
  {theme===1&&<>{art('🌳',-5,22,42)}{art('🌳',70,27,35)}</>}
  {theme===3&&<g stroke="#a58bd2" strokeWidth="2" fill="none"><path d="M5 70 12 34 35 34 42 70M20 35V57H29V35"/></g>}
  {theme===4&&<>{art('🌸',3,62,18)}{art('🌻',43,69,17)}{art('🌸',83,61,19)}</>}
  {art(scene.home,43,34,34)}
  <circle cx="15" cy="16" r={changed?5:8} fill="#ffd365"/><path d="M12 17q3 4 6 0" stroke="#a97b39" fill="none"/>
  <ellipse cx="25" cy="65" rx="15" ry="3" fill="#446c6720"/>
  <g transform={changed?'translate(50 0) scale(-1 1)':undefined}>{art(scene.friend,10,32,30)}</g>
  <path d="M19 55 25 58 31 55V62L25 59 19 62Z" fill={changed?'#9b59e0':'#f26a99'}/>
  {!changed&&art(scene.plant,66,58,20)}
  {art(scene.fly,changed?64:62,changed?12:10,changed?16:22)}
  <g fill="#ffffff90"><circle cx="5" cy="82" r="1"/><circle cx="57" cy="76" r="1.5"/><circle cx="94" cy="52" r="1"/></g>
 </svg>;
}
