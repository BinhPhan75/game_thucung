import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QUESTION_BANK, bankQuestion, createBankPicker } from '../src/data/questionBank';

test('all 500 supplied entries are playable with one unambiguous answer button', () => {
  assert.equal(QUESTION_BANK.length,500);
  assert.equal(new Set(QUESTION_BANK.map(e=>e.id)).size,500);
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
    for(let i=0;i<500;i++) ids.add(pick().bank!.id);
    assert.equal(ids.size,500);
  }
});
