import source from './importedQuestions.json';
import extra from './extraQuestions.json';
import type { Question } from './mathQuestions';

export interface BankEntry {
  id: string; category: string; difficulty: number; question: string;
  options: (string | number)[]; correctAnswer: string | number; explanation: string;
  visual: {
    type: string; object?: string; count?: number; groups?: number[];
    start?: number; removed?: number; target?: string; choices?: string[];
    color?: string; sequence?: string[]; items?: string[]; relation?: string;
    position?: string; reference?: string; scene?: number; operation?: string;
    targetIndex?: number; displaySeconds?: number; symbol?: string;
  };
}

// Preserve the supplied JSON; normalize only the playable representation.
export const EXTRA_QUESTIONS = extra as BankEntry[];
// IDs and distractor order do not make a repeated exercise a new question.
export function questionIdentity(entry: BankEntry): string {
  const { choices, ...visual } = entry.visual;
  return JSON.stringify([entry.question.trim().toLocaleLowerCase('vi'),
    Object.entries(visual).sort(([a],[b])=>a.localeCompare(b)), String(entry.correctAnswer)]);
}
export const QUESTION_BANK = [...new Map(
  [...source as BankEntry[], ...EXTRA_QUESTIONS].map(entry=>[questionIdentity(entry),entry]),
).values()];
export function bankQuestion(entry: BankEntry): Question {
  const options = [...new Set(entry.options.map(String))];
  if (options.length < 3 && entry.visual.type === 'color') {
    const colors = ['đỏ','xanh dương','vàng','xanh lá','tím','hồng','cam'];
    for (const color of colors) {
      const label = String(entry.correctAnswer).includes(' màu ')
        ? `${entry.visual.object} màu ${color}` : color;
      if (!options.includes(label)) options.push(label);
      if (options.length === 3) break;
    }
  }
  if (options.length < 3 && entry.visual.type === 'size') options.push('Bằng nhau');
  let prompt = entry.question;
  if (entry.visual.type === 'color' && String(entry.correctAnswer).includes(' màu ')) {
    prompt = `Bé chọn vật giống cả hình dạng và màu sắc với ${entry.visual.object} màu ${entry.visual.color} nhé!`;
  }
  // Do not read the memorized sequence back to the child after it is hidden.
  if (entry.visual.type === 'memory') {
    prompt = `Bé nhớ các hình nhé! Hình ở vị trí thứ ${(entry.visual.targetIndex ?? 0) + 1} là gì?`;
  }
  return { kind: 'bank', bank: entry, prompt, answer: String(entry.correctAnswer),
    choices: options.map(label => ({ id: label, label })) };
}

export function createBankPicker(random: () => number = Math.random) {
  let remaining: BankEntry[] = [];
  let lastCategory = '';
  let lastPrompt = '';
  return (): Question => {
    if (!remaining.length) {
      remaining = [...QUESTION_BANK];
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
    }
    let index = remaining.findIndex(entry => entry.category !== lastCategory && entry.question !== lastPrompt);
    if (index < 0) index = 0;
    const [entry] = remaining.splice(index, 1);
    lastCategory = entry.category;
    lastPrompt = entry.question;
    return bankQuestion(entry);
  };
}
export const makePlayableQuestion = createBankPicker();
