import React from 'react';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {FURNITURE,ROOMS,fitItem,restoreRooms,emptyRooms,sortedRoom,type PlacedItem} from '../src/data/rooms';
import {FurnitureArt,RoomBackground} from '../src/components/RoomArt';
import {HEALTH_INTERVAL,restorePlaytime,addPlaytime} from '../src/utils/playtime';

test('all rooms and 18 furniture illustrations render self-contained SVGs',()=>{
  assert.equal(FURNITURE.length,18);
  for(const furniture of FURNITURE){const svg=renderToStaticMarkup(<FurnitureArt kind={furniture.id}/>);assert.match(svg,/viewBox="0 0 120 100"/);assert.doesNotMatch(svg,/NaN|undefined|https?:\/\/(?!www.w3.org)/);}
  for(const room of ROOMS){assert.ok(FURNITURE.filter(f=>f.rooms?.includes(room.id)).length>=4);assert.match(renderToStaticMarkup(<svg><RoomBackground room={room.id}/></svg>),/pattern/);}
});
test('rotated pieces stay within the room even when dropped beyond every edge',()=>{
  for(const furniture of FURNITURE)for(const angle of [0,15,45,90,180,315])for(const [x,y] of [[-999,-999],[9999,9999]]){
    const item=fitItem({uid:'one',kind:furniture.id,x,y,angle,flip:false}),r=angle*Math.PI/180;
    const dx=(Math.abs(Math.cos(r))*furniture.width+Math.abs(Math.sin(r))*furniture.width*5/6)/2;
    const dy=(Math.abs(Math.sin(r))*furniture.width+Math.abs(Math.cos(r))*furniture.width*5/6)/2;
    assert.ok(item.x-dx>=9.999&&item.x+dx<=790.001);assert.ok(item.y-dy>=9.999&&item.y+dy<=590.001);
  }
});
test('saved rooms validate data, preserve transforms and keep room contents separate',()=>{
  const records=emptyRooms();const item:PlacedItem={uid:'sofa-1',kind:'sofa',x:400,y:430,angle:30,flip:true};
  records.living={items:[item],rewarded:true};assert.deepEqual(restoreRooms(JSON.parse(JSON.stringify(records))),records);
  assert.equal(restoreRooms({living:{items:[item,item,{...item,uid:'bad',x:'400'},{...item,uid:'unknown',kind:'unknown'}]}}).living.items.length,1);
  assert.deepEqual(restoreRooms(null),emptyRooms());
});
test('rugs remain below furniture and foreground furniture sorts last',()=>{
  const base:PlacedItem={uid:'1',kind:'sofa',x:400,y:400,angle:0,flip:false};
  assert.deepEqual(sortedRoom([base,{...base,uid:'2',y:450},{...base,uid:'rug',kind:'rug',y:500}]).map(i=>i.uid),['rug','1','2']);
});
test('shared playtime advances only while visible and clamps at sixty minutes',()=>{
  assert.equal(addPlaytime(1000,5000,false),1000);assert.equal(addPlaytime(1000,5000,true),6000);
  assert.equal(addPlaytime(HEALTH_INTERVAL-1,2000,true),HEALTH_INTERVAL);
  assert.equal(restorePlaytime('not a number'),0);assert.equal(restorePlaytime('-1'),0);assert.equal(restorePlaytime(String(HEALTH_INTERVAL+100)),HEALTH_INTERVAL);
});
