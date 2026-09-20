import test from 'node:test';
import assert from 'node:assert/strict';
import { effectiveShare, chance, heat, interval, eligible, resolve, seededDraw, prng, makeHolders } from '../lib/simulation/engine.mjs';
test('curve, heat, cap, timing and exact eligibility boundaries', () => {
  assert.ok(Math.abs(effectiveShare(.3) - .3/1.66) < 1e-15);
  assert.equal(heat(500,1), 46);
  assert.equal(chance(.5,500,20), .95);
  assert.equal(interval(0),10000);
  assert.ok(interval(1e12)<=300000);
  assert.throws(()=>effectiveShare(-1));
  assert.equal(eligible([{address:'a',share:.1,usd:5},{address:'a',share:.1,usd:5},{address:'b',share:.01,usd:9.99}]).length,1);
});
test('uniform selection and strict roll boundary',()=>{
  const holders=[{address:'a',share:.01},{address:'b',share:.5}];
  assert.equal(resolve(holders,0,.49,0).selected.address,'a');
  assert.equal(resolve(holders,0,.5,0).selected.address,'b');
  assert.equal(resolve(holders,0,0,chance(.01,2,0)).hit,false);
  assert.throws(()=>resolve([],0,0,0));
});
test('published seed reproduces complete outcome',async()=>{
  assert.deepEqual(await seededDraw(makeHolders(50),3,'fixture'),await seededDraw(makeHolders(50),3,'fixture'));
});
test('100,000 draws at each requested pool size',()=>{
  const results=[];
  for (const size of [50,200,500,2000,8000]) {
    const holders=makeHolders(size), random=prng(999); let misses=0,wins=0,worst=0;
    for(let i=0;i<100000;i++) { const r=resolve(holders,misses,random(),random()); if(r.hit){wins++;misses=0;} else {misses++;worst=Math.max(worst,misses);} }
    assert.ok(wins>0 && wins<100000);
    results.push({holders:holders.length,hitRate:(wins/1000).toFixed(2)+'%',drawsPerWin:(100000/wins).toFixed(2),worst});
  }
  console.table(results);
});
