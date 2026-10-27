import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import confetti from 'canvas-confetti';
import { PetState, QuestTarget } from '../types/game';
import { COSTUME_LIST } from '../data/costumes';
import { Question } from '../data/mathQuestions';
import { makePlayableQuestion } from '../data/questionBank';
import { BankExercise } from './BankExercise';
import { ObjectPicture, CountPictures, SpatialPicture } from './MathVisuals';
import { PetAvatar } from './PetAvatar';
import { questReward } from '../utils/questReward';
import { getPetItemConfig } from '../utils/petItems';
import { pickVoiceLine } from '../utils/voicePool';
import { getGoogleSpeechPlayer } from '../utils/googleSpeech';
import { speakVietnamese, stopSpeech, playCelebrationSound, playEncouragingSound } from '../utils/audio';

interface Props {
  pet: PetState; onUpdatePet: (pet: PetState) => void; onClose: () => void;
  onFinishAndFeed: (target: QuestTarget) => void; questTarget?: QuestTarget; targetCostumeId?: string;
  isMuted: boolean; onToggleSound: () => void;
  initialQuestion?: Question;
}
export const Module3MathQuest: React.FC<Props> = ({ pet, onUpdatePet, onClose, onFinishAndFeed,
  questTarget = 'food', targetCostumeId, isMuted, onToggleSound, initialQuestion }) => {
  const [target, setTarget] = useState(questTarget);
  const [question, setQuestion] = useState<Question>(() => initialQuestion ?? makePlayableQuestion());
  const spokenQuestion = useRef<Question | null>(initialQuestion ?? null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState('');
  const answered = useRef(false);
  const speech = getGoogleSpeechPlayer();
  const speechStatus = useSyncExternalStore(speech.subscribe, speech.getStatus);
  const costume = COSTUME_LIST.find(c => c.id === targetCostumeId);
  const items = getPetItemConfig(pet.type);
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; stopSpeech(); };
  }, []);
  useEffect(() => {
    if (spokenQuestion.current === question) return;
    stopSpeech(); speakVietnamese(question.prompt);
  }, [question]);
  const changeQuestion = () => {
    if (target === 'costume' && answered.current) return;
    answered.current = false;
    setFeedback('idle'); setMessage(''); setSelected('');
    const next = makePlayableQuestion();
    spokenQuestion.current = next;
    stopSpeech(); speakVietnamese(next.prompt); // play() runs inside the click gesture.
    setQuestion(next);
  };
  const answer = (id: string) => {
    if (answered.current) return;
    setSelected(id); stopSpeech();
    if (id !== question.answer) {
      const line = pickVoiceLine('wrong', pet);
      setFeedback('wrong'); setMessage(line);
      if (!isMuted) playEncouragingSound();
      speakVietnamese(line); return;
    }
    answered.current = true;
    const line = pickVoiceLine('correct', pet);
    setFeedback('correct'); setMessage(line);
    if (!isMuted) playCelebrationSound();
    speakVietnamese(line);
    confetti({ particleCount: 45, spread: 65, origin: { y: 0.5 } });
    onUpdatePet(questReward(pet, target, costume));
  };
  const full = target === 'food' ? pet.hunger >= 100 : pet.thirst >= 100;
  const choicePictures = ['shape', 'color', 'size', 'comparison'].includes(question.kind);
  return <div className="math-overlay" role="dialog" aria-modal="true" aria-labelledby="math-title"><section className="math-panel">
    <header className="math-header">
      <div><h2 id="math-title">{target === 'costume' ? '🎁 Nhận trang phục' : target === 'water' ? `${items.drinkEmoji} Học vui kiếm ${items.drinkName}` : `${items.foodEmoji} Học vui kiếm ${items.foodShortName}`}</h2>
        <span>{target === 'costume' ? costume?.name : `${pet.name} · Cấp ${pet.level}`} · 💰 {pet.coins}</span></div>
      <div className="math-header-actions">
        <button onClick={() => { onToggleSound(); if (isMuted) speakVietnamese(feedback === 'idle' ? question.prompt : message); }} aria-label={isMuted ? 'Bật giọng đọc' : 'Tắt giọng đọc'}>{isMuted ? '🔇' : '🔊'}</button>
        <button onClick={() => { stopSpeech(); onClose(); }} aria-label="Đóng bài học">✕</button>
      </div>
    </header>
    {feedback === 'correct' ? <div className="math-result">
      <div className="result-pet"><PetAvatar type={pet.type} stage={pet.stage} size="md" equippedHat={pet.equippedHat} /></div>
      <h3>{message}</h3><p>{target === 'costume' ? `Đã mở khóa và mặc ${costume?.name ?? 'trang phục'}!` : target === 'food' ? `${items.foodEmoji} +30% độ no bụng` : `${items.drinkEmoji} +30% nước uống`} · 💰 +10 xu</p>
      <div className="result-actions">
        {target !== 'costume' && !(pet.hunger >= 100 && pet.thirst >= 100) && <button className="primary" onClick={() => { if (full) setTarget(target === 'food' ? 'water' : 'food'); changeQuestion(); }}>{full ? (target === 'food' ? `${items.drinkEmoji} ${items.drinkButtonLabel}` : `${items.foodEmoji} ${items.foodButtonLabel}`) : 'Câu tiếp theo →'}</button>}
        <button className={target === 'costume' ? 'primary' : ''} onClick={() => { stopSpeech(); onFinishAndFeed(target); }}>{target === 'costume' ? '🏡 VỀ SÂN VƯỜN NGẮM THÚ CƯNG' : '🏡 Về sân vườn'}</button>
      </div>
    </div> : <>
      <div className="math-prompt"><h3>{question.prompt}</h3><button disabled={isMuted} onClick={() => { stopSpeech(); speakVietnamese(question.prompt); }} aria-label="Nghe lại câu hỏi">🔊</button></div>
      {question.bank ? <BankExercise key={question.bank.id} question={question} selected={selected} wrong={feedback === 'wrong'} onAnswer={answer}/> : <div className={`math-workspace ${choicePictures ? 'picture-answers' : ''}`}>
        {!choicePictures && <div className="math-scene">{question.kind === 'space' ? <SpatialPicture question={question} /> : question.kind === 'addition' ? <div className="addition-scene"><CountPictures emoji={question.emoji!} count={question.addends![0]} /><b>+</b><CountPictures emoji={question.emoji!} count={question.addends![1]} /><b>= ?</b></div> : <CountPictures emoji={question.emoji!} count={question.count!} />}</div>}
        <div className={`math-choices choices-${question.choices.length}`}>{question.choices.map((choice, index) => <button key={choice.id} aria-label={choicePictures ? `${choice.label}, lựa chọn ${index+1}` : choice.label} className={feedback === 'wrong' && selected === choice.id ? 'try-again' : ''} onClick={() => answer(choice.id)}>{choicePictures ? <>{choice.count !== undefined ? <CountPictures emoji={choice.emoji!} count={choice.count} /> : <ObjectPicture choice={choice} />}<span className="choice-badge">{index+1}</span></> : choice.label}</button>)}</div>
      </div>}<p className="math-feedback" role="status">{feedback === 'wrong' ? message : 'Chạm vào đáp án bé chọn nhé!'}</p>
    </>}
    <footer className="math-footer">{(speechStatus === 'blocked' || speechStatus === 'error') && !isMuted ? <button onClick={speech.retry}>🔊 {speechStatus === 'blocked' ? 'Chạm để nghe' : 'Chưa tải được giọng. Thử lại'}</button> : <span>{isMuted ? '🔇 Đã tắt giọng đọc' : speechStatus === 'loading' ? 'Đang tải giọng đọc…' : speechStatus === 'playing' ? '🔊 Đang đọc…' : '🌼 Mỗi lần thử là một lần học thêm!'}</span>}<small className="math-copyright">Bản quyền thuộc về HoangMy@2026</small></footer>
  </section></div>;
};
