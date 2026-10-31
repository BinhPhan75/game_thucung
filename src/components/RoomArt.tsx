import React,{useId} from 'react';
import {FURNITURE,ROOMS,type FurnitureKind,type RoomKind} from '../data/rooms';

export function FurnitureArt({kind}:{kind:FurnitureKind}) {
  const id=useId().replace(/:/g,'');
  const f=FURNITURE.find(item=>item.id===kind)!;
  const paint=`url(#${id}-paint)`,wood=`url(#${id}-wood)`;
  return <svg viewBox="0 0 120 100" width="100%" height="100%" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`${id}-paint`} x2=".3" y2="1"><stop stopColor="#fff6e8"/><stop offset=".22" stopColor={f.color}/><stop offset="1" stopColor={f.color}/></linearGradient>
      <linearGradient id={`${id}-wood`} x2="0" y2="1"><stop stopColor="#edcfa7"/><stop offset="1" stopColor="#bf926a"/></linearGradient>
      <pattern id={`${id}-texture`} width="16" height="8" patternUnits="userSpaceOnUse"><path d="M0 2q8-3 16 0M3 7h9" fill="none" stroke="#815b3d" strokeOpacity=".12" strokeWidth=".5"/></pattern>
    </defs>
    <ellipse cx="61" cy="91" rx="49" ry="6" fill="#51443e" opacity=".12"/>
    <g stroke="#67534b" strokeOpacity=".28" strokeWidth="1.1" strokeLinejoin="round">
    {(kind==='sofa'||kind==='chair')&&<>
      <path d="M19 80v11m80-11v11" stroke="#9e7757" strokeWidth="5"/>
      <rect x="13" y="20" width="94" height="53" rx="16" fill={paint}/>
      <path d="M23 26q18-4 34 0v34H23Zm40 0q18-4 34 0v34H63Z" fill="#ffffff22"/>
      <rect x="17" y="56" width="86" height="28" rx="9" fill={paint}/>
      <path d="M23 61h34v16H23zm40 0h34v16H63z" fill="#ffffff33"/>
      <rect x="7" y="43" width="17" height="39" rx="8" fill={paint}/><rect x="96" y="43" width="17" height="39" rx="8" fill={paint}/>
      {kind==='sofa'?<><rect x="26" y="35" width="22" height="22" rx="5" fill="#f8dfaf" transform="rotate(-10 37 46)"/><rect x="73" y="34" width="21" height="23" rx="5" fill="#a5c9c4" transform="rotate(12 83 45)"/></>:<path d="M45 30h30v29H45Z" fill="#fff0d0"/>}
    </>}
    {kind==='table'&&<><path d="M23 50 18 88M98 51l5 37M45 41v36" stroke="#ab7e59" strokeWidth="6"/><path d="M8 38 83 25 113 43 38 61Z" fill={wood}/><path d="M8 38v9l30 22 75-17v-9L38 61Z" fill="#c89d70"/><path d="m26 40 52-9m-38 17 52-10" stroke="#a87b53" opacity=".3"/></>}
    {(kind==='cabinet'||kind==='nightstand'||kind==='shelf')&&<>
      <path d="M19 84v9m82-9v9" stroke="#947051" strokeWidth="5"/>
      <path d="M15 20 27 12h78v71l-12 7H15Z" fill={wood}/><path d="M93 20 105 12v71l-12 7Z" fill="#ad8969"/>
      <path d="M15 20h78v70H15Z" fill={kind==='cabinet'?paint:wood}/>
      {kind==='shelf'?<><path d="M22 27h64v54H22Z" fill="#997d66"/><path d="M22 49h64M22 69h64" stroke="#eccca4" strokeWidth="4"/><path d="M27 31h9v16h-9zm15-2h9v18h-9z" fill="#adc7c4"/><path d="M57 34h17v13H57Z" fill="#e1afae"/><path d="M29 57h35v10H29Z" fill="#d6bf8b"/><circle cx="73" cy="75" r="5" fill="#e3d5b5"/></>:<><path d="M23 28h61v23H23zm0 30h61v23H23Z" fill="#ffffff15"/><path d="M49 39h10m-10 30h10" stroke="#8a6b54" strokeWidth="3"/></>}
    </>}
    {kind==='fridge'&&<><path d="M33 10 42 5h47v84l-10 5H33Z" fill="#659e9e"/><rect x="27" y="10" width="53" height="84" rx="8" fill={paint}/><path d="M28 40h51" stroke="#5c9296"/><path d="M35 22v9m0 20v19" stroke="#f4f4e4" strokeWidth="4"/><rect x="54" y="19" width="16" height="13" rx="3" fill="#fff3b4"/><path d="m57 25 4 3 5-5" stroke="#d5a765" fill="none"/></>}
    {(kind==='stove'||kind==='sink')&&<>
      <path d="M15 35 29 24h80v60L95 95H15Z" fill="#6c9293"/><rect x="15" y="35" width="80" height="60" rx="3" fill={paint}/><path d="M12 34 29 23h82L96 39H12Z" fill="#f1eadd"/>
      {kind==='stove'?<><ellipse cx="42" cy="31" rx="12" ry="4" fill="#697d7e"/><ellipse cx="78" cy="31" rx="12" ry="4" fill="#697d7e"/><rect x="27" y="59" width="55" height="27" rx="5" fill="#596f77"/><path d="M32 63h44" stroke="#cfdee0"/><circle cx="33" cy="48" r="3" fill="#f5eee1"/><circle cx="52" cy="48" r="3" fill="#f5eee1"/><circle cx="72" cy="48" r="3" fill="#f5eee1"/></>:<><ellipse cx="58" cy="31" rx="24" ry="7" fill="#89b2b6"/><ellipse cx="58" cy="32" rx="19" ry="4" fill="#c6e0db"/><path d="M75 29V13q-12-9-18 3v5" fill="none" stroke="#cbdedc" strokeWidth="5"/><path d="M55 47v40m-10-23h3m15 0h3" stroke="#497d7e"/></>}
    </>}
    {kind==='bed'&&<>
      <path d="M22 79v13m76-13v13" stroke="#98775f" strokeWidth="5"/>
      <rect x="23" y="8" width="74" height="44" rx="12" fill={wood}/><rect x="28" y="13" width="64" height="31" rx="9" fill={paint}/>
      <path d="M28 35h64l15 43H13Z" fill="#fff8e9"/><path d="M13 78h94v10H13Z" fill="#aa91bb"/>
      <path d="M25 46h70l12 32H13Z" fill={paint}/><path d="M25 46h70l3 8H22Z" fill="#e6dcf0"/>
      <path d="M31 28h24q4 0 4 5v8H27l1-9q0-4 3-4Z" fill="#fffaf0"/><path d="M65 28h24q3 0 3 4l1 9H61v-8q0-5 4-5Z" fill="#fffaf0"/>
      <path d="M30 32h23m14 0h22M19 74h82" stroke="#fff8ec" strokeWidth="1.5" fill="none"/><path d="M33 58h54M29 65h62" stroke="#ffffff35" strokeWidth="1.5"/>
      <path d="M14 83h92" stroke="#f0e4f4" strokeOpacity=".6"/>
    </>}
    {kind==='rug'&&<><ellipse cx="60" cy="59" rx="55" ry="27" fill={paint}/><ellipse cx="60" cy="59" rx="47" ry="21" fill="none" stroke="#fff1dc" strokeWidth="3"/><path d="m40 59 20-12 20 12-20 12Z" fill="#fff1dc"/><path d="M7 54 2 52m5 12-5 2m111-12 5-2m-5 12 5 2" stroke={f.color} strokeWidth="3"/></>}
    {kind==='art'&&<><rect x="20" y="10" width="80" height="74" rx="4" fill={wood}/><rect x="27" y="17" width="66" height="60" fill="#fdf7e6"/><rect x="33" y="23" width="54" height="48" fill="#bdded6"/><circle cx="70" cy="35" r="8" fill="#ffe5a7"/><path d="m33 65 15-22 14 16 10-9 15 21H33Z" fill="#82aaa0"/></>}
    {kind==='lamp'&&<><ellipse cx="61" cy="88" rx="23" ry="5" fill="#b99f7b"/><path d="M61 36v49" stroke="#a88b65" strokeWidth="5"/><path d="M38 12h45l12 38H25Z" fill={paint}/><ellipse cx="60" cy="49" rx="35" ry="5" fill="#ffe9b1"/><path d="m46 17-6 27m34-27 6 27" stroke="#fff8d8" strokeWidth="2"/></>}
    {kind==='plant'&&<><path d="M38 65h46l-6 28H44Z" fill="#e3b398"/><ellipse cx="61" cy="65" rx="23" ry="6" fill="#a67d60"/><path d="M61 67V24m0 26L39 31m22 9 19-17" stroke="#6b9b75" strokeWidth="3"/><path d="M60 35Q35 27 43 9q22 4 17 26ZM62 48q24-31 36-12Q94 56 62 48ZM56 56Q23 58 23 36q25-4 33 20Z" fill={paint}/></>}
    {kind==='bear'&&<><circle cx="36" cy="24" r="12" fill={paint}/><circle cx="83" cy="24" r="12" fill={paint}/><ellipse cx="60" cy="68" rx="26" ry="27" fill={paint}/><circle cx="60" cy="36" r="27" fill={paint}/><ellipse cx="60" cy="46" rx="14" ry="10" fill="#f3dfc5"/><ellipse cx="60" cy="40" rx="4" ry="3" fill="#796052"/><circle cx="49" cy="32" r="2" fill="#61554e"/><circle cx="71" cy="32" r="2" fill="#61554e"/><ellipse cx="36" cy="85" rx="15" ry="10" fill={paint}/><ellipse cx="83" cy="85" rx="15" ry="10" fill={paint}/><path d="m46 60 14 5 14-5v12l-14-5-14 5Z" fill="#b5c9bf"/></>}
    {kind==='clock'&&<><circle cx="60" cy="46" r="38" fill={paint}/><circle cx="60" cy="46" r="30" fill="#fff8e7"/><path d="M60 25v21l15 8" stroke="#796b88" strokeWidth="3" fill="none"/><path d="M60 19v4m0 47v4m-27-28h4m47 0h4" stroke="#b9aaca" strokeWidth="2"/></>}
    {kind==='dishes'&&<><ellipse cx="60" cy="76" rx="46" ry="12" fill={paint}/><ellipse cx="60" cy="72" rx="42" ry="10" fill="#f4f4e4"/><path d="M26 38h60q0 38-30 38T26 38Z" fill={paint}/><ellipse cx="56" cy="38" rx="30" ry="8" fill="#edf4df"/><path d="M85 45q29-7 15 18l-19 4" stroke={f.color} strokeWidth="7" fill="none"/></>}
    {kind==='books'&&<><path d="M15 67 80 52l25 13-65 16Z" fill="#c3948c"/><path d="M15 67v10l25 15 65-17V65L40 81Z" fill="#eadcc6"/><path d="M22 48 81 35l19 12-59 15Z" fill="#8db6ad"/><path d="M22 48v11l19 14 59-16V47L41 62Z" fill="#e8e0c7"/><path d="m28 31 51-11 17 11-51 14Z" fill={paint}/><path d="M28 31v10l17 15 51-15V31L45 45Z" fill="#eee2cb"/></>}

    {kind==='desk'&&<><path d="M17 43v47m84-47v47" stroke="#b09271" strokeWidth="6"/><path d="M10 37 22 28h85v12l-10 8H10Z" fill={wood}/><rect x="69" y="47" width="30" height="35" rx="3" fill={paint}/><path d="M70 64h28m-17-10h8m-8 19h8" stroke="#728c89"/><rect x="22" y="23" width="23" height="8" rx="2" fill="#dac0cf"/></>}
    {kind==='wardrobe'&&<><path d="M17 15 28 7h77v81l-11 6H17Z" fill="#ad8b9c"/><rect x="17" y="15" width="77" height="79" rx="4" fill={paint}/><path d="M24 23h27v60H24zm34 0h28v60H58Z" fill="#ffffff18"/><path d="M48 48v12m14-12v12" stroke="#ae8c67" strokeWidth="3"/><path d="M24 94v3m63-3v3" stroke="#98775f" strokeWidth="4"/></>}
    {kind==='tvstand'&&<><rect x="9" y="65" width="102" height="26" rx="4" fill={wood}/><path d="M43 67v21m35-21v21" stroke="#b68f67"/><path d="M24 91v5m72-5v5" stroke="#93775d" strokeWidth="4"/><rect x="20" y="10" width="81" height="48" rx="5" fill="#677f88"/><rect x="25" y="15" width="71" height="37" rx="2" fill="#b9d9d6"/><path d="m25 44 18-19 22 19 13-12 18 20H25" fill="#8eb8a7"/><circle cx="80" cy="24" r="6" fill="#fff0b5"/><path d="M60 58v6m-12 1h24" stroke="#667c83" strokeWidth="4"/></>}
    {kind==='diningchair'&&<><path d="M31 55 28 91m58-36 6 36" stroke="#a88a67" strokeWidth="6"/><rect x="29" y="9" width="59" height="46" rx="10" fill={paint}/><path d="M36 16v29m15-29v29m15-29v29m15-29v29" stroke="#ffffff45" strokeWidth="3"/><path d="M28 49h60l10 15-69 7-8-9Z" fill={wood}/></>}
    {kind==='kettle'&&<><path d="M83 42q29-13 17 20L83 69" fill="none" stroke={f.color} strokeWidth="8"/><path d="M30 49 8 37l10 28 21 8" fill={paint}/><ellipse cx="59" cy="62" rx="31" ry="26" fill={paint}/><ellipse cx="59" cy="38" rx="23" ry="6" fill="#f2d8c9"/><circle cx="59" cy="29" r="6" fill={f.color}/><path d="M41 57q-7 14 3 21" stroke="#fff5e3" strokeWidth="3" fill="none"/></>}
    {kind==='microwave'&&<><path d="M9 27 20 19h91v58l-10 8H9Z" fill="#7a9fa0"/><rect x="9" y="27" width="92" height="58" rx="7" fill={paint}/><rect x="17" y="36" width="56" height="39" rx="4" fill="#65838c"/><path d="m22 64 20-24h17L30 68Z" fill="#ffffff25"/><path d="M76 41v29" stroke="#e9ece4" strokeWidth="4"/><rect x="84" y="37" width="11" height="10" rx="2" fill="#e2ead9"/><circle cx="89" cy="60" r="5" fill="#eef0df"/></>}
    {kind==='toaster'&&<><path d="M26 36V20q0-10 13-7 16-8 18 7v20m5-4V19q0-9 12-6 17-7 18 7v20" fill="#f3d2a0" stroke="#c79865" strokeWidth="3"/><rect x="18" y="35" width="85" height="49" rx="12" fill={paint}/><path d="M29 42h57" stroke="#fff0d2" strokeWidth="3"/><path d="M94 50v17" stroke="#9d8060" strokeWidth="3"/><circle cx="92" cy="71" r="4" fill="#9b8b78"/></>}
    {kind==='fruit'&&<><path d="M23 56q0-47 37-47t37 47" fill="none" stroke="#bc9465" strokeWidth="5"/><circle cx="42" cy="49" r="17" fill="#e4a18c"/><circle cx="74" cy="47" r="18" fill="#edc078"/><path d="M55 45q-15-39 16-31-8 28-16 31Z" fill="#b4c38f"/><path d="M12 57h97L96 88H26Z" fill={wood}/><path d="M20 66h82m-77 11h73M34 58l6 27m16-27v28m20-28-4 28m21-28-7 28" stroke="#b78c62"/></>}
    {kind==='vase'&&<><path d="M58 63V21m0 22L36 22m22 29 23-22" stroke="#799e72" strokeWidth="3"/><g fill="#e6b0bc"><circle cx="36" cy="20" r="12"/><circle cx="59" cy="15" r="13"/><circle cx="83" cy="27" r="12"/></g><g fill="#ffedba"><circle cx="36" cy="20" r="4"/><circle cx="59" cy="15" r="4"/><circle cx="83" cy="27" r="4"/></g><path d="M43 56h33l-3 12q21 31-13 28-33 3-14-28Z" fill={paint}/><path d="M49 72q-6 12 0 16" fill="none" stroke="#fff2dc" strokeWidth="3"/></>}
    {kind==='pillow'&&<><path d="M18 24q42 10 84 0-9 29 0 56-42-8-84 0 9-28 0-56Z" fill={paint}/><path d="M26 31q34 8 68 0-6 22 0 42-34-6-68 0 6-22 0-42Z" fill="none" stroke="#f3e9f7" strokeWidth="2"/><path d="m60 39 13 13-13 13-13-13Z" fill="#ede0ee"/></>}
    {kind==='basket'&&<><path d="M25 48V35q35-38 70 0v13" fill="none" stroke="#b7946b" strokeWidth="5"/><path d="M14 44h92L95 91H25Z" fill={wood}/><ellipse cx="60" cy="44" rx="46" ry="9" fill="#ad8b69"/><path d="M27 43q7-24 31-12l15-4 22 17" fill="#c4d1c3"/><path d="M20 57h81m-78 12h75m-72 12h70M33 49l5 39m16-39v39m19-39-3 39m20-39-7 39" stroke="#ba9368"/></>}
    {kind==='mirror'&&<><rect x="23" y="6" width="74" height="87" rx="35" fill={wood}/><rect x="30" y="13" width="60" height="73" rx="29" fill="#cde2df"/><path d="m39 64 38-40m-24 49 30-30" stroke="#ffffff90" strokeWidth="5"/></>}
    {kind==='toycar'&&<><path d="m26 47 13-21h38l16 21h14v28H13V52Z" fill={paint}/><path d="m43 31-8 16h21V31Zm19 0v16h22L74 31Z" fill="#edf4df"/><circle cx="34" cy="76" r="12" fill="#788392"/><circle cx="88" cy="76" r="12" fill="#788392"/><circle cx="34" cy="76" r="5" fill="#dfd9c8"/><circle cx="88" cy="76" r="5" fill="#dfd9c8"/></>}
    {kind==='radio'&&<><path d="M25 28V17h70v11" stroke="#9d8e79" strokeWidth="5" fill="none"/><rect x="12" y="28" width="96" height="60" rx="12" fill={paint}/><circle cx="41" cy="58" r="22" fill="#91a58d"/><circle cx="41" cy="58" r="15" fill="none" stroke="#d3dfc7" strokeWidth="2"/><rect x="70" y="39" width="28" height="12" rx="3" fill="#f0e6c8"/><path d="M75 45h18" stroke="#a19a7d"/><circle cx="78" cy="68" r="7" fill="#eee0c1"/><circle cx="96" cy="68" r="5" fill="#eee0c1"/></>}
    {['table','cabinet','nightstand','shelf'].includes(kind)&&<path d={kind==='table'?'M8 38 83 25 113 43 38 61Z':'M17 22h74v65H17Z'} fill={`url(#${id}-texture)`} stroke="none"/>}
    {['sofa','chair'].includes(kind)&&<path d="M29 29q29-7 60 0M29 72h60" stroke="#fff8eb" strokeOpacity=".55" strokeWidth="1.5" fill="none"/>}
    </g>
  </svg>;
}

export function RoomBackground({room}:{room:RoomKind}) {
  const id=useId().replace(/:/g,'');const theme=ROOMS.find(r=>r.id===room)!;
  return <g>
    <defs>
      <linearGradient id={`${id}-wall`} x2="0" y2="1"><stop stopColor="#fff9ed"/><stop offset="1" stopColor={theme.color}/></linearGradient>
      <linearGradient id={`${id}-floor`} x2=".2" y2="1"><stop stopColor="#e4c4a2"/><stop offset="1" stopColor="#f2dcc0"/></linearGradient>
      <radialGradient id={`${id}-light`}><stop stopColor="#fffce2" stopOpacity=".7"/><stop offset="1" stopColor="#fffce2" stopOpacity="0"/></radialGradient>
      <pattern id={`${id}-grain`} width="110" height="42" patternUnits="userSpaceOnUse"><path d="M0 41h110M1 1v40M7 32q30-6 80 0" fill="none" stroke="#b9926d" strokeOpacity=".16"/></pattern>
    </defs>
    <rect width="800" height="600" fill={`url(#${id}-wall)`}/>
    <g fill="none" stroke="#a5b9b3" strokeOpacity=".24" strokeWidth="2">
      {[115,220,535,640].map(x=><rect key={x} x={x} y="86" width="72" height="225" rx="3"/>)}
      <path d="M90 330h620M90 338h620"/>
    </g>
    <path d="M0 0 90 42v335L0 435Z" fill={theme.color}/><path d="M800 0 710 42v335l90 58Z" fill={theme.color}/>
    <path d="M0 435 90 377h620l90 58v165H0Z" fill={`url(#${id}-floor)`}/><path d="M0 435 90 377h620l90 58v165H0Z" fill={`url(#${id}-grain)`}/>
    <path d="M0 429 90 369h620l90 60" fill="none" stroke="#b78e6a" strokeWidth="17"/>
    <path d="M0 422 90 362h620l90 60" fill="none" stroke="#efdabd" strokeWidth="6"/>
    <path d="M90 42h620" stroke="#ffffffb0" strokeWidth="8"/>
    <path d="M0 4 90 46h620l90-42M90 52h620" fill="none" stroke="#c6b9a5" strokeOpacity=".35" strokeWidth="3"/>
    <path d="M0 0 90 36h620l90-36" fill="none" stroke="#fff9ea" strokeWidth="10"/>
    <rect x="302" y="76" width="196" height="219" rx="8" fill="#9cbcb9" opacity=".2"/>
    <rect x="294" y="68" width="196" height="219" rx="8" fill="#fff9ec"/>
    <rect x="306" y="80" width="172" height="195" rx="3" fill="#bcdedb"/>
    <circle cx="440" cy="115" r="24" fill="#fff1b9"/><path d="M306 242q30-66 73-31t99-18v82H306Z" fill="#93b8a3"/>
    <path d="M392 80v195M306 178h172" stroke="#fff8e9" strokeWidth="9"/>
    <path d="M279 65h226" stroke="#b1967d" strokeWidth="5" strokeLinecap="round"/>
    <path d="M280 70h43q-3 108-27 197l-29 13Z" fill={theme.accent} opacity=".8"/><path d="M461 70h43l13 210-29-13q-24-89-27-197Z" fill={theme.accent} opacity=".8"/>
    <path d="M283 79q10 82-4 183m214-183q-10 82 4 183" stroke="#ffffff50" strokeWidth="4" fill="none"/>
    <rect x="283" y="278" width="218" height="12" rx="4" fill="#f9efdc"/>
    <ellipse cx="402" cy="375" rx="300" ry="250" fill={`url(#${id}-light)`} pointerEvents="none"/>
    <path d="M308 284h170l178 264H192Z" fill="#fff5cd" opacity=".12" pointerEvents="none"/>
    {room==='kitchen'&&<path d="M118 311h140m-140 22h140m-140 22h140M140 300v64m35-64v64m35-64v64m35-64v64" stroke="#fffaf0" strokeWidth="3" opacity=".6"/>}
  </g>;
}
