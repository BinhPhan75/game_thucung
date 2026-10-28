import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QUESTION_BANK, EXTRA_QUESTIONS, questionIdentity, bankQuestion, createBankPicker } from '../src/data/questionBank';
import original from '../src/data/importedQuestions.json';

test('adds ten new questions per category and removes duplicate playable content', () => {
  assert.equal(original.length,500);
  assert.equal(EXTRA_QUESTIONS.length,150);
  for(let i=1;i<=15;i++) {
    assert.equal(EXTRA_QUESTIONS.filter(e=>e.category===`T${String(i).padStart(2,'0')}`).length,10);
  }
  const oldKeys=new Set(original.map(questionIdentity));
  for(const entry of EXTRA_QUESTIONS) assert.ok(!oldKeys.has(questionIdentity(entry)),entry.id);
  assert.equal(new Set(EXTRA_QUESTIONS.map(questionIdentity)).size,150);
  assert.equal(QUESTION_BANK.length,oldKeys.size+150);
  assert.equal(new Set(QUESTION_BANK.map(questionIdentity)).size,QUESTION_BANK.length);
});
test('all playable entries have one unambiguous answer button and correct arithmetic', () => {
  assert.equal(new Set(QUESTION_BANK.map(e=>e.id)).size,QUESTION_BANK.length);
  assert.equal(new Set(QUESTION_BANK.map(e=>e.category)).size,15);
  for (const entry of QUESTION_BANK) {
    const q=bankQuestion(entry),v=entry.visual;
    assert.equal(q.choices.filter(c=>c.id===q.answer).length,1,entry.id);
    assert.ok(q.choices.length>=2 && q.choices.length<=3,entry.id);
    let expected: string | number | undefined;
    if (v.type==='count') expected=v.count;
    if (v.type==='add' || v.type==='story' || (v.type==='grouping' && v.operation==='add')) expected=v.groups![0]+v.groups![1];
    if (v.type==='subtract') expected=v.start!-v.removed!;
    if (v.type==='grouping' && v.operation==='subtract') expected=v.groups![0]-v.groups![1];
    if (v.type==='shape') expected=v.target;
    if (v.type==='position') expected=v.position;
    if (v.type==='memory') expected=v.sequence![v.targetIndex!];
    if (v.type==='compare') {
      const [a,b]=v.groups!;
      expected=entry.options.includes('Có') ? (a===b ? 'Có' : 'Không') : a===b ? 'Hai nhóm bằng nhau' : ((entry.question.includes('nhiều hơn') ? a>b : a<b) ? 'Nhóm A' : 'Nhóm B');
    }
    if (expected!==undefined) assert.equal(String(expected),q.answer,entry.id);
  }
});
test('shuffle consumes all bank IDs before repeating', () => {
  const pick=createBankPicker(()=>.37);
  for(let cycle=0;cycle<2;cycle++) {
    const ids=new Set();
    for(let i=0;i<QUESTION_BANK.length;i++) ids.add(pick().bank!.id);
    assert.equal(ids.size,QUESTION_BANK.length);
  }
});
