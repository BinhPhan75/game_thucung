import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const source = stripTypeScriptTypes(readFileSync(new URL('../src/utils/voicePool.ts', import.meta.url), 'utf8'));
const { createVoicePicker, VOICE_POOLS } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

for (const event of Object.keys(VOICE_POOLS)) {
  test(`${event}: complete pools, no consecutive repeats, correct placeholders`, () => {
    for (const random of [() => 0, () => 0.999999, Math.random]) {
      const pick = createVoicePicker(random);
      let last;
      for (let cycle = 0; cycle < 20; cycle++) {
        const seen = new Set();
        for (let i = 0; i < VOICE_POOLS[event].length; i++) {
          const line = pick(event, { name: 'Miu', level: 7 });
          assert.notEqual(line, last);
          assert.ok(!seen.has(line));
          assert.ok(!line.includes('{'));
          if (event === 'levelUp') assert.match(line, /cấp 7/);
          if (event === 'foodFull' || event === 'waterFull') assert.match(line, /Miu/);
          seen.add(line);
          last = line;
        }
      }
    }
  });
}

test('events have independent bags and names are inserted literally', () => {
  const pick = createVoicePicker(() => 0);
  const control = createVoicePicker(() => 0);
  assert.equal(pick('correct'), control('correct'));
  pick('foodFull');
  assert.equal(pick('correct'), control('correct'));
  assert.ok(pick('foodFull', { name: '$&' }).includes('$&'));
  assert.ok(pick('waterFull').includes('bạn thú cưng'));
});

test('childName and petName personalization replaces placeholders seamlessly', () => {
  const pick = createVoicePicker(() => 0);
  const line = pick('correct', { childName: 'Bảo Nam', name: 'Bông Bông' });
  assert.ok(line.includes('Bảo Nam'));
  assert.ok(line.includes('Bông Bông'));
  assert.ok(!line.includes('{child}'));
  assert.ok(!line.includes('{pet}'));

  const lvlLine = pick('levelUp', { childName: 'Hoàng My', name: 'Thỏ xinh', level: 6 });
  assert.ok(lvlLine.includes('Hoàng My'));
  assert.ok(lvlLine.includes('Thỏ xinh'));
  assert.ok(lvlLine.includes('cấp 6'));
});

