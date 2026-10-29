import React, { useRef, useState } from 'react';
import type { ThinkingActivity, SortItem } from '../data/thinkingQuestions';
import { shuffledPieces } from '../data/thinkingQuestions';
import { GamePicture, pictureUrl } from './GamePicture';

type Props = {activity:ThinkingActivity; disabled:boolean; onAnswer:(answer:string)=>void};
export function ThinkingExercise({activity,disabled,onAnswer}:Props) {
  const [placed,setPlaced]=useState<number[]>([]);
  const [selected,setSelected]=useState<number|null>(null);
  const [order]=useState(()=>shuffledPieces(activity.kind==='puzzle'?activity.rows*activity.columns:activity.kind==='sort'?activity.items.length:10));
  const locked=useRef(false);
  const dragged=useRef<number|null>(null);
  const total=activity.kind==='connect'?10:activity.kind==='puzzle'?activity.rows*activity.columns:activity.items.length;
  const complete=placed.length===total;
  const fail=()=>{locked.current=true;onAnswer('incorrect');};
  const place=(item:number)=>{setPlaced(previous=>previous.includes(item)?previous:[...previous,item]);setSelected(null);};
  const drop=(target:number|string,item=selected)=>{
    if(disabled || locked.current || complete || item===null || placed.includes(item))return;
    const correct=activity.kind==='puzzle'?item===target:activity.kind==='sort'?activity.items[item].group===target:false;
    if(correct)place(item);else fail();
  };
  const dragProps=(item:number)=>({draggable:!disabled&&!complete,onDragStart:(event:React.DragEvent)=>{
    dragged.current=item;setSelected(item);event.dataTransfer.setData('text/plain',String(item));event.dataTransfer.effectAllowed='move';
  },onDragEnd:()=>{dragged.current=null;}});
  const dropProps=(target:number|string)=>({onDragOver:(event:React.DragEvent)=>{event.preventDefault();},onDrop:(event:React.DragEvent)=>{
    event.preventDefault();drop(target,dragged.current);dragged.current=null;
  }});
  return <div className="thinking-exercise">
    <p className="thinking-instruction">{activity.kind==='connect'?'Chạm các số theo thứ tự từ 1 đến 10.':activity.kind==='puzzle'?'Chạm một mảnh, rồi chạm ô cần ghép. Bé cũng có thể kéo thả!':'Chạm một đồ vật, rồi chạm nhóm phù hợp. Bé cũng có thể kéo thả!'}</p>
    <p className="thinking-progress" role="status">{complete?'Hoàn thành rồi! Bé nhận thưởng nhé!':`Đã làm đúng ${placed.length}/${total}${activity.kind==='connect'?` · Số tiếp theo: ${placed.length+1}`:''}`}</p>
    {activity.kind==='connect' && <div className="connect-board">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {complete && <polygon points={activity.points.map(p=>p.join(',')).join(' ')} fill={activity.color} stroke="#7c3aed" strokeWidth="1"/>}
        <polyline points={activity.points.slice(0,placed.length).map(p=>p.join(',')).join(' ')} fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {activity.points.map(([x,y],i)=><button key={i} className={placed.includes(i)?'connected':''} style={{left:`${x}%`,top:`${y}%`}} disabled={disabled||complete||placed.includes(i)} aria-label={`Nối số ${i+1}`} onClick={()=>{if(locked.current)return;if(i===placed.length)place(i);else fail();}}>{i+1}</button>)}
      {complete && <strong className="connect-name">{activity.name}</strong>}
    </div>}
    {activity.kind==='puzzle' && <>
      <div className="puzzle-reference"><span>Tranh mẫu: {activity.name}</span><GamePicture symbol={activity.symbol}/></div>
      <div className="puzzle-layout">
        <div className="puzzle-board" style={{gridTemplateColumns:`repeat(${activity.columns},1fr)`}}>
          {Array.from({length:total},(_,i)=><button key={i} aria-label={`Ô ghép hàng ${Math.floor(i/activity.columns)+1}, cột ${i%activity.columns+1}`} disabled={disabled||placed.includes(i)} {...dropProps(i)} onClick={()=>drop(i)}>
            <div style={{opacity:placed.includes(i)?1:.2}}><PuzzlePiece activity={activity} index={i}/></div>
          </button>)}
        </div>
        <div className="puzzle-tray" aria-label="Các mảnh rời" style={{gridTemplateColumns:`repeat(${activity.columns},1fr)`}}>
          {order.map(i=><button key={i} aria-label={`Chọn mảnh ${i+1}`} aria-pressed={selected===i} disabled={disabled||placed.includes(i)} className={placed.includes(i)?'piece-placed':''} {...dragProps(i)} onClick={()=>setSelected(i)}><PuzzlePiece activity={activity} index={i}/></button>)}
        </div>
      </div>
    </>}
    {activity.kind==='sort' && <>
      <div className="sort-items">{order.filter(i=>!placed.includes(i)).map(i=><button key={i} aria-label={`Chọn ${activity.items[i].label}`} aria-pressed={selected===i} disabled={disabled} {...dragProps(i)} onClick={()=>setSelected(i)}><SortPicture item={activity.items[i]}/><span>{activity.items[i].label}</span></button>)}</div>
      <div className="sort-groups" style={{gridTemplateColumns:`repeat(${activity.groups.length},minmax(0,1fr))`}}>{activity.groups.map(group=><button key={group.id} disabled={disabled||complete} aria-label={`Xếp vào nhóm ${group.label}`} {...dropProps(group.id)} onClick={()=>drop(group.id)}>
        <strong>{group.label}</strong><div>{placed.filter(i=>activity.items[i].group===group.id).map(i=><SortPicture key={i} item={activity.items[i]}/>)}</div>
      </button>)}</div>
    </>}
    {complete && <button className="thinking-reward" disabled={disabled} onClick={()=>{if(locked.current)return;locked.current=true;onAnswer('complete');}}>⭐ Hoàn thành — Nhận thưởng</button>}
  </div>;
}

function PuzzlePiece({activity,index}:{activity:Extract<ThinkingActivity,{kind:'puzzle'}>;index:number}) {
  const {rows,columns}=activity;
  return <svg viewBox={`${(index%columns)*100/columns} ${Math.floor(index/columns)*100/rows} ${100/columns} ${100/rows}`} aria-hidden="true">
    <rect width="100" height="100" fill="#e0f2fe"/>
    <image href={pictureUrl(activity.symbol)} x="0" y="0" width="100" height="100"/>
    <rect x={(index%columns)*100/columns+1} y={Math.floor(index/columns)*100/rows+1} width="9" height="9" rx="2" fill="#fff" opacity=".9"/>
    <text x={(index%columns)*100/columns+5.5} y={Math.floor(index/columns)*100/rows+7.5} textAnchor="middle" fontSize="6" fontWeight="bold" fill="#6d28d9">{index+1}</text>
  </svg>;
}
function SortPicture({item}:{item:SortItem}) {
  return <span className={`sort-picture ${item.size==='small'?'sort-small':''}`} aria-hidden="true">{item.color?<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" fill={item.color} stroke="#334155" strokeWidth="2"/></svg>:<GamePicture symbol={item.symbol!}/>}</span>;
}
