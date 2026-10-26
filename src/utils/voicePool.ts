// Templates use the chosen pet's name, rather than assuming every pet is a rabbit.
export const VOICE_POOLS = {
  wrong: [
    'Không sao đâu bé ơi, mình thử đếm lại một lần nữa xem sao nha!',
    'Suýt soát đúng rồi nè! Bé nhìn kỹ lại một chút nhé!',
    'Bé cố gắng lắm rồi! Mình thử lại câu này nhé, {pet} tin bé làm được!',
    'Đừng lo nha bé, ai cũng có lúc nhầm mà. Mình đếm chậm lại cùng {pet} nhé!',
    'Ồ, chưa đúng rồi nè. Bé thử chọn lại đáp án khác xem sao nhé!',
  ],
  correct: [
    'Chính xác rồi! Bé của {pet} thông minh quá đi thôi!',
    'Tuyệt vời ông mặt trời! Bé làm đúng rồi nè!',
    'Hoan hô bé! Đặt một điểm mười cho sự thông minh của bé nhé!',
    'Đúng siêu chuẩn luôn! Bé giỏi thế này {pet} thích lắm đấy!',
    'Giỏi quá chừng! Bé xứng đáng nhận được món quà ngon lành này!',
    'Bé tính chuẩn quá! Cùng làm tiếp câu nữa nhé!',
    'Chính xác rồi! Bé giỏi quá đi thôi!',
    'Tuyệt vời! Cố gắng phát huy bé nhé!',
    'Bé làm được rồi! {pet} vui lắm đó!',
    'Đúng rồi đó! Bé quan sát thật cẩn thận!',
    'Một câu trả lời thật tuyệt! Mình cùng cười thật tươi nào!',
  ],
  foodFull: [
    'Bé ơi, bụng {pet} đã no căng tròn rồi nè! Giờ cho {pet} uống chút nước mát nha!',
    '{pet} no bụng rồi bé ạ, cảm ơn bé nhiều nha! Giờ mình đi kiếm sữa giải khát thôi nào!',
    'Ăn no thích quá đi! Nhưng {pet} hơi khát nước rồi, bé giúp {pet} kiếm nước uống nhé!',
    'Bé ơi, {pet} đã ăn no căng bụng rồi! Giờ cho bạn uống nước mát nha.',
    'Bụng no căng rồi bé ạ! Mình đi kiếm sữa cho {pet} nhé.',
    '{pet} ăn ngon và no rồi! Bé cùng làm toán kiếm nước cho bạn nào!',
    'Cảm ơn bé cho ăn thật ngon! Giờ {pet} cần uống thêm nước đó.',
    'Bữa ăn xong rồi! Mình cùng tìm nước mát cho {pet} nhé!',
    '{pet} no bụng rồi bé ơi! Bé bấm vào phần nước uống để chăm bạn tiếp nha.',
  ],
  waterFull: [
    'Nước mát quá, {pet} đã hết khát rồi! Nhưng bụng {pet} đang reo đói nè, bé kiếm táo cho {pet} nhé!',
    '{pet} uống đủ nước rồi bé ơi! Giờ mình sang làm toán kiếm đồ ăn ngon cho {pet} nha!',
    'Uống nước đã quá! Nhưng {pet} còn đói bụng, bé kiếm thêm táo cho {pet} ăn nha.',
    'Đã giải khát xong! Giờ mình sang làm toán kiếm đồ ăn cho {pet} thôi bé ơi.',
    '{pet} uống đủ nước rồi! Mình cùng chuẩn bị một bữa ăn ngon nhé!',
    'Nước mát thật là ngon! Giờ bé giúp {pet} tìm thức ăn cho {pet} nha.',
    'Cảm ơn bé! {pet} hết khát rồi, nhưng chiếc bụng còn đang chờ đồ ăn đó!',
    'Mình chăm phần nước xong rồi! Bé bấm vào phần thức ăn để giúp {pet} no bụng nhé.',
  ],
  levelUp: [
    'Chúc mừng bé yêu! {pet} đã lớn khôn và khỏe mạnh xuất sắc lên cấp {level} nhờ sự chăm sóc của bé đấy!',
    'Woa, {pet} đã được thăng cấp {level} mới rồi! Bé chăm ngoan và thông minh quá đi mất!',
    'Tuyệt vời quá bé ơi! {pet} đã lớn lên cấp {level} rồi nè, bé có muốn vào tủ đồ chọn trang phục đẹp cho {pet} không?',
    'Chúc mừng bé! {pet} đã lớn khôn và khỏe mạnh rồi! Bạn đã lên cấp {level} đó!',
    'Oa! {pet} đã lên cấp {level} nhờ sự chăm sóc tuyệt vời của bé đó!',
    'Tuyệt vời quá! Nhờ bé chăm sóc, {pet} đã lớn lên rồi! Chào mừng cấp {level}!',
    'Mình cùng vỗ tay nào! {pet} vừa lên cấp {level}! Cảm ơn bé thật nhiều!',
    'Ăn no, uống đủ, vui quá đi thôi! {pet} đã lên cấp {level} rồi bé ơi!',
    'Bé chăm sóc bạn thật chu đáo! {pet} lên cấp {level} rồi, cùng ăn mừng nào!',
    'Một bất ngờ thật vui! {pet} đã đạt cấp {level}! Bé và bạn cùng lớn khôn nhé!',
    'Hoan hô! {pet} khỏe mạnh và lên cấp {level} rồi! Bé làm tốt lắm!',
  ],
} as const;

export type VoiceEvent = keyof typeof VOICE_POOLS;
interface VoiceContext { name?: string; level?: number }

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
    return pool[index].replace(/\{pet\}|\{level\}/g, token =>
      token === '{pet}' ? context.name?.trim() || 'bạn thú cưng' : String(context.level ?? 1));
  };
}

export const pickVoiceLine = createVoicePicker();
