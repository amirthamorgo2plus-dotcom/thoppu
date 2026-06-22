-- Run this entire file in Supabase SQL Editor

create table if not exists farms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  location text,
  area_acres text,
  primary_crop text default 'Coconut',
  manager_name text,
  created_at timestamptz default now()
);

create table if not exists farm_locations (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id) on delete cascade not null,
  type text not null,
  label text not null,
  lat text,
  lng text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists workers (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id) on delete cascade not null,
  name text not null,
  role text,
  phone text,
  wage numeric default 0,
  created_at timestamptz default now()
);

create table if not exists work_logs (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id) on delete cascade not null,
  worker_id uuid references workers(id) on delete cascade,
  worker_name text,
  date date default current_date,
  task text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists harvest_logs (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id) on delete cascade not null,
  block text not null,
  date date not null,
  count integer not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists irrigation_valves (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id) on delete cascade not null,
  name text not null,
  block text,
  status text default 'closed',
  last_run date,
  duration text,
  created_at timestamptz default now()
);

create table if not exists borewells (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id) on delete cascade not null,
  name text not null,
  depth text,
  motor text,
  feeds text,
  last_service date,
  created_at timestamptz default now()
);

create table if not exists problems (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id) on delete cascade not null,
  type text,
  title text not null,
  block text,
  date date,
  solution text,
  status text default 'open',
  created_at timestamptz default now()
);

-- Row Level Security
alter table farms enable row level security;
alter table farm_locations enable row level security;
alter table workers enable row level security;
alter table work_logs enable row level security;
alter table harvest_logs enable row level security;
alter table irrigation_valves enable row level security;
alter table borewells enable row level security;
alter table problems enable row level security;

-- Policies: owner can do everything on their farms
create policy "owner_farms" on farms for all using (owner_id = auth.uid());
create policy "owner_locations" on farm_locations for all using (farm_id in (select id from farms where owner_id = auth.uid()));
create policy "owner_workers" on workers for all using (farm_id in (select id from farms where owner_id = auth.uid()));
create policy "owner_work_logs" on work_logs for all using (farm_id in (select id from farms where owner_id = auth.uid()));
create policy "owner_harvest" on harvest_logs for all using (farm_id in (select id from farms where owner_id = auth.uid()));
create policy "owner_valves" on irrigation_valves for all using (farm_id in (select id from farms where owner_id = auth.uid()));
create policy "owner_borewells" on borewells for all using (farm_id in (select id from farms where owner_id = auth.uid()));
create policy "owner_problems" on problems for all using (farm_id in (select id from farms where owner_id = auth.uid()));
