export const brand = { name: 'WICK', ticker: '$WICK', tagline: 'Watch the burn.' };
export const config = Object.freeze({
  curve: 2.2, // Diminishing returns on fractional supply share.
  targetRate: 0.08, // Base heat factor, not a promised aggregate win rate.
  missMultiplier: 1.15, // Heat growth after each consecutive miss.
  chanceCap: 0.95, // Every wallet can miss.
  minimumUsd: 10, // Snapshot eligibility threshold.
  feeFraction: 0.8, // Observed fees counted as paper units.
  minInterval: 10_000, maxInterval: 300_000, // Milliseconds; scheduled before each draw.
  potScaleSol: 100, // Interval approaches its ceiling as the paper pot grows.
});
export const disclosure = 'Simulated. No funds are distributed.';
