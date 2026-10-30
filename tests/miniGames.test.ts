import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAZES, MEMORY_THEMES, DIFFERENCE_THEMES, createScenePicker, canMove, makeMemoryDeck, shuffle } from '../src/data/miniGames';

test('memory rounds contain exactly four pairs with unique card identities',()=>{
  for(let round=0;round<30;round++) {
    const deck=makeMemoryDeck();
    assert.equal(deck.length,8);
    assert.equal(new Set(deck.map(card=>card.id)).size,8);
    assert.equal(new Set(deck.map(card=>card.symbol)).size,4);
    for(const card of deck)assert.equal(deck.filter(other=>other.symbol===card.symbol).length,2);
  }
  assert.deepEqual(shuffle([1,2,3],()=>0).sort(),[1,2,3]);
});
test('every maze is solvable, with no diagonal moves or row wrapping',()=>{
  for(const maze of MAZES) {
    const n=maze.length;
    assert.ok([5,7,9].includes(n));
    assert.ok(maze.every(row=>row.length===n));
    const visited=new Set([0]);const queue=[0];
    while(queue.length) {
      const from=queue.shift()!;
      for(let to=0;to<n*n;to++)if(canMove(maze,from,to)&&!visited.has(to)){visited.add(to);queue.push(to);}
    }
    assert.ok(visited.has(n*n-1));
    assert.equal(canMove(maze,0,n+1),false);
    assert.equal(canMove(maze,n-1,n),false);
    assert.equal(canMove(maze,0,-1),false);
  }
});

test('five distinct progressive mazes and scene cycles without repeats',()=>{
 assert.equal(MAZES.length,5);assert.equal(new Set(MAZES.map(m=>m.join(''))).size,5);
 assert.deepEqual(MAZES.map(m=>m.length),[5,5,7,7,9]);
 const pick=createScenePicker(()=>.4);const ids=Array.from({length:10},pick);
 assert.equal(new Set(ids.slice(0,5)).size,5);assert.equal(new Set(ids.slice(5)).size,5);assert.notEqual(ids[4],ids[5]);
 assert.equal(DIFFERENCE_THEMES.length,5);
 for(const theme of MEMORY_THEMES)assert.ok(makeMemoryDeck(theme).every(card=>theme.symbols.includes(card.symbol)));
});
