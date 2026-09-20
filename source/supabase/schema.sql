-- Preparation only: live integration is disabled until project and mint are configured.
create table holder_snapshots (id uuid primary key default gen_random_uuid(), slot bigint not null, captured_at timestamptz not null, price_usd numeric not null check(price_usd >= 0), supply numeric not null check(supply > 0), holders jsonb not null, snapshot_hash text not null unique);
create table fee_ledger (signature text primary key, slot bigint not null, observed_at timestamptz not null, creator_fee_lamports bigint not null check(creator_fee_lamports >= 0), source_url text not null);
create table draw_commitments (id uuid primary key default gen_random_uuid(), scheduled_at timestamptz not null, published_at timestamptz not null default now(), future_slot bigint not null, rules jsonb not null, commitment_hash text not null unique);
create table draw_records (id uuid primary key references draw_commitments(id), snapshot_id uuid not null references holder_snapshots(id), resolved_at timestamptz not null, block_seed text not null, eligible_count integer not null check(eligible_count > 0), selected_wallet text not null, effective_share numeric not null, heat numeric not null, roll numeric not null, win_chance numeric not null check(win_chance between 0 and .95), outcome text not null check(outcome in ('hit','miss')), simulated_pot_lamports bigint not null, record jsonb not null);
alter table holder_snapshots enable row level security;
alter table fee_ledger enable row level security;
alter table draw_commitments enable row level security;
alter table draw_records enable row level security;
create policy public_read on holder_snapshots for select using (true);
create policy public_read on fee_ledger for select using (true);
create policy public_read on draw_commitments for select using (true);
create policy public_read on draw_records for select using (true);
-- Public clients cannot write; a separately configured trusted worker appends records.
create function reject_record_mutation() returns trigger language plpgsql as $$ begin raise exception 'Published records are append only'; end; $$;
create trigger immutable_draws before update or delete on draw_records for each row execute function reject_record_mutation();
create trigger immutable_commitments before update or delete on draw_commitments for each row execute function reject_record_mutation();
create trigger immutable_snapshots before update or delete on holder_snapshots for each row execute function reject_record_mutation();
create trigger immutable_fees before update or delete on fee_ledger for each row execute function reject_record_mutation();
