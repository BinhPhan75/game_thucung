// Templates use the chosen pet's name, rather than assuming every pet is a rabbit.
export const VOICE_POOLS = {
  wrong: [
    'Không sao đâu {child} ơi, mình thử đếm lại một lần nữa xem sao nha!',
    'Suýt soát đúng rồi nè! {child} nhìn kỹ lại cùng {pet} một chút nhé!',
    '{child} cố gắng lắm rồi! Mình thử lại câu này nhé, {pet} tin bạn làm được!',
    'Đừng lo nha {child}, ai cũng có lúc nhầm mà. Mình đếm chậm lại cùng {pet} nhé!',
    'Ồ, chưa đúng rồi nè. {child} thử chọn lại đáp án khác cùng {pet} xem sao nhé!',
  ],
  correct: [
    'Chính xác tuyệt vời! {child} giỏi quá đi thôi, {pet} tự hào về bạn lắm!',
    'Tuyệt vời ông mặt trời! {child} làm đúng rồi nè, {pet} thích lắm!',
    'Hoan hô {child}! {pet} chấm điểm mười cho sự thông minh của bạn nhé!',
    'Đúng siêu chuẩn luôn! {child} của {pet} thông minh quá đi thôi!',
    'Giỏi quá chừng! {child} xứng đáng nhận được món quà ngon lành này từ {pet}!',
    '{child} tính chuẩn quá! Cùng {pet} làm tiếp câu nữa nhé!',
    'Chính xác rồi! {child} giỏi quá đi thôi, {pet} vui lắm!',
    'Tuyệt vời! {child} và {pet} cùng cố gắng phát huy nhé!',
    '{child} làm được rồi! {pet} vui sướng lắm đó!',
    'Đúng rồi đó! {child} quan sát thật cẩn thận cùng {pet}!',
    'Một câu trả lời thật tuyệt! {pet} và {child} cùng cười thật tươi nào!',
  ],
  foodFull: [
    '{child} ơi, bụng {pet} đã no căng tròn rồi nè! Giờ cho {pet} uống chút nước mát nha!',
    '{pet} no bụng rồi {child} ạ, cảm ơn bạn nhiều nha! Giờ mình đi kiếm sữa giải khát thôi nào!',
    'Ăn no thích quá đi! Nhưng {pet} hơi khát nước rồi, {child} giúp {pet} kiếm nước uống nhé!',
    '{child} ơi, {pet} đã ăn no căng bụng rồi! Giờ cho {pet} uống nước mát nha.',
    'Bụng no căng rồi {child} ạ! Mình đi kiếm sữa cho {pet} nhé.',
    '{pet} ăn ngon và no rồi! {child} cùng làm toán kiếm nước cho {pet} nào!',
    'Cảm ơn {child} cho ăn thật ngon! Giờ {pet} cần uống thêm nước đó.',
    'Bữa ăn xong rồi! {child} cùng tìm nước mát cho {pet} nhé!',
    '{pet} no bụng rồi {child} ơi! Bạn bấm vào phần nước uống để chăm {pet} tiếp nha.',
  ],
  waterFull: [
    'Nước mát quá, {pet} đã hết khát rồi! Nhưng bụng {pet} đang reo đói nè, {child} kiếm táo cho {pet} nhé!',
    '{pet} uống đủ nước rồi {child} ơi! Giờ mình sang làm toán kiếm đồ ăn ngon cho {pet} nha!',
    'Uống nước đã quá! Nhưng {pet} còn đói bụng, {child} kiếm thêm táo cho {pet} ăn nha.',
    'Đã giải khát xong! Giờ {child} cùng {pet} sang làm toán kiếm đồ ăn thôi nào.',
    '{pet} uống đủ nước rồi! {child} cùng chuẩn bị một bữa ăn ngon cho {pet} nhé!',
    'Nước mát thật là ngon! Giờ {child} giúp {pet} tìm thức ăn cho {pet} nha.',
    'Cảm ơn {child}! {pet} hết khát rồi, nhưng chiếc bụng còn đang chờ đồ ăn từ {pet} đó!',
    'Mình chăm phần nước xong rồi! {child} bấm vào phần thức ăn để giúp {pet} no bụng nhé.',
  ],
  levelUp: [
    'Chúc mừng {child} và bạn {pet}! Cả hai đã cùng nhau đạt cấp {level} xuất sắc!',
    'Chúc mừng {child} yêu! {pet} đã lớn khôn và khỏe mạnh xuất sắc lên cấp {level} nhờ sự chăm sóc của bạn đấy!',
    'Woa, {pet} đã được {child} nuôi thăng cấp {level} mới rồi! {child} chăm ngoan và thông minh quá đi mất!',
    'Tuyệt vời quá {child} ơi! {pet} đã lớn lên cấp {level} rồi nè, bạn có muốn vào tủ đồ chọn trang phục đẹp cho {pet} không?',
    'Chúc mừng {child}! {pet} đã lớn khôn và khỏe mạnh rồi! Bạn đã lên cấp {level} đó!',
    'Oa! {pet} đã lên cấp {level} nhờ sự chăm sóc tuyệt vời của {child} đó!',
    'Tuyệt vời quá! Nhờ {child} chăm sóc, {pet} đã lớn lên rồi! Chào mừng cấp {level}!',
    'Mình cùng vỗ tay nào! {pet} vừa lên cấp {level}! Cảm ơn {child} thật nhiều!',
    'Ăn no, uống đủ, vui quá đi thôi! {child} và {pet} đã lên cấp {level} rồi nè!',
    '{child} chăm sóc bạn thật chu đáo! {pet} lên cấp {level} rồi, cùng ăn mừng nào!',
    'Một bất ngờ thật vui! {child} và {pet} đã đạt cấp {level}! Cùng lớn khôn nhé!',
    'Hoan hô! {pet} khỏe mạnh và lên cấp {level} rồi! {child} làm tốt lắm!',
  ],
} as const;

export type VoiceEvent = keyof typeof VOICE_POOLS;
export interface VoiceContext { 
  name?: string; 
  childName?: string; 
  level?: number; 
}

// Each event has its own shuffle bag: use every phrase before repeating any.
export function createVoicePicker(random: () => number = Math.random) {
  const bags = new Map<VoiceEvent, number[]>();
  const previous = new Map<VoiceEvent, number>();
  return (event: VoiceEvent, context: VoiceContext = {}) => {
    const pool = VOICE_POOLS[event];
    let bag = bags.get(event);
    if (!bag?.length) {
      bag = pool.map((_, index) => index);
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      // pop() reads the end; prevent a repeat at the boundary of two bags.
      if (bag.length > 1 && bag[bag.length - 1] === previous.get(event)) {
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
      }
      bags.set(event, bag);
    }
    const index = bag.pop()!;
    previous.set(event, index);

    const rawChild = context.childName?.trim();
    const childReplacement = rawChild
      ? (/^bé\b/i.test(rawChild) ? rawChild : `bé ${rawChild}`)
      : 'bé';

    return pool[index].replace(/\{pet\}|\{child\}|\{level\}/g, (token) => {
      if (token === '{pet}') return context.name?.trim() || 'bạn thú cưng';
      if (token === '{child}') return childReplacement;
      return String(context.level ?? 1);
    });
  };
}

export const pickVoiceLine = createVoicePicker();
