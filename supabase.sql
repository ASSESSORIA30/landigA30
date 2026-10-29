-- Execute this SQL in your own Supabase project before accepting invoices.
create table if not exists public.leads (
  id uuid primary key, created_at timestamptz not null default now(),
  name text not null, phone text not null, email text not null,
  service_type text not null, invoice_path text not null,
  consent_contact boolean not null default true,
  consent_marketing boolean not null default false,
  source text not null default 'landing_lleida',
  status text not null default 'nou'
);
alter table public.leads enable row level security;
-- There are deliberately no public read/write policies. Only the server service-role can access this table.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('factures','factures',false,8388608,array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
-- No public storage policies are created. The bucket remains private.
