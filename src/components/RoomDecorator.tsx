import React,{useEffect,useRef,useState} from 'react';
import {FURNITURE,ROOMS,ROOM_STORAGE_KEY,emptyRooms,restoreRooms,fitItem,sortedRoom,type Furniture,type PlacedItem,type RoomKind} from '../data/rooms';
import {FurnitureArt,RoomBackground} from './RoomArt';
import {celebrateStars} from '../utils/celebrate';
import {isSpeechMuted,playPopSound} from '../utils/audio';
import '../roomDecorator.css';

type Drag={item:PlacedItem;fresh:boolean;startX:number;startY:number;dx:number;dy:number;moved:boolean;inside:boolean};
export function RoomDecorator({onReward}:{onReward:()=>void}) {
  const [records,setRecords]=useState(()=>{try{return restoreRooms(JSON.parse(localStorage.getItem(ROOM_STORAGE_KEY)||'null'));}catch{return emptyRooms();}});
  const [room,setRoom]=useState<RoomKind|null>(null);
  const [selected,setSelected]=useState<string|null>(null),[armed,setArmed]=useState<Furniture|null>(null);
  const [draft,setDraft]=useState<PlacedItem|null>(null),[flash,setFlash]=useState(0);
  const [status,setStatus]=useState('Chọn căn phòng bé yêu thích nhé!');
  const [clearConfirm,setClearConfirm]=useState(false);
  const board=useRef<SVGSVGElement>(null),drag=useRef<Drag|null>(null),skipClick=useRef(false);
  const rewardGiven=useRef(new Set(ROOMS.filter(r=>records[r.id].rewarded).map(r=>r.id)));
  useEffect(()=>{try{localStorage.setItem(ROOM_STORAGE_KEY,JSON.stringify(records));}catch{setStatus('Chưa lưu được trên máy này. Bé vẫn có thể tải ảnh phòng.');}},[records]);
  const items=room?records[room].items:[];
  const active=items.find(item=>item.uid===selected);
  function changeItems(update:(items:PlacedItem[])=>PlacedItem[]) {
    if(!room)return;setRecords(previous=>({...previous,[room]:{...previous[room],items:update(previous[room].items)}}));
  }
  function point(clientX:number,clientY:number) {
    const svg=board.current,matrix=svg?.getScreenCTM();if(!svg||!matrix)return null;
    const point=new DOMPoint(clientX,clientY).matrixTransform(matrix.inverse());
    return {x:point.x,y:point.y,inside:point.x>=0&&point.x<=800&&point.y>=0&&point.y<=600};
  }
  function newItem(furniture:Furniture,x=400,y=430):PlacedItem {return fitItem({uid:crypto.randomUUID(),kind:furniture.id,x,y,angle:0,flip:false});}
  function begin(event:React.PointerEvent<Element>,item:PlacedItem,fresh:boolean) {
    if(event.button!==0)return;
    const p=point(event.clientX,event.clientY);if(!p)return;
    event.stopPropagation();event.currentTarget.setPointerCapture(event.pointerId);
    drag.current={item,fresh,startX:event.clientX,startY:event.clientY,dx:fresh?0:p.x-item.x,dy:fresh?0:p.y-item.y,moved:false,inside:p.inside};
    if(!fresh){setSelected(item.uid);setArmed(null);}
  }
  function move(event:React.PointerEvent) {
    const current=drag.current,p=point(event.clientX,event.clientY);if(!current||!p)return;
    if(Math.hypot(event.clientX-current.startX,event.clientY-current.startY)>4)current.moved=true;
    current.inside=p.inside;
    if(current.moved){current.item=fitItem({...current.item,x:p.x-current.dx,y:p.y-current.dy});setDraft(p.inside?current.item:null);}
  }
  function end() {
    const current=drag.current;drag.current=null;setDraft(null);if(!current?.moved)return;
    skipClick.current=true;
    if(!current.inside){setStatus('Thả đồ vào bên trong căn phòng nhé!');return;}
    const item=fitItem({...current.item,x:Math.round(current.item.x/8)*8,y:Math.round(current.item.y/8)*8});
    if(current.fresh&&items.length>=30){setStatus('Phòng có 30 món rồi. Bé cất bớt một món nhé!');return;}
    changeItems(previous=>current.fresh?[...previous,item]:previous.map(old=>old.uid===item.uid?item:old));
    setSelected(item.uid);setArmed(null);setStatus('Đẹp quá! Bé có thể xoay, lật hoặc kéo đồ sang chỗ khác.');if(!isSpeechMuted())playPopSound();
  }
  function place(x:number,y:number) {
    if(!armed)return;if(items.length>=30){setStatus('Phòng có 30 món rồi. Bé cất bớt một món nhé!');return;}
    const item=newItem(armed,x,y);changeItems(previous=>[...previous,item]);setSelected(item.uid);setArmed(null);if(!isSpeechMuted())playPopSound();
  }
  function edit(update:(item:PlacedItem)=>PlacedItem) {changeItems(previous=>previous.map(item=>item.uid===selected?fitItem(update(item)):item));}
  function save() {
    if(!room||!board.current||!items.length)return;
    const clone=board.current.cloneNode(true) as SVGSVGElement;
    clone.querySelectorAll('[data-selection]').forEach(node=>node.remove());
    clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width','1600');clone.setAttribute('height','1200');
    const blob=new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`phong-${room}.svg`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    const first=!rewardGiven.current.has(room);const next={...records,[room]:{...records[room],rewarded:true}};
    try {localStorage.setItem(ROOM_STORAGE_KEY,JSON.stringify(next));setRecords(next);
      if(first){rewardGiven.current.add(room);onReward();}
      setStatus(first?'Đã lưu phòng và tải ảnh! Bé nhận thêm 1 sao ⭐':'Đã lưu phòng và tải ảnh SVG sắc nét!');
    }catch{setStatus('Đã tải ảnh. Bộ nhớ máy chưa lưu được phòng; bé giữ ảnh nhé!');}
    setFlash(value=>value+1);celebrateStars(board.current.closest('dialog'));if(!isSpeechMuted())playPopSound();
  }
  if(!room)return <div className="room-selection"><p>Ngôi nhà nhỏ của bé</p><div>{ROOMS.map(theme=><button key={theme.id} onClick={()=>{setRoom(theme.id);setSelected(null);setArmed(null);setStatus('Kéo đồ từ hai bên vào phòng, hoặc chạm đồ rồi chạm trong phòng.');}}>
    <svg viewBox="0 0 800 600" aria-hidden="true"><RoomBackground room={theme.id}/><svg x="210" y="285" width="340" height="280"><FurnitureArt kind={theme.id==='living'?'sofa':theme.id==='kitchen'?'stove':'bed'}/></svg><svg x="570" y="320" width="120" height="150"><FurnitureArt kind="plant"/></svg></svg>
    <strong>{theme.name}</strong><small>{records[theme.id].items.length?'Tiếp tục căn phòng của bé':'Bắt đầu trang trí →'}</small>
  </button>)}</div></div>;
  const left=FURNITURE.filter(f=>f.rooms?.includes(room)),right=FURNITURE.filter(f=>!f.rooms);
  const display=sortedRoom(draft?[...items.filter(item=>item.uid!==draft.uid),draft]:items);
  return <div className="room-decorator" onPointerMove={move} onPointerUp={end} onPointerCancel={()=>{drag.current=null;setDraft(null);}}>
    <div className="room-toolbar" inert={clearConfirm}>
      <button onClick={()=>{setRoom(null);setClearConfirm(false);}}>‹ Đổi phòng</button>
      <strong>{ROOMS.find(r=>r.id===room)!.name}</strong>
      <button onClick={save} disabled={!items.length||!!draft}>📷 Chụp ảnh / Lưu</button>
      <button onClick={()=>setClearConfirm(true)} disabled={!items.length}>🧹 Dọn phòng</button>
    </div>
    <div className="room-workspace" inert={clearConfirm}>
      <Tray label="Nội thất" furniture={left} armed={armed?.id} onBegin={(e,f)=>begin(e,newItem(f),true)} onChoose={f=>{if(skipClick.current){skipClick.current=false;return;}setArmed(f);setSelected(null);setStatus(`Đã chọn ${f.name}. Bé chạm vào phòng để đặt nhé!`);}}/>
      <div className="room-canvas-wrap">
        <svg ref={board} className="room-canvas" viewBox="0 0 800 600" tabIndex={0} role="group" aria-label="Căn phòng trang trí" onClick={event=>{
          if(skipClick.current){skipClick.current=false;return;}if((event.target as Element).closest('[data-room-item]'))return;
          const p=point(event.clientX,event.clientY);if(p?.inside&&armed)place(p.x,p.y);else setSelected(null);
        }} onKeyDown={event=>{if(event.target===event.currentTarget&&event.key==='Enter'&&armed){event.preventDefault();place(400,430);}}}>
          <RoomBackground room={room}/>
          {display.map(item=>{const furniture=FURNITURE.find(f=>f.id===item.kind)!,w=furniture.width,h=w*5/6;return <g key={item.uid} data-room-item={item.uid} tabIndex={0} role="button" aria-label={`${furniture.name} trong phòng`} aria-pressed={selected===item.uid} transform={`translate(${item.x} ${item.y}) rotate(${item.angle})`} onPointerDown={event=>begin(event,item,false)} onClick={event=>{event.stopPropagation();skipClick.current=false;setSelected(item.uid);setArmed(null);}} onKeyDown={event=>{
            if(event.key==='Enter'||event.key===' '){event.preventDefault();setSelected(item.uid);setArmed(null);}
            const delta:Record<string,[number,number]>={ArrowUp:[0,-8],ArrowDown:[0,8],ArrowLeft:[-8,0],ArrowRight:[8,0]};
            if(delta[event.key]){event.preventDefault();const [dx,dy]=delta[event.key];changeItems(previous=>previous.map(old=>old.uid===item.uid?fitItem({...old,x:old.x+dx,y:old.y+dy}):old));}
          }}>
            <g transform={`scale(${item.flip?-1:1} 1)`}><svg x={-w/2} y={-h/2} width={w} height={h}><FurnitureArt kind={item.kind}/></svg></g>
            {selected===item.uid&&<rect data-selection="true" x={-w/2} y={-h/2} width={w} height={h} rx="14" fill="none" stroke="#f0a747" strokeWidth="4" strokeDasharray="8 5" pointerEvents="none"/>}
          </g>;})}
        </svg>
        {flash>0&&<div key={flash} className="room-flash" aria-hidden="true">✦</div>}
      </div>
      <Tray label="Trang trí" furniture={right} armed={armed?.id} onBegin={(e,f)=>begin(e,newItem(f),true)} onChoose={f=>{if(skipClick.current){skipClick.current=false;return;}setArmed(f);setSelected(null);setStatus(`Đã chọn ${f.name}. Bé chạm vào phòng để đặt nhé!`);}}/>
    </div>
    <div className="room-edit-controls" aria-label="Chỉnh đồ vật" inert={clearConfirm}>
      <span>{active?FURNITURE.find(f=>f.id===active.kind)!.name:'Chạm đồ để sửa'}</span>
      <button disabled={!active} onClick={()=>edit(item=>({...item,flip:!item.flip}))}>↔ Lật</button>
      <button disabled={!active} onClick={()=>edit(item=>({...item,angle:(item.angle+15)%360}))}>↻ Xoay</button>
      <button disabled={!active} onClick={()=>{changeItems(previous=>previous.filter(item=>item.uid!==selected));setSelected(null);}}>🗑 Cất đồ</button>
    </div>
    <p className="room-status" role="status">{status}</p>
    {clearConfirm&&<div className="room-confirm" role="dialog" aria-modal="true" aria-label="Dọn phòng"><div><h3>Cất hết đồ trong phòng này nhé?</h3><button autoFocus onClick={()=>{changeItems(()=>[]);setSelected(null);setArmed(null);setClearConfirm(false);}}>🧹 Dọn phòng này</button><button onClick={()=>setClearConfirm(false)}>Giữ lại phòng</button></div></div>}
  </div>;
}

function Tray({label,furniture,armed,onBegin,onChoose}:{label:string;furniture:Furniture[];armed?:string;onBegin:(e:React.PointerEvent,f:Furniture)=>void;onChoose:(f:Furniture)=>void}) {
  const [page,setPage]=useState(0),pages=Math.ceil(furniture.length/4);
  return <aside className="room-tray" aria-label={label}><h3>{label}</h3><div>{furniture.slice(page*4,page*4+4).map(f=><button key={f.id} aria-label={`Chọn ${f.name}`} aria-pressed={armed===f.id} onPointerDown={event=>onBegin(event,f)} onClick={()=>onChoose(f)}><FurnitureArt kind={f.id}/><span>{f.name}</span></button>)}</div><button className="tray-more" disabled={pages<2} onClick={()=>setPage(value=>(value+1)%pages)}>Đồ khác {page+1}/{pages} ›</button></aside>;
}
