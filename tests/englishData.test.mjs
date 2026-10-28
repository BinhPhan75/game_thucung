import { test } from 'node:test';
import assert from 'node:assert/strict';
import { englishWords, englishTopics, createEnglishPicker, englishPronunciation } from '../src/data/englishData.js';
import { existsSync, readFileSync } from 'node:fs';
const assets=JSON.parse(readFileSync(new URL('../src/data/pictureAssets.json',import.meta.url)));
test('English vocabulary includes requested topics and locally available illustrations',()=>{
  assert.equal(englishTopics.length,5);
  for(const word of ['Cat','Dog','Rabbit','Duck','Fish','Apple','Banana','Orange','Carrot','Red','Blue','Circle','Square']) assert.ok(englishWords.some(w=>w.word===word));
  assert.equal(new Set(englishWords.map(w=>w.id)).size,englishWords.length);
  for(const word of englishWords) {
    if(word.symbol) assert.ok(existsSync(new URL(`../public/pictures/${assets[word.symbol]}.svg`,import.meta.url)),word.word);
    else if ('count' in word) assert.ok(word.count>=1 && word.count<=10);
    else if ('letter' in word) assert.match(word.letter,/^[A-Z]$/);
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
      assert.equal(new Set(q.options.map(w=>w.symbol || w.letter || w.count || `${w.shape}:${w.color}`)).size,3);
    }
    assert.equal(seen.size,englishWords.length);
  }
});

test('number and alphabet lessons are complete, ordered, and pronounceable',()=>{
  const numbers=englishWords.filter(w=>w.topic==='numbers');
  assert.deepEqual(numbers.map(w=>w.count),Array.from({length:10},(_,i)=>i+1));
  assert.deepEqual(numbers.map(englishPronunciation),['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten']);
  const letters=englishWords.filter(w=>w.topic==='alphabet');
  assert.equal(letters.map(w=>w.letter).join(''),'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  for(const letter of letters) assert.equal(englishPronunciation(letter),`The letter ${letter.letter}.`);
  for(const topic of ['numbers','alphabet']) {
    const pick=createEnglishPicker(()=>.23,topic);
    const size=topic==='numbers'?10:26;
    const seen=new Set();
    for(let i=0;i<size;i++) {
      const q=pick(); seen.add(q.target.id);
      assert.equal(q.target.topic,topic);
      assert.equal(q.options.length,3);
      assert.ok(q.options.every(w=>w.topic===topic));
      assert.equal(q.options.filter(w=>w.id===q.target.id).length,1);
    }
    assert.equal(seen.size,size);
  }
});
