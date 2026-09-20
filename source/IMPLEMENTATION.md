# Delivery status

The shipped React experience is explicitly a browser-local demo. It must not be described as a live chain integration or independently fair draw service.

Implemented: pure configured draw engine, eligibility aggregation and threshold, curve/heat/cap, unbiased seeded wallet selection, domain-separated roll, 500,000 simulation draws, schema preparation, animated spectator UI, accessible tabs and dialogs, wallet paste/local persistence/clear, personal odds and history, opt-in notifications, opt-in synthesized sound, replay and full input downloads, disclosures and explanation routes.

Unavailable inputs: token mint, connected Supabase project credentials, holder provider credentials, verified creator-fee adapter. Supabase schema is prepared but has not been applied. No financial transactions, wallet signatures, claims, or transfer code exists.

Live implementation still required: slot-consistent holder indexing, real USD valuation and creator-fee ingestion, backend scheduler with a public commitment before each future seed, future finalized Solana block seed retrieval, append-only persistence, shared realtime broadcast, historical permanent URLs, externally tested recomputation and independent fairness review. Do not expose service-role keys to browsers.

Caching proposal: Helius bootstrap pagination aggregates all accounts by owner; consume account updates with slot metadata to maintain an index. Freeze draw snapshot before the committed target block becomes known; reconcile with full scans. UI uses cached state but engine refuses stale or incomplete snapshots. Pagination alone does not prove a slot-consistent snapshot. Target draw deadlines do not promise network finality.

Observed simulation: Pareto shape 1.2, eligible holders represent 80% of supply, seed 157 for holder generation, seed 999 for independent selection/roll samples, 100,000 draws per size. Results: 50 = 12.74%, 200 = 12.54%, 500 = 12.51%, 2,000 = 11.04%, 8,000 = 10.12%. Worst miss streaks 24,24,24,26,27. These fixtures do not reproduce an undisclosed source distribution; rates must be rerun on the real snapshot.

Open tuning decisions for actual holder testing: targetRate .08, missMultiplier 1.15, variable interval growth vs fixed interval, curve 2.2. All remain as requested.

Browser visual inspection and WebMCP integration testing unavailable: the browser tool refused access because its admin policy could not be verified. No bypass was attempted.
