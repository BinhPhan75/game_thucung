import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { BankExercise } from '../src/components/BankExercise';
import { QUESTION_BANK, bankQuestion } from '../src/data/questionBank';
import assets from '../src/data/pictureAssets.json';

test('all bundled illustrations exist as vector images',()=>{
  for(const file of Object.values(assets)) {
    const path=new URL(`../public/pictures/${file}.svg`,import.meta.url);
    assert.ok(existsSync(path),file);
    assert.match(readFileSync(path,'utf8'),/<svg/);
  }
});
test('all three swimming question answers have matching pictures',()=>{
  const entry=QUESTION_BANK.find(e=>e.question==='Con gì biết bơi?')!;
  const html=renderToStaticMarkup(<BankExercise question={bankQuestion(entry)} selected="" wrong={false} onAnswer={()=>{}}/>);
  for(const [label,file] of [['Cá','1f41f'],['Mèo','1f431'],['Gà','1f414']]) {
    assert.match(html,new RegExp(`aria-label="${label}"[^>]*>[\\s\\S]*?pictures/${file}\\.svg`));
  }
});
test('every logic answer has an illustration, including distractors',()=>{
  for(const entry of QUESTION_BANK.filter(e=>e.visual.type==='logic')) {
    const html=renderToStaticMarkup(<BankExercise question={bankQuestion(entry)} selected="" wrong={false} onAnswer={()=>{}}/>);
    assert.equal((html.match(/class="bank-option-icon"/g)??[]).length,new Set(entry.options).size,entry.id);
  }
});
