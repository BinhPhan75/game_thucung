import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { BankExercise } from '../src/components/BankExercise';
import { QUESTION_BANK, EXTRA_QUESTIONS, bankQuestion } from '../src/data/questionBank';
import assets from '../src/data/pictureAssets.json';

test('all 150 new exercises render illustrations and valid answer buttons',()=>{
  for(const entry of EXTRA_QUESTIONS) {
    const html=renderToStaticMarkup(<BankExercise question={bankQuestion(entry)} selected="" wrong={false} onAnswer={()=>{}}/>);
    assert.match(html,/<img|<svg/,entry.id);
    assert.doesNotMatch(html,/undefined|NaN/,entry.id);
    for(const match of html.matchAll(/src="\/pictures\/([^"]+)"/g)) {
      assert.ok(existsSync(new URL(`../public/pictures/${match[1]}`,import.meta.url)),entry.id);
    }
  }
});

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
  for(const [label,file] of [['Cá','1f41f'],['Mèo','1f408'],['Gà','1f414']]) {
    assert.match(html,new RegExp(`aria-label="${label}"[^>]*>[\\s\\S]*?pictures/${file}\\.svg`));
  }
});
test('every logic answer has an illustration, including distractors',()=>{
  for(const entry of QUESTION_BANK.filter(e=>e.visual.type==='logic')) {
    const html=renderToStaticMarkup(<BankExercise question={bankQuestion(entry)} selected="" wrong={false} onAnswer={()=>{}}/>);
    assert.equal((html.match(/class="bank-option-icon"/g)??[]).length,new Set(entry.options).size,entry.id);
  }
});

test('selectable scene pictures mirror answer IDs while keeping the answer row',()=>{
  for(const type of ['size','compare','odd_or_match']) {
    const entry=QUESTION_BANK.find(e=>e.visual.type===type && (type!=='compare' || e.options.includes('Nhóm A')))!;
    const html=renderToStaticMarkup(<BankExercise question={bankQuestion(entry)} selected="" wrong={false} onAnswer={()=>{}}/>);
    assert.match(html,/class="bank-scene-choice"/,type);
    assert.match(html,/class="bank-answers /,type);
    const locked=renderToStaticMarkup(<BankExercise question={bankQuestion(entry)} selected="" wrong={true} onAnswer={()=>{}}/>);
    for(const button of locked.matchAll(/<button\b([^>]*)>/g)) assert.match(button[1],/disabled/,type);
  }
});
