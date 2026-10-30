import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAZES, canMove, makeMemoryDeck, shuffle } from '../src/data/miniGames';

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
    assert.equal(maze.length,5);
    assert.ok(maze.every(row=>row.length===5));
    const visited=new Set([0]);const queue=[0];
    while(queue.length) {
      const from=queue.shift()!;
      for(let to=0;to<25;to++)if(canMove(maze,from,to)&&!visited.has(to)){visited.add(to);queue.push(to);}
    }
    assert.ok(visited.has(24));
    assert.equal(canMove(maze,0,6),false);
    assert.equal(canMove(maze,4,5),false);
    assert.equal(canMove(maze,0,-1),false);
  }
});
