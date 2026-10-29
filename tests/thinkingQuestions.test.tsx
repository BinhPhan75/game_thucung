import React from 'react';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import {THINKING_QUESTIONS,shuffledPieces} from '../src/data/thinkingQuestions';
import {ThinkingExercise} from '../src/components/ThinkingExercise';
import {existsSync,readFileSync} from 'node:fs';
const assets=JSON.parse(readFileSync(new URL('../src/data/pictureAssets.json',import.meta.url),'utf8'));
test('all thinking activities have valid coordinates, pieces, categories and local art',()=>{
  assert.equal(THINKING_QUESTIONS.length,16);
  const sizes=new Set();
  for(const entry of THINKING_QUESTIONS){
    const a=entry.visual.activity!;
    if(a.kind==='connect'){
      assert.equal(a.points.length,10);
      assert.equal(new Set(a.points.map(p=>p.join(','))).size,10);
      for(const [x,y] of a.points) assert.ok(x>=8&&x<=92&&y>=8&&y<=92);
    }
    if(a.kind==='puzzle'){
      sizes.add(a.rows*a.columns);
      assert.ok(existsSync(new URL(`../public/pictures/${assets[a.symbol]}.svg`,import.meta.url)),a.symbol);
    }
    if(a.kind==='sort'){
      assert.equal(new Set(a.items.map(i=>i.id)).size,a.items.length);
      for(const item of a.items){
        assert.ok(a.groups.some(g=>g.id===item.group));
        if(item.symbol)assert.ok(existsSync(new URL(`../public/pictures/${assets[item.symbol]}.svg`,import.meta.url)),item.symbol);
      }
      for(const group of a.groups)assert.ok(a.items.some(i=>i.group===group.id));
    }
    const html=renderToStaticMarkup(<ThinkingExercise activity={a} disabled={false} onAnswer={()=>{}}/>);
    assert.doesNotMatch(html,/undefined|NaN/);
    assert.doesNotMatch(html,/Hoàn thành — Nhận thưởng/);
    const locked=renderToStaticMarkup(<ThinkingExercise activity={a} disabled={true} onAnswer={()=>{}}/>);
    for(const button of locked.matchAll(/<button\b([^>]*)>/g))assert.match(button[1],/disabled/);
  }
  assert.deepEqual([...sizes],[4,6,9,12]);
});
test('puzzle tray shuffles without losing or duplicating pieces',()=>{
  for(const count of [4,6,9,12])for(const random of [()=>0,()=>.999,()=>.42]){
    const result=shuffledPieces(count,random);
    assert.equal(new Set(result).size,count);
    assert.notDeepEqual(result,Array.from({length:count},(_,i)=>i));
    assert.deepEqual([...result].sort((a,b)=>a-b),Array.from({length:count},(_,i)=>i));
  }
});
