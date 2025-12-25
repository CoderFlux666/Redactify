-- Create the table for redaction rules
create table public.redaction_rules (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  blocklist text[] null default '{}'::text[],
  pii_categories jsonb null default '{"names": true, "emails": true, "phone": true, "dates": true, "credit_cards": true}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint redaction_rules_pkey primary key (id),
  constraint redaction_rules_user_id_key unique (user_id)
);

-- Enable Row Level Security
alter table public.redaction_rules enable row level security;

-- Create policies
create policy "Users can view their own rules" on public.redaction_rules
  for select using (auth.uid() = user_id);

create policy "Users can insert their own rules" on public.redaction_rules
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own rules" on public.redaction_rules
  for update using (auth.uid() = user_id);
