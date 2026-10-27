import React from 'react';
import { Choice, Question } from '../data/mathQuestions';

export function ObjectPicture({ choice }: { choice: Choice }) {
  const color = choice.color ?? '#22c55e';
  const scale = choice.size ?? 1;
  return <svg viewBox="0 0 220 180" className="object-picture" aria-hidden="true">
    {choice.shape === 'circle' && <circle cx="110" cy="90" r="62" fill={color} />}
    {choice.shape === 'square' && <rect x="48" y="28" width="124" height="124" rx="4" fill={color} />}
    {choice.shape === 'triangle' && <path d="M110 20 185 150 35 150Z" fill={color} />}
    {choice.shape === 'rectangle' && <rect x="22" y="48" width="176" height="84" rx="4" fill={color} />}
    {choice.object === 'shirt' && <g fill={color} stroke="#334155" strokeWidth="3" strokeLinejoin="round">
      <path d="M75 28 38 44 16 86 51 104 65 81 65 156 155 156 155 81 169 104 204 86 182 44 145 28 Q110 60 75 28Z" />
      <path d="M94 36Q110 49 126 36" fill="none" />
    </g>}
    {choice.object === 'ball' && <g transform={`translate(110 95) scale(${scale})`}>
      <circle r="69" fill="#fb7185" stroke="#be123c" strokeWidth="3" />
      <path d="M-65 -22Q0 18 65 -22M-60 35Q0 0 60 35M0 -69Q-40 0 0 69M0 -69Q40 0 0 69" fill="none" stroke="#fff1f2" strokeWidth="8" />
    </g>}
    {choice.object === 'tree' && <g transform={`translate(110 164) scale(1 ${scale})`}>
      <rect x="-12" y="-92" width="24" height="92" rx="4" fill="#92400e" />
      <path d="M0 -154 -62 -69 62 -69Z" fill="#16a34a" /><path d="M0 -124 -70 -39 70 -39Z" fill="#22c55e" />
      <path d="M-80 0H80" stroke="#14532d" strokeWidth="4" />
    </g>}
    {choice.object === 'train' && <g>
      <path d="M10 142H210" stroke="#475569" strokeWidth="4" />
      {Array.from({length: scale === 1 ? 3 : 1}, (_, i) => <g key={i} transform={`translate(${16+i*62} 80)`}>
        <rect width="56" height="48" rx="8" fill={i ? '#38bdf8' : '#f59e0b'} stroke="#334155" strokeWidth="2" />
        <rect x="8" y="8" width="18" height="16" rx="3" fill="#e0f2fe" />
        <circle cx="12" cy="51" r="10" fill="#334155" /><circle cx="44" cy="51" r="10" fill="#334155" />
      </g>)}
    </g>}
  </svg>;
}

export function SpatialPicture({ question }: { question: Question }) {
  const points = { above: [180, 45], below: [180, 215], left: [55, 130], right: [305, 130] };
  const [x, y] = points[question.position!];
  return <svg viewBox="0 0 360 260" className="spatial-picture" role="img" aria-label={`${question.prompt} Quan sát hình minh họa.`}>
    <rect width="360" height="260" rx="24" fill="#ecfeff" />
    <path d="M135 95H225V165H135Z" fill="#d97706" stroke="#92400e" strokeWidth="3" />
    <path d="M135 95 151 78H209L225 95Z" fill="#fcd34d" stroke="#92400e" strokeWidth="3" />
    <rect x="173" y="79" width="14" height="49" fill="#fef3c7" />
    <text x="180" y="152" textAnchor="middle" fontSize="16" fill="#fff7ed" fontWeight="800">HỘP</text>
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="57">{question.emoji}</text>
  </svg>;
}

export function CountPictures({ emoji, count }: { emoji: string; count: number }) {
  return <div className="count-pictures" aria-label={`${count} hình minh họa`}>
    {Array.from({length: count}, (_, i) => <span key={i} aria-hidden="true">{emoji}</span>)}
  </div>;
}
