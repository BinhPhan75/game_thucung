import { writeFileSync } from 'node:fs';

// Curated additions kept separate from the original supplied question bank.
const entries = [];
const objects = ['quả lê','quả dâu','quả dứa','con rùa','con bướm','con ong','con ốc sên','con cừu','bắp ngô','quả nho'];
const symbols = ['🍐','🍓','🍍','🐢','🦋','🐝','🐌','🐑','🌽','🍇'];
function add(group, question, answer, visual, options, explanation) {
  const category = `T${String(group).padStart(2,'0')}`;
  const index = entries.filter(e=>e.category===category).length;
  const choices = options ?? (answer===0 ? [0,1,2] : [answer-1,answer,answer+1]);
  const offset=index%choices.length;
  entries.push({id:`${category}_EXTRA_${String(index+1).padStart(3,'0')}`,category,difficulty:group===2?2:1,question,
    options:[...choices.slice(offset),...choices.slice(0,offset)],correctAnswer:answer,visual,
    explanation:explanation ?? `Đáp án là ${answer}. Mình cùng quan sát lại hình nhé!`});
}
for(let i=0;i<10;i++) {
  const object=objects[i],a=i%4+1,b=(i+1)%3+1;
  add(1,`Bé đếm thật chậm: trong hình có mấy ${object}?`,i%5+1,{type:'count',object,count:i%5+1});
  add(2,`Cùng đếm nhóm ${object} này nhé! Có tất cả bao nhiêu?`,i%5+6,{type:'count',object,count:i%5+6});
  add(3,`Nhóm đầu có ${a} ${object}, nhóm sau có ${b} ${object}. Gộp lại được mấy ${object}?`,a+b,{type:'add',object,groups:[a,b]});
  add(4,`Có ${a+b} ${object}, bé bớt đi ${b}. Còn lại bao nhiêu ${object}?`,a,{type:'subtract',object,start:a+b,removed:b});
  const left=i%5+1,right=(i+2)%5+1,more=i%2===0;
  add(5,`Nhóm ${object} nào ${more?'nhiều hơn':'ít hơn'}?`,(more?left>right:left<right)?'Nhóm A':'Nhóm B',{type:'compare',object,groups:[left,right]},['Nhóm A','Nhóm B','Hai nhóm bằng nhau']);
  add(10,`${object[0].toUpperCase()+object.slice(1)} nằm ở phía nào của chiếc hộp?`,['trên','dưới','trái','phải'][i%4],{type:'position',object,reference:'chiếc hộp',position:['trên','dưới','trái','phải'][i%4]},i%4<2?['trên','dưới','trong']:['trái','phải','trong']);
  add(11,`Trong ba hình, ${object} xuất hiện hai lần. Bé tìm hình khác loại nhé!`,objects[(i+3)%10],{type:'odd_or_match',items:[object,objects[(i+3)%10],object]},[object,objects[(i+3)%10],objects[(i+5)%10]]);
  const operation=i%2?'subtract':'add';
  add(13,i%2?`Bé có ${a+b} ${object}, chia cho bạn ${a}. Phần của bé còn mấy ${object}?`:`Hai rổ có ${a} và ${b} ${object}. Cho chung một rổ thì có bao nhiêu?`,i%2?b:a+b,{type:'grouping',object,groups:i%2?[a+b,a]:[a,b],operation});
  const sequence=[object,objects[(i+2)%10],objects[(i+6)%10]],targetIndex=i%3;
  add(14,`Nhớ nhóm ${object}, ${sequence[1]} và ${sequence[2]}: hình thứ ${targetIndex+1} là gì?`,sequence[targetIndex],{type:'memory',sequence,targetIndex,displaySeconds:5},sequence);
}
const shapes=['hình tròn','hình vuông','hình tam giác','hình chữ nhật','hình ngôi sao'];
const shapePrompts=[
  ['Bé chọn hình tròn giống mặt đồng hồ nhé!',0],['Khăn tay có bốn cạnh bằng nhau giống hình nào?',1],
  ['Mái nhà có ba cạnh giống hình nào?',2],['Cánh cửa dài có bốn góc vuông giống hình nào?',3],
  ['Hình nào có năm cánh nhọn như ngôi sao trên trời?',4],['Hình nào không có góc và không có cạnh thẳng?',0],
  ['Hình nào có bốn cạnh bằng nhau và bốn góc vuông?',1],['Hình nào có đúng ba góc?',2],
  ['Hình nào có hai cạnh dài, hai cạnh ngắn và bốn góc vuông?',3],['Bé tìm hình giống ngôi sao trên lá cờ nhé!',4],
];
for(const [prompt,n] of shapePrompts) add(6,prompt,shapes[n],{type:'shape',target:shapes[n]},[shapes[n],shapes[(n+1)%5],shapes[(n+2)%5]]);
const colorObjects=['quả bóng','bông hoa','chiếc ô','chiếc xe','con cá'];
for(let i=0;i<10;i++) {
  const color=i<5?'hồng':'cam',object=colorObjects[i%5];
  add(7,`Bé tìm ${object} màu ${color} nhé!`,color,{type:'color',object,color},[color,'xanh lá','xanh dương']);
  const a=symbols[i],b=symbols[(i+1)%10];
  const sequence=i%2?[a,a,b,a,a]:[a,b,b,a,b];
  add(8,`Dãy ${objects[i]} và ${objects[(i+1)%10]} lặp lại như thế nào? Bé chọn hình tiếp theo nhé!`,b,{type:'pattern',sequence},[a,b,symbols[(i+3)%10]]);
}
for(let i=0;i<5;i++) {
  const object=objects[i],large=`${object} lớn`,small=`${object} nhỏ`;
  for(const bigger of [true,false]) add(9,`Trong hai ${object}, bé chọn hình ${bigger?'to':'nhỏ'} hơn nhé!`,bigger?large:small,{type:'size',items:[large,small],relation:bigger?'to hơn':'nhỏ hơn'},[large,small]);
}
const logic=[
  ['Con nào cho chúng mình sữa?', 'Bò', ['Bò','Bướm','Ốc sên'],'🐄'],
  ['Con nào có chiếc mai cứng trên lưng?', 'Rùa', ['Rùa','Mèo','Ong'],'🐢'],
  ['Con nào có chiếc vòi dài?', 'Voi', ['Voi','Gà','Cá'],'🐘'],
  ['Con nào có chiếc cổ rất dài?', 'Hươu cao cổ', ['Hươu cao cổ','Rùa','Mèo'],'🦒'],
  ['Con nào làm ra mật ngọt?', 'Ong', ['Ong','Cá','Cừu'],'🐝'],
  ['Quả nào có nhiều múi bên trong?', 'Cam', ['Cam','Chuối','Dâu'],'🍊'],
  ['Củ nào thường có màu cam và mọc dưới đất?', 'Cà rốt', ['Cà rốt','Nho','Chuối'],'🥕'],
  ['Đồ vật nào có bánh xe để đi trên đường?', 'Xe', ['Xe','Ô','Gối'],'🚗'],
  ['Khi vẽ lên giấy, bé dùng đồ vật nào?', 'Bút', ['Bút','Cốc','Đôi dép'],'✏️'],
  ['Đồ vật nào giúp bé che nắng khi đội lên đầu?', 'Mũ', ['Mũ','Chiếc thìa','Đồng hồ'],'🧢'],
];
for(const [prompt,answer,options,symbol] of logic) add(12,prompt,answer,{type:'logic',symbol},options);
const stories=[
 ['Lan đặt 2 quả lê vào rổ. Mẹ đặt thêm 3 quả lê. Rổ có mấy quả lê?',0,2,3],
 ['Bé hái 3 quả dâu, chị hái thêm 3 quả dâu. Hai chị em có mấy quả dâu?',1,3,3],
 ['Cửa hàng có 1 quả dứa, cô mang thêm 4 quả dứa. Có tất cả mấy quả dứa?',2,1,4],
 ['Có 2 con rùa bên hồ, 2 con rùa bò tới. Bên hồ có mấy con rùa?',3,2,2],
 ['Có 3 con bướm đậu trên hoa, thêm 1 con bướm bay đến. Có mấy con bướm?',4,3,1],
 ['Có 4 con ong tìm mật, thêm 2 con ong tới cùng. Có tất cả mấy con ong?',5,4,2],
 ['Dưới lá có 1 con ốc sên, thêm 2 con ốc sên bò đến. Có mấy con ốc sên?',6,1,2],
 ['Có 3 con cừu trong chuồng, thêm 4 con cừu đi vào. Có mấy con cừu?',7,3,4],
 ['Bà luộc 2 bắp ngô rồi luộc thêm 4 bắp ngô. Bà có mấy bắp ngô?',8,2,4],
 ['Bé xếp 4 quả nho lên đĩa rồi thêm 4 quả nho nữa. Đĩa có mấy quả nho?',9,4,4],
];
for(const [prompt,n,a,b] of stories) add(15,prompt,a+b,{type:'story',object:objects[n],groups:[a,b]});
writeFileSync(new URL('../src/data/extraQuestions.json',import.meta.url),JSON.stringify(entries,null,2)+'\n');
