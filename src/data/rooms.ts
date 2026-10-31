export type RoomKind = 'living' | 'kitchen' | 'bedroom';
export const ROOMS: {id:RoomKind;name:string;color:string;accent:string}[] = [
  {id:'living',name:'Phòng khách',color:'#d9eee8',accent:'#dd977e'},
  {id:'kitchen',name:'Phòng bếp',color:'#fff0cc',accent:'#89b9b5'},
  {id:'bedroom',name:'Phòng ngủ',color:'#e6dff4',accent:'#ac97ca'},
];
export type FurnitureKind = 'sofa'|'chair'|'table'|'cabinet'|'shelf'|'fridge'|'stove'|'sink'|'bed'|'nightstand'|'rug'|'art'|'lamp'|'plant'|'bear'|'clock'|'dishes'|'books'|'desk'|'wardrobe'|'tvstand'|'diningchair'|'kettle'|'microwave'|'toaster'|'fruit'|'vase'|'pillow'|'basket'|'mirror'|'toycar'|'radio';
export type Furniture = {id:FurnitureKind;name:string;width:number;color:string;rooms?:RoomKind[];layer:number};
export const FURNITURE:Furniture[] = [
  {id:'sofa',name:'Sofa êm',width:260,color:'#de9c8e',rooms:['living'],layer:20},
  {id:'chair',name:'Ghế bành',width:150,color:'#e8bf72',rooms:['living','bedroom'],layer:20},
  {id:'table',name:'Bàn gỗ',width:180,color:'#c8976b',rooms:['living','kitchen'],layer:20},
  {id:'cabinet',name:'Tủ gỗ',width:155,color:'#96b9ae',rooms:['living','bedroom'],layer:20},
  {id:'shelf',name:'Kệ sách',width:145,color:'#cba57b',rooms:['living','bedroom'],layer:20},
  {id:'fridge',name:'Tủ lạnh',width:140,color:'#a6ccc7',rooms:['kitchen'],layer:20},
  {id:'stove',name:'Bếp nấu',width:165,color:'#e7b88a',rooms:['kitchen'],layer:20},
  {id:'sink',name:'Bồn rửa',width:180,color:'#8bb6b7',rooms:['kitchen'],layer:20},
  {id:'bed',name:'Giường êm',width:270,color:'#bbabd6',rooms:['bedroom'],layer:20},
  {id:'nightstand',name:'Tủ đầu giường',width:115,color:'#dbb68b',rooms:['bedroom'],layer:20},
  {id:'rug',name:'Thảm mềm',width:300,color:'#ddab9b',layer:10},
  {id:'art',name:'Tranh treo',width:120,color:'#d7b076',layer:10},
  {id:'lamp',name:'Đèn xinh',width:95,color:'#f1ce8e',layer:30},
  {id:'plant',name:'Cây xanh',width:105,color:'#86b99a',layer:30},
  {id:'bear',name:'Gấu bông',width:90,color:'#cfa57f',layer:30},
  {id:'clock',name:'Đồng hồ',width:85,color:'#b5a5cd',layer:30},
  {id:'dishes',name:'Bộ bát đĩa',width:90,color:'#b2d3d2',layer:30},
  {id:'books',name:'Sách màu',width:85,color:'#b5a1c8',layer:30},
  {id:'desk',name:'Bàn học',width:210,color:'#a8c6c2',rooms:['bedroom','living'],layer:20},
  {id:'wardrobe',name:'Tủ quần áo',width:205,color:'#d2b8c7',rooms:['bedroom'],layer:20},
  {id:'tvstand',name:'Kệ ti vi',width:235,color:'#c6a47f',rooms:['living'],layer:20},
  {id:'diningchair',name:'Ghế ăn',width:110,color:'#b5cbaa',rooms:['kitchen'],layer:20},
  {id:'kettle',name:'Ấm trà',width:85,color:'#e3b4a3',layer:30},
  {id:'microwave',name:'Lò vi sóng',width:130,color:'#abc9c8',layer:30},
  {id:'toaster',name:'Máy nướng bánh',width:90,color:'#e9c18b',layer:30},
  {id:'fruit',name:'Giỏ trái cây',width:105,color:'#d3ad77',layer:30},
  {id:'vase',name:'Bình hoa',width:100,color:'#e5bbc9',layer:30},
  {id:'pillow',name:'Gối tựa',width:100,color:'#c5b7dc',layer:30},
  {id:'basket',name:'Giỏ đựng đồ',width:100,color:'#cda67b',layer:30},
  {id:'mirror',name:'Gương xinh',width:115,color:'#dbbd92',layer:10},
  {id:'toycar',name:'Ô tô đồ chơi',width:80,color:'#a6c4dd',layer:30},
  {id:'radio',name:'Đài nghe nhạc',width:100,color:'#b7c9aa',layer:30},

];
export type PlacedItem = {uid:string;kind:FurnitureKind;x:number;y:number;angle:number;flip:boolean;depth?:number};
export type RoomSave = {items:PlacedItem[];rewarded:boolean};
export type RoomSaves = Record<RoomKind,RoomSave>;
export const ROOM_STORAGE_KEY='PET_DECORATOR_V1';
export function emptyRooms():RoomSaves {return {living:{items:[],rewarded:false},kitchen:{items:[],rewarded:false},bedroom:{items:[],rewarded:false}};}
export function fitItem(item:PlacedItem):PlacedItem {
  const furniture=FURNITURE.find(f=>f.id===item.kind)!;
  const w=furniture.width,h=w*5/6,r=item.angle*Math.PI/180;
  const dx=(Math.abs(Math.cos(r))*w+Math.abs(Math.sin(r))*h)/2;
  const dy=(Math.abs(Math.sin(r))*w+Math.abs(Math.cos(r))*h)/2;
  return {...item,x:Math.min(790-dx,Math.max(10+dx,item.x)),y:Math.min(590-dy,Math.max(10+dy,item.y))};
}
export function restoreRooms(raw:unknown):RoomSaves {
  const result=emptyRooms();if(!raw||typeof raw!=='object')return result;
  for(const room of ROOMS){
    const entry=(raw as Record<string,unknown>)[room.id];if(!entry||typeof entry!=='object')continue;
    const data=entry as Record<string,unknown>;result[room.id].rewarded=data.rewarded===true;
    if(!Array.isArray(data.items))continue;
    const seen=new Set<string>();
    result[room.id].items=data.items.slice(0,30).flatMap(item=>{
      if(!item||typeof item!=='object'||typeof item.uid!=='string'||seen.has(item.uid)||!FURNITURE.some(f=>f.id===item.kind)||![item.x,item.y,item.angle].every(Number.isFinite))return [];
      seen.add(item.uid);return [fitItem({uid:item.uid,kind:item.kind,x:item.x,y:item.y,angle:((item.angle%360)+360)%360,flip:item.flip===true,...(typeof item.depth==='number'&&Number.isFinite(item.depth)&&Math.abs(item.depth)<1e8?{depth:item.depth}:{})})];
    });
  }
  return result;
}

export function roomDepth(item:PlacedItem) {
 const furniture=FURNITURE.find(f=>f.id===item.kind)!;
 return item.depth??(furniture.layer*10000+item.y+furniture.width*5/12);
}
export function sortedRoom(items:PlacedItem[]) {return [...items].sort((a,b)=>roomDepth(a)-roomDepth(b));}
export function reorderItem(items:PlacedItem[],uid:string,front:boolean) {
 const depths=items.map(roomDepth);
 const depth=(front?Math.max(...depths):Math.min(...depths))+(front?1:-1);
 return items.map(item=>item.uid===uid?{...item,depth}:item);
}
