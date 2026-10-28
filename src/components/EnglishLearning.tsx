import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createEnglishPicker, englishTopics, englishWords } from '../data/englishData.js';
import { GamePicture } from './GamePicture';
import { getGoogleSpeechPlayer } from '../utils/googleSpeech';
import { speakEnglish, stopSpeech, playCelebrationSound, speakVietnamese } from '../utils/audio';
import { questReward } from '../utils/questReward';
import type { PetState } from '../types/game';

type Word = typeof englishWords[number];
function WordPicture({ word }: { word: Word }) {
  if (word.symbol) return <GamePicture symbol={word.symbol}/>;
  return <svg viewBox="0 0 100 100" aria-hidden="true" className="english-vector">
    <g fill={word.color} stroke="#334155" strokeWidth="2">
      {word.shape==='circle' && <circle cx="50" cy="50" r="39"/>}
      {word.shape==='square' && <rect x="12" y="12" width="76" height="76" rx="3"/>}
      {word.shape==='triangle' && <path d="M50 8 94 90H6Z"/>}
    </g>
  </svg>;
}

interface Props {
  pet: PetState;
  onUpdatePet: (pet: PetState) => void;
  onClose: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export function EnglishLearning({ pet, onUpdatePet, onClose, isMuted, onToggleSound }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<'menu'|'learn'|'quiz'>('menu');
  const [topic, setTopic] = useState('animals');
  const [pick] = useState(() => createEnglishPicker());
  const [question, setQuestion] = useState<ReturnType<typeof pick> | null>(null);
  const [feedback, setFeedback] = useState('');
  const [solved, setSolved] = useState(false);
  const rewarded = useRef(false);
  const [activeWord, setActiveWord] = useState('');
  const speech = getGoogleSpeechPlayer();
  const status = useSyncExternalStore(speech.subscribe, speech.getStatus);

  useEffect(() => {
    const element=dialog.current!;
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow=overflow;
      stopSpeech();
    };
  }, []);

  const read = (word: string) => { stopSpeech(); speakEnglish(word); };
  const next = () => {
    const nextQuestion=pick();
    rewarded.current=false;
    setSolved(false); setFeedback(''); setQuestion(nextQuestion); setMode('quiz');
    read(nextQuestion.target.word); // Start media directly in the user's click gesture.
  };
  const answer = (word: Word) => {
    if (!question || rewarded.current) return;
    stopSpeech();
    if (word.id!==question.target.id) {
      setFeedback('Gần đúng rồi! Bé nghe lại và thử thêm lần nữa nhé.');
      speakVietnamese('Bé nghe lại rồi thử thêm lần nữa nhé!');
      speakEnglish(question.target.word);
      return;
    }
    rewarded.current=true; // Prevent rapid taps from awarding the same question twice.
    setSolved(true);
    const target=pet.hunger<=pet.thirst?'food':'water';
    onUpdatePet(questReward(pet,target));
    setFeedback(`Chính xác! +10 xu · +25 EXP · +30 ${target==='food'?'độ no':'nước uống'}`);
    if (!isMuted) playCelebrationSound();
    const praise=['Well done!','Great job!','Wonderful!','You did it!','Excellent!'];
    speakEnglish(`${praise[Math.floor(Math.random()*praise.length)]} ${question.target.word}!`);
  };
  const menu = () => { stopSpeech(); setMode('menu'); setFeedback(''); };

  return <dialog ref={dialog} className="english-dialog" aria-labelledby="english-title" onCancel={event=>{event.preventDefault();onClose();}}>
    <div className="english-shell">
      <header className="english-header">
        <h2 id="english-title">ABC Học Tiếng Anh</h2>
        <button onClick={onToggleSound} aria-label={isMuted?'Bật âm thanh':'Tắt âm thanh'}>{isMuted?'🔇':'🔊'}</button>
        <button onClick={onClose} aria-label="Đóng học tiếng Anh">✕</button>
      </header>
      <div className="english-body">
        {mode==='menu' && <div className="english-menu">
          <span className="english-badge" aria-hidden="true">ABC</span>
          <h3>Cùng nghe, cùng nói, cùng chơi!</h3>
          <p>Bé chọn một cách học nhé.</p>
          <button onClick={()=>{setMode('learn');stopSpeech();}}>📖 1. Phần Tự Học<small>Chạm thẻ để nghe và đọc theo</small></button>
          <button onClick={next}>⭐ 2. Phần Bài Tập<small>Nghe từ, chọn hình và chăm thú cưng</small></button>
        </div>}
        {mode==='learn' && <>
          <nav className="english-topics" aria-label="Chủ đề tiếng Anh">{englishTopics.map(item=><button key={item.id} aria-pressed={topic===item.id} onClick={()=>{stopSpeech();setActiveWord('');setTopic(item.id);}}>{item.label}</button>)}</nav>
          <p className="english-hint">Chạm một thẻ rồi đọc theo giọng tiếng Anh nhé!</p>
          <div className="english-cards">{englishWords.filter(word=>word.topic===topic).map(word=><button key={word.id} className={activeWord===word.id?'is-active':''} onClick={()=>{setActiveWord(word.id);read(word.word);}} aria-label={`Nghe ${word.word}, ${word.meaning}`}>
            <span className="english-picture"><WordPicture word={word}/></span>
            <strong lang="en">{word.word}</strong><small>{word.meaning}</small>
          </button>)}</div>
        </>}
        {mode==='quiz' && question && <div className="english-quiz">
          <h3>Bé nghe và chọn hình đúng nhé!</h3>
          <button className="english-listen" disabled={isMuted} onClick={()=>read(question.target.word)}>🔊 Nghe lại từ</button>
          <p className="english-target">Bé hãy tìm: <strong lang="en">{question.target.word}</strong></p>
          <div className="english-options">{question.options.map(word=><button key={word.id} disabled={solved} className={solved && word.id===question.target.id?'is-correct':''} onClick={()=>answer(word)} aria-label={word.word}>
            <span className="english-picture"><WordPicture word={word}/></span><strong lang="en">{word.word}</strong>
          </button>)}</div>
          <p role="status" className="english-feedback">{feedback || 'Chọn một trong ba hình bên trên.'}</p>
          {solved && <button className="english-next" onClick={next}>Câu tiếp theo →</button>}
        </div>}
      </div>
      <footer className="english-footer">
        {status==='blocked' || status==='error' ? <button onClick={speech.retry} disabled={isMuted}>🔊 Chạm để thử phát lại</button> : <span role="status">{isMuted?'Âm thanh đang tắt':status==='loading'?'Đang tải giọng đọc…':status==='playing'?'Bé lắng nghe nhé!':'Mỗi ngày học thêm một từ mới!'}</span>}
        <div>{mode!=='menu' && <button onClick={menu}>← Chọn phần học</button>}<button onClick={onClose}>🏡 Về sân vườn</button></div>
      </footer>
    </div>
  </dialog>;
}
