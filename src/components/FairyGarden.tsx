import React from 'react';
import { GamePicture } from './GamePicture';

/** Lightweight vector scenery, independent of viewport size and device emoji fonts. */
export function FairyGarden({ onPickApple }: { onPickApple: () => void }) {
  return <div className="fairy-scenery">
    <div className="fairy-sky" aria-hidden="true">
      <svg className="fairy-sun" viewBox="0 0 180 180">
        <g className="fairy-sun-rays" stroke="#ffdc68" strokeWidth="7" strokeLinecap="round">{Array.from({length:12},(_,i)=><path key={i} d="M90 10V22" transform={`rotate(${i*30} 90 90)`}/>)}</g>
        <circle cx="90" cy="90" r="55" fill="#ffd449" stroke="#fff0a4" strokeWidth="6"/>
        <ellipse cx="72" cy="84" rx="4" ry="7" fill="#88441d"/><ellipse cx="108" cy="84" rx="4" ry="7" fill="#88441d"/>
        <ellipse cx="61" cy="99" rx="9" ry="5" fill="#ffac65"/><ellipse cx="119" cy="99" rx="9" ry="5" fill="#ffac65"/>
        <path d="M77 102Q90 121 103 102" fill="#a55027"/><path d="M83 111Q90 106 97 111" fill="#ff9d9d"/>
      </svg>
      {[0,1,2].map(i=><svg key={i} className={`fairy-cloud fairy-cloud-${i}`} viewBox="0 0 240 100"><path d="M35 86C-5 82 2 38 39 38C40-5 108-5 119 35C153 5 192 23 191 49C239 42 252 87 210 89Z" fill="white"/><path d="M35 86Q115 100 210 89" stroke="#d4f1fc" strokeWidth="6" fill="none"/></svg>)}
      <div className="fairy-rainbow"/>
    </div>
    <svg className="fairy-landscape" viewBox="0 0 1440 520" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 180Q210 10 480 170T1000 140T1440 150V520H0Z" fill="#a4db75"/>
      <path d="M0 260Q250 90 660 250T1440 170V520H0Z" fill="#6bc782"/>
      <path d="M0 320Q300 180 750 310T1440 270V520H0Z" fill="#40ae79"/>
      <path d="M0 430Q360 320 740 430T1440 385V520H0Z" fill="#288f68"/>
      <path d="M1000 270Q740 340 890 390T720 520H1030Q1170 410 960 370T1060 275Z" fill="#f6d99b" opacity=".65"/>
    </svg>
    <div className="fairy-tree">
      <svg viewBox="0 0 240 310" aria-hidden="true"><path d="M105 300L111 125H137L148 300Z" fill="#b87948" stroke="#875331" strokeWidth="7"/><path d="M122 215L76 177M128 184L169 152" fill="none" stroke="#875331" strokeWidth="9" strokeLinecap="round"/><path d="M42 181C-8 147 10 88 49 78C33 21 99-4 130 29C178-6 227 40 204 80C257 103 237 168 202 181C169 214 73 216 42 181" fill="#399c69" stroke="#207e59" strokeWidth="7"/><path d="M45 87Q63 37 108 48M147 43Q184 32 190 65" fill="none" stroke="#87d58a" strokeWidth="13" strokeLinecap="round"/></svg>
      {[0,1,2].map(i=><button key={i} className={`fairy-apple fairy-apple-${i}`} onClick={onPickApple} aria-label="Quả táo đỏ - Bấm để giải toán"><GamePicture symbol="🍎"/></button>)}
    </div>
    <div className="fairy-flowerbeds" aria-hidden="true">{['🌷','🌼','🌸','🌻','🌷','🌸'].map((symbol,i)=><span key={i} style={{left:`${4+i*18}%`,bottom:`${10+(i%3)*14}px`,animationDelay:`-${i}s`}}><GamePicture symbol={symbol}/></span>)}</div>
    {[0,1,2].map(i=><svg key={i} className={`fairy-mushroom fairy-mushroom-${i}`} viewBox="0 0 100 100" aria-hidden="true"><path d="M38 47L33 91Q50 99 67 91L61 47" fill="#fff4d8" stroke="#d8b783" strokeWidth="3"/><path d="M5 52Q8 2 50 5Q92 2 95 52Q50 69 5 52" fill={i===1?'#ad7bdf':'#f77d80'} stroke="#fff0d5" strokeWidth="3"/><circle cx="31" cy="32" r="8" fill="#fff4df"/><circle cx="62" cy="21" r="6" fill="#fff4df"/><circle cx="74" cy="44" r="7" fill="#fff4df"/></svg>)}
    {[0,1,2].map(i=><span key={i} aria-hidden="true" className={`fairy-butterfly fairy-butterfly-${i}`}><GamePicture symbol="🦋"/></span>)}
  </div>;
}
