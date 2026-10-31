import React,{useEffect,useRef,useState} from 'react';
import {HEALTH_INTERVAL,PLAYTIME_KEY,addPlaytime,restorePlaytime} from '../utils/playtime';
import {stopSpeech} from '../utils/audio';
import '../roomDecorator.css';

// One timer for the whole application; changing rooms or games never resets it.
export function HealthReminder() {
  const elapsed=useRef(0),paused=useRef(false),dialog=useRef<HTMLDialogElement>(null);
  const [due,setDue]=useState(false);
  useEffect(()=>{
    try{elapsed.current=restorePlaytime(sessionStorage.getItem(PLAYTIME_KEY));}catch{/* Private browsing: keep the timer in memory. */}
    let last=performance.now(),visible=document.visibilityState==='visible';
    const tick=()=>{
      const now=performance.now();elapsed.current=addPlaytime(elapsed.current,now-last,visible&&!paused.current);last=now;
      visible=document.visibilityState==='visible';
      try{sessionStorage.setItem(PLAYTIME_KEY,String(elapsed.current));}catch{/* Memory timer remains active. */}
      if(visible&&elapsed.current>=HEALTH_INTERVAL&&!paused.current){paused.current=true;setDue(true);}
    };
    const timer=setInterval(tick,1000);document.addEventListener('visibilitychange',tick);window.addEventListener('pagehide',tick);
    return ()=>{tick();clearInterval(timer);document.removeEventListener('visibilitychange',tick);window.removeEventListener('pagehide',tick);};
  },[]);
  useEffect(()=>{if(due){stopSpeech();dialog.current?.showModal();}else dialog.current?.close();},[due]);
  function resume(){elapsed.current=0;paused.current=false;try{sessionStorage.setItem(PLAYTIME_KEY,'0');}catch{/* Optional storage. */}setDue(false);}
  return <dialog ref={dialog} className="health-reminder" aria-labelledby="health-heading" onCancel={event=>{event.preventDefault();}}>
    <div aria-hidden="true" style={{fontSize:48}}>🌿 🐰 💧</div><h2 id="health-heading">Đến giờ nghỉ rồi bé ơi!</h2>
    <p>Bé đã chơi được 60 phút. Mình rời màn hình, uống nước, nhìn ra xa và vận động cùng người lớn nhé!</p>
    <button onClick={resume}>Bé nghỉ xong rồi — chơi tiếp</button>
  </dialog>;
}
