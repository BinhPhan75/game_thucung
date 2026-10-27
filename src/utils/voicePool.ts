/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PetType = 'dog' | 'cat' | 'bunny';

export const PET_DEFAULT_ITEMS: Record<PetType, { food: string; drink: string }> = {
  bunny: { food: 'cà rốt và táo', drink: 'nước lọc' },
  dog: { food: 'xương và thịt', drink: 'sữa tươi' },
  cat: { food: 'cá tươi', drink: 'sữa tươi' },
};

// Templates use the chosen pet's name, child name, and synchronized food/drink items
export const VOICE_POOLS = {
  "wrong": [
    "Không sao đâu {child} ơi, mình thử nhìn lại một lần nữa xem sao nha!",
    "Suýt soát đúng rồi nè! {child} nhìn kỹ lại cùng {pet} một chút nhé!",
    "{child} cố gắng lắm rồi! Mình thử lại câu này nhé, {pet} tin bạn làm được!",
    "Đừng lo nha {child}, ai cũng có lúc nhầm mà. Mình quan sát lại cùng {pet} nhé!",
    "Ồ, chưa đúng rồi nè. {child} thử chọn lại đáp án khác cùng {pet} xem sao nhé!",
    "Chưa đúng rồi, không sao đâu! {child} nhìn lại một chút nhé.",
    "Mình thử thêm lần nữa nha! {child} làm được mà.",
    "{child} cứ từ từ nhé. Mình cùng quan sát lại nào!",
    "Không vội đâu {child} ơi! Mình nhìn kỹ từng hình nhé.",
    "Mỗi lần thử là một lần học thêm. Cố lên {child} nhé!",
    "{pet} đang cổ vũ {child} nè! Mình thử lại nha.",
    "{child} thử nghe lại câu hỏi rồi chọn nhé!",
    "Không sao hết! {pet} cùng {child} học tiếp nè."
  ],
  "correct": [
    "Chính xác tuyệt vời! {child} giỏi quá đi thôi, {pet} tự hào về bạn lắm!",
    "Tuyệt vời ông mặt trời! {child} làm đúng rồi nè, {pet} thích lắm!",
    "Hoan hô {child}! {pet} chấm điểm mười cho sự thông minh của bạn nhé!",
    "Đúng siêu chuẩn luôn! {child} của {pet} thông minh quá đi thôi!",
    "Giỏi quá chừng! {child} xứng đáng nhận được món quà ngon lành này từ {pet}!",
    "{child} chọn đúng rồi! Cùng {pet} làm tiếp câu nữa nhé!",
    "Chính xác rồi! {child} giỏi quá đi thôi, {pet} vui lắm!",
    "Tuyệt vời! {child} và {pet} cùng cố gắng phát huy nhé!",
    "{child} làm được rồi! {pet} vui sướng lắm đó!",
    "Đúng rồi đó! {child} quan sát thật cẩn thận cùng {pet}!",
    "Một câu trả lời thật tuyệt! {pet} và {child} cùng cười thật tươi nào!",
    "Chính xác rồi! {child} giỏi quá đi thôi!",
    "Đúng siêu chuẩn luôn! Thưởng cho {child} một nụ cười nè.",
    "Hoan hô {child}! Bé thông minh quá chừng!",
    "{pet} gửi {child} một cái ôm nè! Đúng rồi đó!",
    "{child} quan sát tinh mắt quá! Mình cùng vỗ tay nào!",
    "Một ngôi sao xinh dành cho {child}! Tuyệt lắm!",
    "Mình cùng đập tay nào! {child} chọn đúng rồi!",
    "{child} kiên nhẫn và làm được rồi! Tự hào về bé quá!",
    "Giỏi quá! {child} vừa khám phá thêm một điều mới!",
    "Tặng {child} một tràng pháo tay thật to nào!"
  ],
  "foodFull": [
    "{child} ơi, bụng {pet} đã no căng tròn {food} rồi nè! Giờ cho {pet} uống chút {drink} nha!",
    "{pet} no bụng rồi {child} ạ, cảm ơn bạn nhiều nha! Giờ mình đi kiếm {drink} giải khát thôi nào!",
    "Ăn no thích quá đi! Nhưng {pet} hơi khát rồi, {child} giúp {pet} kiếm {drink} nhé!",
    "{child} ơi, {pet} đã ăn no căng bụng rồi! Giờ cho {pet} uống {drink} nha.",
    "Bụng no căng rồi {child} ạ! Mình đi kiếm {drink} cho {pet} nhé.",
    "{pet} ăn ngon và no rồi! {child} cùng làm toán kiếm {drink} cho {pet} nào!",
    "Cảm ơn {child} cho ăn thật ngon! Giờ {pet} cần uống thêm {drink} đó.",
    "Bữa ăn xong rồi! {child} cùng tìm {drink} cho {pet} nhé!",
    "{pet} no bụng rồi {child} ơi! Bạn bấm vào phần {drink} để chăm {pet} tiếp nha.",
    "Chiếc bụng đã ấm rồi! Một ly {drink} nữa là {pet} vui lắm!",
    "{child} chăm bạn ăn giỏi quá! Giờ {pet} cần {drink} nha!",
    "Xong phần thức ăn rồi! {child} giúp {pet} uống đủ {drink} nhé!"
  ],
  "waterFull": [
    "{drink} ngon quá, {pet} đã hết khát rồi! Nhưng bụng {pet} đang reo đói nè, {child} kiếm {food} cho {pet} nhé!",
    "{pet} uống đủ {drink} rồi {child} ơi! Giờ mình sang làm toán kiếm {food} ngon cho {pet} nha!",
    "Uống {drink} đã quá! Nhưng {pet} còn đói bụng, {child} kiếm thêm {food} cho {pet} ăn nha.",
    "Đã giải khát xong! Giờ {child} cùng {pet} sang làm toán kiếm {food} thôi nào.",
    "{pet} uống đủ {drink} rồi! {child} cùng chuẩn bị một bữa {food} ngon cho {pet} nhé!",
    "{drink} thật là ngon! Giờ {child} giúp {pet} tìm {food} cho {pet} nha.",
    "Cảm ơn {child}! {pet} hết khát rồi, nhưng chiếc bụng còn đang chờ {food} đó!",
    "Mình chăm phần {drink} xong rồi! {child} bấm vào phần {food} để giúp {pet} no bụng nhé.",
    "Uống đủ {drink} thật khỏe! Mình cùng kiếm {food} cho {pet} nào!",
    "{child} cho {pet} uống giỏi lắm! Giờ đến phần ăn {food} nha!",
    "Một bữa {food} ngon đang chờ! {child} giúp {pet} nhé!"
  ],
  "levelUp": [
    "Chúc mừng {child} và bạn {pet}! Cả hai đã cùng nhau đạt cấp {level} xuất sắc!",
    "Chúc mừng {child} yêu! {pet} đã lớn khôn và khỏe mạnh xuất sắc lên cấp {level} nhờ sự chăm sóc của bạn đấy!",
    "Woa, {pet} đã được {child} nuôi thăng cấp {level} mới rồi! {child} chăm ngoan và thông minh quá đi mất!",
    "Tuyệt vời quá {child} ơi! {pet} đã lớn lên cấp {level} rồi nè, bạn có muốn vào tủ đồ chọn trang phục đẹp cho {pet} không?",
    "Chúc mừng {child}! {pet} đã lớn khôn và khỏe mạnh rồi! Bạn đã lên cấp {level} đó!",
    "Oa! {pet} đã lên cấp {level} nhờ sự chăm sóc tuyệt vời của {child} đó!",
    "Tuyệt vời quá! Nhờ {child} chăm sóc, {pet} đã lớn lên rồi! Chào mừng cấp {level}!",
    "Mình cùng vỗ tay nào! {pet} vừa lên cấp {level}! Cảm ơn {child} thật nhiều!",
    "Ăn no, uống đủ, vui quá đi thôi! {child} và {pet} đã lên cấp {level} rồi nè!",
    "{child} chăm sóc bạn thật chu đáo! {pet} lên cấp {level} rồi, cùng ăn mừng nào!",
    "Một bất ngờ thật vui! {child} và {pet} đã đạt cấp {level}! Cùng lớn khôn nhé!",
    "Hoan hô! {pet} khỏe mạnh và lên cấp {level} rồi! {child} làm tốt lắm!",
    "Thêm một bước lớn khôn! {pet} lên cấp {level} rồi nè!",
    "Cùng reo vui nào {child} ơi! {pet} đã đạt cấp {level}!",
    "{child} vừa học giỏi vừa chăm {pet} chu đáo! Chúc mừng cấp {level}!",
    "Một ngày học vui, một lần lớn khôn! {pet} đã lên cấp {level}!"
  ]
} as const;

export type VoiceEvent = keyof typeof VOICE_POOLS;
export interface VoiceContext { 
  name?: string; 
  childName?: string; 
  level?: number; 
  type?: PetType;
  foodName?: string;
  drinkName?: string;
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
      ? (/^bé(?:\s|$)/i.test(rawChild) ? rawChild : `bé ${rawChild}`)
      : 'bé';

    const defaultItems = (context.type && PET_DEFAULT_ITEMS[context.type]) || PET_DEFAULT_ITEMS.bunny;
    const foodVal = context.foodName || defaultItems.food;
    const drinkVal = context.drinkName || defaultItems.drink;

    return pool[index].replace(/\{pet\}|\{child\}|\{level\}|\{food\}|\{drink\}/g, (token) => {
      if (token === '{pet}') return context.name?.trim() || 'bạn thú cưng';
      if (token === '{child}') return childReplacement;
      if (token === '{food}') return foodVal;
      if (token === '{drink}') return drinkVal;
      return String(context.level ?? 1);
    });
  };
}

export const pickVoiceLine = createVoicePicker();
