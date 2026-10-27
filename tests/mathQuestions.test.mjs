import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const load = async path => import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(readFileSync(new URL(path, import.meta.url),'utf8'))).toString('base64')}`);
const { makeQuestion, LESSONS } = await load('../src/data/mathQuestions.ts');
const { questReward } = await load('../src/utils/questReward.ts');

for (const { id } of LESSONS) test(`${id}: 300 questions have exactly one correct, visually consistent choice`, () => {
  for (let i = 0; i < 300; i++) {
    const q = makeQuestion(id);
    assert.equal(q.choices.filter(c => c.id === q.answer).length, 1);
    assert.equal(new Set(q.choices.map(c => c.id)).size, q.choices.length);
    if (id === 'counting') assert.equal(+q.answer, q.count);
    if (id === 'addition') { assert.equal(+q.answer, q.addends[0]+q.addends[1]); assert.ok(+q.answer <= 5); }
    if (id === 'space') assert.equal(q.answer, q.position);
    if (id === 'comparison') {
      const [a,b] = q.choices;
      assert.notEqual(a.count,b.count);
      const correct = q.prompt.includes('nhiều') ? (a.count>b.count?a:b) : (a.count<b.count?a:b);
      assert.equal(q.answer,correct.id);
    }
    if (id === 'size') {
      const correct = q.choices.find(c=>c.id===q.answer);
      assert.equal(correct.size, /to hơn|cao hơn|dài hơn/.test(q.prompt) ? 1 : .5);
    }
    if (id === 'color') assert.ok(q.prompt.toLowerCase().includes(q.answer.toLowerCase()));
  }
});
const pet = {name:'Miu', type:'cat',level:1,stage:'baby',exp:0,maxExp:100,hunger:80,thirst:40,coins:100,stars:0,happiness:80,createdAt:0,inventory:{},unlockedCostumes:[]};
test('all lessons use the same targeted care rewards without mutating saved pet', () => {
  const food = questReward(pet,'food');
  assert.equal(food.hunger,100); assert.equal(food.thirst,40); assert.equal(pet.hunger,80);
  const water = questReward(pet,'water');
  assert.equal(water.hunger,80); assert.equal(water.thirst,70);
});
test('one correct costume answer unlocks and equips immediately', () => {
  const costume = {id:'wizard_hat',price:45};
  const reward = questReward(pet,'costume',costume);
  assert.equal(reward.equippedHat,'wizard_hat');
  assert.deepEqual(reward.unlockedCostumes,['wizard_hat']);
  assert.equal(reward.coins,65); assert.equal(reward.hunger,80); assert.equal(reward.thirst,40);
});
