import React, { useEffect, useState } from 'react';
import type { BankEntry } from '../data/questionBank';
import type { Question } from '../data/mathQuestions';
import { GamePicture, pictureUrl } from './GamePicture';

const pictures: Record<string, string> = {
  'quả lê':'🍐','quả dâu':'🍓','quả dứa':'🍍','con rùa':'🐢','con bướm':'🦋',
  'con ong':'🐝','con ốc sên':'🐌','con cừu':'🐑','bắp ngô':'🌽','quả nho':'🍇',
  'Bò':'🐮','Bướm':'🦋','Ốc sên':'🐌','Rùa':'🐢','Ong':'🐝','Voi':'🐘',
  'Cừu':'🐑','Hươu cao cổ':'🦒','Cam':'🍊','Chuối':'🍌','Dâu':'🍓','Cà rốt':'🥕','Nho':'🍇','Xe':'🚗',
  'quả táo':'🍎','quả cam':'🍊','quả chuối':'🍌','con thỏ':'🐰','con vịt':'🦆','con cá':'🐟',
  'bông hoa':'🌸','chiếc lá':'🍃','củ cà rốt':'🥕','quả bóng':'⚽','chiếc ô':'☂️','chiếc xe':'🚗',
  'voi':'🐘','chuột':'🐭','hươu cao cổ':'🦒','thỏ':'🐰','cây cao':'🌳','cây thấp':'🌳',
  'quả bóng lớn':'⚽','quả bóng nhỏ':'⚽','Sáng':'☀️','Tối':'🌙','Ô':'☂️','Nước':'💧',
  'Cá':'🐟','Đồng hồ':'🕒','Cốc':'🥛','Áo mưa':'🧥',
  'Mèo':'🐱','Gà':'🐔','Bánh':'🍰','Bóng':'⚽','Bút':'✏️','Chiếc thìa':'🥄',
  'Đồ chơi':'🧸','Đôi dép':'🩴','Gối':'🛏️','Kính bơi':'🥽','Mũ':'🧢','Quạt':'🪭',
  'Dừng lại':'🛑','Chạy nhanh':'🏃','Nhảy lên':'🦘','Không biết':'❓',
};
const colors: Record<string,string> = {'đỏ':'#ef4444','xanh dương':'#2563eb','vàng':'#facc15','xanh lá':'#16a34a','tím':'#9333ea','hồng':'#f472b6','cam':'#f97316'};
const emoji = (name: string) => pictures[name] ?? name;

function ColoredObject({ name, color }: { name: string; color: string }) {
  return <svg viewBox="0 0 100 100" className="bank-object" aria-hidden="true"><g fill={colors[color] ?? '#ef4444'} stroke="#334155" strokeWidth="2">
    {name === 'quả bóng' && <circle cx="50" cy="50" r="36" />}
    {name === 'bông hoa' && <><path d="M50 42V96" fill="none" stroke="#16a34a" strokeWidth="6"/><path d="M48 88Q17 87 17 65Q42 65 48 88ZM52 80Q81 79 84 58Q59 59 52 80Z" fill="#22c55e" stroke="#15803d"/>{[0,60,120,180,240,300].map(angle=><ellipse key={angle} cx="50" cy="18" rx="11" ry="15" transform={`rotate(${angle} 50 33)`}/>)}<circle cx="50" cy="33" r="10" fill="#fff7ed"/></>}
    {name === 'chiếc ô' && <><path d="M12 50A38 38 0 0 1 88 50Z"/><path d="M50 50V83Q50 99 35 86" fill="none" strokeWidth="5"/></>}
    {name === 'chiếc xe' && <><path d="M10 45H24L36 24H64L78 45H90V73H10Z"/><circle cx="28" cy="75" r="12" fill="#334155"/><circle cx="73" cy="75" r="12" fill="#334155"/><path d="M40 30H60L69 45H31Z" fill="#e0f2fe"/></>}
    {name === 'con cá' && <><ellipse cx="43" cy="50" rx="30" ry="23"/><path d="M70 50 94 26V74Z"/><circle cx="28" cy="44" r="4" fill="#fff"/></>}
  </g></svg>;
}
function ShapePicture({ name }: { name: string }) {
  return <svg viewBox="0 0 100 100" className="bank-object" aria-hidden="true"><g fill="#8b5cf6" stroke="#5b21b6" strokeWidth="2">
    {name === 'hình tròn' && <circle cx="50" cy="50" r="36"/>}
    {name === 'hình vuông' && <rect x="15" y="15" width="70" height="70"/>}
    {name === 'hình tam giác' && <path d="M50 10 92 88H8Z"/>}
    {name === 'hình chữ nhật' && <rect x="5" y="28" width="90" height="44"/>}
    {name === 'hình ngôi sao' && <path d="M50 5 61 35 94 35 68 56 78 90 50 70 22 90 32 56 6 35 39 35Z"/>}
  </g></svg>;
}
function Items({ name, count, removed = 0 }: { name: string; count: number; removed?: number }) {
  return <div className="bank-items">{Array.from({length:count},(_,i)=><span key={i} className={i >= count-removed ? 'bank-removed' : ''}><GamePicture symbol={emoji(name)}/></span>)}</div>;
}
function PositionScene({ visual }: { visual: BankEntry['visual'] }) {
  const points: Record<string,number[]> = {'trên':[180,35],'dưới':[180,205],'trái':[65,115],'phải':[295,115],'trong':[180,115],'trước':[180,153],'sau':[180,80],'gần':[255,125],'xa':[330,125]};
  const [x,y]=points[visual.position!] ?? [180,115];
  return <svg viewBox="0 0 360 240" className="bank-position" aria-label="Đồ vật và chiếc hộp">
    <path d="M30 200H330" stroke="#cbd5e1" strokeWidth="2"/>
    <path d="M125 80 145 62H215L235 80V170H125Z" fill="#fcd34d" stroke="#92400e" strokeWidth="3"/>
    <rect x="132" y="84" width="96" height="79" fill="#92400e"/>
    {visual.position === 'trong' && <image href={pictureUrl(emoji(visual.object!))} x={x-24} y={y-24} width="48" height="48"/>}
    <path d="M125 133H235V170H125Z" fill="#d97706" stroke="#92400e" strokeWidth="3"/>
    {visual.position !== 'trong' && <image href={pictureUrl(emoji(visual.object!))} x={x-24} y={y-24} width="48" height="48"/>}
  </svg>;
}
function SizeScene({ items }: { items: string[] }) {
  return <div className="bank-size">{items.map(name=><div key={name}>
    {name.startsWith('dây') ? <svg viewBox="0 0 120 80"><path d={name === 'dây dài' ? 'M5 40Q30 10 60 40T115 40' : 'M40 40Q60 20 80 40'} stroke="#f97316" strokeWidth="7" fill="none"/></svg> : <span style={{fontSize: /nhỏ|thấp|chuột|^thỏ$/.test(name) ? '32px' : '70px'}}><GamePicture symbol={emoji(pictures[name] ? name : name.replace(/ (lớn|nhỏ)$/,''))}/></span>}
    <small>{name}</small></div>)}</div>;
}

export function BankExercise({ question, selected, wrong, onAnswer }: { question: Question; selected: string; wrong: boolean; onAnswer: (id:string)=>void }) {
  const entry=question.bank!; const v=entry.visual;
  const memory=v.type === 'memory';
  const [remembering,setRemembering]=useState(memory);
  useEffect(()=>{
    if (!memory || !remembering) return;
    const timer=setTimeout(()=>setRemembering(false),(v.displaySeconds ?? 5)*1000);
    return ()=>clearTimeout(timer);
  },[memory,remembering,v.displaySeconds]);
  const pictureAnswers = v.type === 'shape' || (v.type === 'color' && typeof entry.correctAnswer === 'string');
  const subtraction = v.type === 'subtract' || (v.type === 'grouping' && v.operation === 'subtract');
  const addition = v.type === 'add' || v.type === 'story' || (v.type === 'grouping' && v.operation === 'add');
  return <div className="bank-exercise">
    {!pictureAnswers && <div className="bank-scene">
      {v.type === 'count' && <Items name={v.object!} count={v.count!}/>}
      {subtraction && <div><Items name={v.object!} count={v.start ?? v.groups![0]} removed={v.removed ?? v.groups![1]}/><small>Hình gạch chéo là phần đã bớt đi.</small></div>}
      {addition && <div className="bank-groups"><Items name={v.object!} count={v.groups![0]}/><b>+</b><Items name={v.object!} count={v.groups![1]}/></div>}
      {v.type === 'compare' && <div className="bank-groups">{v.groups!.map((count,i)=><div key={i}><small>Nhóm {i === 0 ? 'A' : 'B'}</small><Items name={v.object!} count={count}/></div>)}</div>}
      {v.type === 'color' && <div className="bank-color-count">{Array.from({length:5},(_,i)=><ColoredObject key={i} name={v.object!} color={i<3 ? v.color! : Object.keys(colors).find(c=>c!==v.color)!}/>)}</div>}
      {v.type === 'position' && <PositionScene visual={v}/>}
      {v.type === 'size' && <SizeScene items={v.items!}/>}
      {(v.type === 'pattern' || v.type === 'odd_or_match') && <div className="bank-sequence">{(v.sequence ?? v.items)!.map((name,i)=><span key={i}><GamePicture symbol={emoji(name)}/></span>)}{v.type === 'pattern' && <span><GamePicture symbol="❓"/></span>}</div>}
      {v.type === 'logic' && <span className="bank-logic"><GamePicture symbol={v.symbol ?? ['🌅','🌧️','🌱','🌊','🚦','⏰','💧','🌧️'][v.scene!]}/></span>}
      {memory && <div><div className="bank-sequence">{v.sequence!.map((name,i)=><div key={i}><span><GamePicture symbol={remembering ? emoji(name) : '❓'}/></span><small>{i+1}</small></div>)}</div><button className="bank-remember" disabled={remembering} onClick={()=>setRemembering(true)}>{remembering ? 'Nhìn và nhớ trong 5 giây nhé!' : '👀 Xem lại hình'}</button></div>}
    </div>}
    <div className={`bank-answers ${pictureAnswers ? 'bank-picture-answers' : ''}`}>
      {question.choices.map(choice=><button key={choice.id} disabled={remembering} aria-label={choice.label} className={wrong && selected===choice.id ? 'try-again' : ''} onClick={()=>onAnswer(choice.id)}>
        {v.type === 'shape' ? <ShapePicture name={choice.label}/> : pictureAnswers ? <ColoredObject name={choice.label.includes(' màu ') ? choice.label.split(' màu ')[0] : v.object!} color={choice.label.includes(' màu ') ? choice.label.split(' màu ')[1] : choice.label}/> : <>
          {pictures[choice.label] && <span className="bank-option-icon"><GamePicture symbol={pictures[choice.label]}/></span>}<span>{/\p{Extended_Pictographic}/u.test(choice.label) ? <GamePicture symbol={choice.label}/> : choice.label}</span>
        </>}
      </button>)}
    </div>
  </div>;
}
