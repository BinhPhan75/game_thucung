import { test } from 'node:test';
import assert from 'node:assert/strict';
import { englishWords, englishTopics, createEnglishPicker } from '../src/data/englishData.js';
import { existsSync, readFileSync } from 'node:fs';
const assets=JSON.parse(readFileSync(new URL('../src/data/pictureAssets.json',import.meta.url)));
test('English vocabulary includes requested topics and locally available illustrations',()=>{
  assert.equal(englishTopics.length,3);
  for(const word of ['Cat','Dog','Rabbit','Duck','Fish','Apple','Banana','Orange','Carrot','Red','Blue','Circle','Square']) assert.ok(englishWords.some(w=>w.word===word));
  assert.equal(new Set(englishWords.map(w=>w.id)).size,englishWords.length);
  for(const word of englishWords) {
    if(word.symbol) assert.ok(existsSync(new URL(`../public/pictures/${assets[word.symbol]}.svg`,import.meta.url)),word.word);
    else assert.ok(word.color && ['circle','square','triangle'].includes(word.shape));
  }
});
test('English quiz exhausts vocabulary and has three distinct relevant answers',()=>{
  const pick=createEnglishPicker(()=>.41);
  let last='';
  for(let cycle=0;cycle<3;cycle++) {
    const seen=new Set();
    for(let i=0;i<englishWords.length;i++) {
      const q=pick();
      assert.notEqual(q.target.id,last);
      last=q.target.id;
      seen.add(last);
      assert.equal(q.options.length,3);
      assert.equal(new Set(q.options.map(w=>w.id)).size,3);
      assert.equal(q.options.filter(w=>w.id===last).length,1);
      assert.ok(q.options.every(w=>w.topic===q.target.topic));
      assert.equal(new Set(q.options.map(w=>w.symbol || `${w.shape}:${w.color}`)).size,3);
    }
    assert.equal(seen.size,englishWords.length);
  }
});
