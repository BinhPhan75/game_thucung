import React, { useEffect, useRef, useState } from 'react';
import { GamePicture } from './GamePicture';
import { MAZES, canMove, makeMemoryDeck } from '../data/miniGames';
import { playPopSound, playCelebrationSound, speakVietnamese, stopSpeech } from '../utils/audio';
import { celebrateStars } from '../utils/celebrate';
import { questReward } from '../utils/questReward';
import type { PetState } from '../types/game';
import '../miniGames.css';

type Mode = 'differences' | 'memory' | 'maze';
const MODES: {id: Mode; title: string; icon: string; instruction: string}[] = [
  {id:'differences', title:'Tìm điểm khác biệt', icon:'🔍', instruction:'Bé chạm vào bốn điểm khác nhau ở hai bức tranh nhé!'},
  {id:'memory', title:'Lật thẻ tìm cặp', icon:'🃏', instruction:'Bé lật hai thẻ để tìm hai hình giống nhau nhé!'},
  {id:'maze', title:'Mê cung tìm đường', icon:'🥕', instruction:'Chạm ô bên cạnh để đưa thỏ đến cà rốt. Bé cũng có thể kéo thỏ nhé!'},
];
type Props = {pet:PetState; onUpdatePet:(pet:PetState)=>void; onClose:()=>void; isMuted:boolean; onToggleSound:()=>void};
type GameProps = {onComplete:()=>void; onSuccess:()=>void};

export function MiniGames({pet,onUpdatePet,onClose,isMuted,onToggleSound}:Props) {
  const dialog=useRef<HTMLDialogElement>(null);
  const awarded=useRef(false);
  const [mode,setMode]=useState<Mode|null>(null);
  const [round,setRound]=useState(0);
  const [complete,setComplete]=useState(false);
  const info=MODES.find(item=>item.id===mode);
  useEffect(()=>{
    const node=dialog.current; node?.showModal();
    return ()=>{node?.close();stopSpeech();};
  },[]);
  function start(next:Mode) {
    stopSpeech();awarded.current=false;setComplete(false);setMode(next);setRound(value=>value+1);
    if(!isMuted)speakVietnamese(MODES.find(item=>item.id===next)!.instruction);
  }
  function finish() {
    if(awarded.current)return;
    awarded.current=true;setComplete(true);
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
          {mode==='maze'&&<Maze {...gameProps}/>}
        </div>
      </>}
      {complete&&<div className="mini-celebration" role="dialog" aria-modal="true" aria-label="Hoàn thành trò chơi">
        <div><span className="mini-trophy">🌟</span><h3>Bé làm được rồi!</h3><p>+10 xu · +25 EXP · +1 sao</p><p>Thú cưng được chăm sóc thêm nhé!</p>
          <button autoFocus onClick={()=>start(mode!)}>Chơi tiếp 🎉</button>
          <button onClick={()=>{setMode(null);setComplete(false);}}>Chọn trò chơi khác</button>
        </div>
      </div>}
    </div>
  </dialog>;
}

const SPOTS=[{x:25,y:49,label:'chiếc nơ'},{x:76,y:68,label:'bông hoa'},{x:72,y:22,label:'cánh bướm'},{x:15,y:16,label:'ông mặt trời'}];
function Differences({onComplete,onSuccess}:GameProps) {
  const [found,setFound]=useState<number[]>([]);
  const [miss,setMiss]=useState(false);
  const [theme]=useState(()=>Math.floor(Math.random()*3));
  function choose(index:number) {
    if(found.includes(index))return;
    const next=[...found,index];setFound(next);setMiss(false);onSuccess();
    if(next.length===SPOTS.length)onComplete();
  }
  return <div className="mini-game differences-game">
    <p className="mini-progress" role="status">{miss?'Gần đúng rồi! Bé nhìn kỹ thêm nhé 💛':`⭐ Đã tìm thấy ${found.length}/4 điểm khác biệt`}</p>
    <div className="difference-pair">{[false,true].map((changed,side)=><div key={side} className="difference-scene" onClick={()=>setMiss(true)}>
      <svg viewBox="0 0 100 90" aria-hidden="true">
        <rect width="100" height="90" rx="6" fill={['#c9f1ff','#e1e7ff','#ffe5ed'][theme]}/>
        <path d="M0 58 Q30 39 55 58 Q80 42 100 55V90H0Z" fill="#a3d98d"/>
        <ellipse cx="50" cy="85" rx="55" ry="20" fill="#75bf80"/>
        <g fill="white"><ellipse cx="46" cy="17" rx="12" ry="4"/><circle cx="43" cy="14" r="5"/><circle cx="49" cy="13" r="6"/></g>
        <rect x="83" y="43" width="6" height="26" rx="2" fill="#a77551"/><circle cx="86" cy="37" r="13" fill="#45a96f"/>
        <path d="M40 64V41L56 29 72 41V64Z" fill="#fff2b5" stroke="#c58364" strokeWidth="1"/><path d="M37 42 56 26 75 42" fill="none" stroke="#f18b89" strokeWidth="5" strokeLinejoin="round"/>
        <rect x="53" y="49" width="9" height="15" rx="4" fill="#b6a1e3"/>
        <ellipse cx="25" cy="59" rx="10" ry="14" fill="#fff7ef"/><ellipse cx="25" cy="39" rx="10" ry="11" fill="#fff7ef"/>
        <ellipse cx="20" cy="24" rx="4" ry="11" fill="#fff7ef"/><ellipse cx="30" cy="24" rx="4" ry="11" fill="#fff7ef"/>
        <ellipse cx="20" cy="24" rx="2" ry="8" fill="#f8b4c6"/><ellipse cx="30" cy="24" rx="2" ry="8" fill="#f8b4c6"/>
        <g fill="#495268"><circle cx="21" cy="38" r="1.5"/><circle cx="29" cy="38" r="1.5"/></g><path d="M23 43Q25 46 27 43" fill="none" stroke="#a3737e"/>
        <path d="M18 46 25 49 32 46V53L25 50 18 53Z" fill={changed?'#8b5cf6':'#fb7185'}/>
        <circle cx="15" cy="16" r={changed?5:8} fill="#ffce54"/><path d="M12 17Q15 20 18 17" fill="none" stroke="#a27730"/>
        {!changed&&<g><path d="M76 81V66M76 76Q66 68 70 77" fill="none" stroke="#2e8c54" strokeWidth="2"/><g fill="#ff7bad"><circle cx="73" cy="65" r="4"/><circle cx="79" cy="65" r="4"/><circle cx="76" cy="70" r="4"/></g><circle cx="76" cy="65" r="2" fill="#fff08b"/></g>}
        <g fill={changed?'#ffb646':'#9b83ed'}><ellipse cx="69" cy="21" rx="4" ry="5" transform="rotate(-25 69 21)"/><ellipse cx="75" cy="21" rx="4" ry="5" transform="rotate(25 75 21)"/></g><path d="M72 19V27" stroke="#5b5274" strokeWidth="1.5"/>
      </svg>
      <span className="scene-label">{side===0?'Tranh A':'Tranh B'}</span>
      {SPOTS.map((spot,i)=><button key={i} className={`difference-spot ${found.includes(i)?'found':''}`} style={{left:`${spot.x}%`,top:`${spot.y/90*100}%`}} aria-label={`Kiểm tra ${spot.label} trong tranh ${side===0?'A':'B'}`} aria-pressed={found.includes(i)} onClick={event=>{event.stopPropagation();choose(i);}}>{found.includes(i)?'⭐':''}</button>)}
    </div>)}</div>
  </div>;
}

function Memory({onComplete,onSuccess}:GameProps) {
  const [deck]=useState(makeMemoryDeck);
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
    <p className="mini-progress" role="status">⭐ Đã tìm được {matched.length/2}/4 cặp {open.length===2?'· Bé nhớ hai hình này nhé!':''}</p>
    <div className="memory-grid">{deck.map((card,i)=>{
      const visible=open.includes(card.id)||matched.includes(card.id);
      return <button key={card.id} className={`memory-card ${visible?'flipped':''} ${matched.includes(card.id)?'matched':''}`} aria-label={`Thẻ ${i+1}${matched.includes(card.id)?', đã ghép đôi':visible?', đã lật':''}`} aria-pressed={visible} disabled={matched.includes(card.id)||open.length===2} onClick={()=>flip(card.id)}>
        <span className="memory-flipper"><span className="memory-back" aria-hidden="true">✦<small>{i+1}</small></span><span className="memory-front" aria-hidden="true"><GamePicture symbol={card.symbol}/></span></span>
      </button>;
    })}</div>
  </div>;
}

function Maze({onComplete,onSuccess}:GameProps) {
  const [maze]=useState(()=>MAZES[Math.floor(Math.random()*MAZES.length)]);
  const [position,setPosition]=useState(0);
  const positionRef=useRef(0);
  const [visited,setVisited]=useState([0]);
  const [message,setMessage]=useState('Bông Bông đang tìm cà rốt!');
  const dragging=useRef(false);
  function move(cell:number) {
    if(positionRef.current===24||cell===positionRef.current)return;
    if(!canMove(maze,positionRef.current,cell)){setMessage('Bé chọn ô đường ngay bên cạnh thỏ nhé!');return;}
    positionRef.current=cell;setPosition(cell);setVisited(previous=>previous.includes(cell)?previous:[...previous,cell]);
    setMessage('Đúng đường rồi! Đi tiếp nào 🥕');onSuccess();if(cell===24)onComplete();
  }
  return <div className="mini-game maze-game"><p className="mini-progress" role="status">{message}</p>
    <div className="maze-board" onPointerDown={event=>{dragging.current=true;const cell=(event.target as HTMLElement).closest<HTMLElement>('[data-maze-cell]');if(cell)move(Number(cell.dataset.mazeCell));event.currentTarget.setPointerCapture(event.pointerId);}}
      onPointerUp={()=>{dragging.current=false;}} onPointerCancel={()=>{dragging.current=false;}}
      onPointerMove={event=>{if(!dragging.current)return;const node=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-maze-cell]');if(node&&event.currentTarget.contains(node))move(Number(node.dataset.mazeCell));}}>
      {maze.flatMap((row,y)=>[...row].map((cell,x)=>{const id=y*5+x;return <button key={id} data-maze-cell={id} className={`maze-cell ${cell==='#'?'hedge':''} ${visited.includes(id)?'visited':''}`} disabled={cell==='#'} aria-label={`Ô đường hàng ${y+1}, cột ${x+1}${id===24?', cà rốt':''}${id===position?', thỏ đang ở đây':''}`} onClick={()=>move(id)}>{id===24?<GamePicture symbol="🥕"/>:cell==='#'?<span aria-hidden="true">✿</span>:visited.includes(id)?<span aria-hidden="true">·</span>:null}</button>;}))}
      <div className="maze-bunny" aria-hidden="true" style={{left:`${position%5*20}%`,top:`${Math.floor(position/5)*20}%`}}><GamePicture symbol="🐰"/></div>
    </div>
  </div>;
}
