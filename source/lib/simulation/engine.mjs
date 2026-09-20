import { config } from './config.mjs';
export function effectiveShare(share) {
  if (!Number.isFinite(share) || share < 0 || share > 1) throw new Error('Invalid supply share');
  return share / (1 + config.curve * share);
}
export function heat(count, misses) { return count * config.targetRate * config.missMultiplier ** misses; }
export function chance(share, count, misses) { return Math.min(config.chanceCap, effectiveShare(share) * heat(count, misses)); }
export function interval(pot) { return Math.round(config.minInterval + (config.maxInterval - config.minInterval) * Math.max(0, pot) / (Math.max(0, pot) + config.potScaleSol)); }
export function eligible(holders) {
  const owners = new Map();
  for (const holder of holders) {
    effectiveShare(holder.share);
    if (!Number.isFinite(holder.usd) || holder.usd < 0) throw new Error('Invalid valuation');
    const prior = owners.get(holder.address) || { address: holder.address, share: 0, usd: 0 };
    owners.set(holder.address, { ...prior, share: prior.share + holder.share, usd: prior.usd + holder.usd });
  }
  return [...owners.values()].filter(h => h.usd >= config.minimumUsd).sort((a,b) => a.address < b.address ? -1 : a.address > b.address ? 1 : 0);
}
export function resolve(holders, misses, selection, roll) {
  if (!holders.length) throw new Error('No eligible holders');
  if (selection < 0 || selection >= 1 || roll < 0 || roll >= 1 || !Number.isFinite(selection + roll)) throw new Error('Invalid random input');
  const selected = holders[Math.floor(selection * holders.length)];
  const winChance = chance(selected.share, holders.length, misses);
  return { selected, effectiveShare: effectiveShare(selected.share), heat: heat(holders.length, misses), winChance, roll, hit: roll < winChance };
}
export async function digest(text) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');
}
export async function seededDraw(holders, misses, seed) {
  if (!holders.length) throw new Error('No eligible holders');
  const selectionHash = await digest('selection:v1:' + seed);
  const rollHash = await digest('roll:v1:' + seed);
  // 48-bit independent SHA-256 streams. Rejection eliminates selection modulo bias.
  const range = 2 ** 48, limit = range - range % holders.length;
  let value = parseInt(selectionHash.slice(0,12),16), nonce = 0;
  while (value >= limit) value = parseInt((await digest('selection:v1:' + seed + ':' + ++nonce)).slice(0,12),16);
  return resolve(holders, misses, (value % holders.length + 0.5) / holders.length, parseInt(rollHash.slice(0,12),16) / range);
}
export function prng(seed = 42) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function makeHolders(count = 500) {
  const random = prng(157);
  const weights = Array.from({length: count},()=>Math.pow(1-random(),-1/1.2));
  const total = weights.reduce((a,b)=>a+b,0);
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  return eligible(weights.map(weight=>({ address: Array.from({length:44},()=>alphabet[Math.floor(random()*58)]).join(''), share: weight/total * .8, usd: weight/total * 800000 })));
}
