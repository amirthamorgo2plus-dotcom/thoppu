-- Run this in Supabase SQL Editor to create the demo farm
-- Creates a read-only demo farm visible to all logged-in users

INSERT INTO farms (id, name, location, area_acres, primary_crop, owner_id)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Kallapuram Demo Farm',
  'Pollachi, Tamil Nadu',
  '25',
  'Coconut',
  '00000000-0000-0000-0000-000000000000'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO workers (id, farm_id, name, role, phone, join_date, status)
VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Murugan', 'Coconut Climber', '9876500001', '2024-01-10', 'active'),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Selvam', 'Farm Supervisor', '9876500002', '2024-02-01', 'active'),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Raji', 'General Labour', '9876500003', '2024-03-15', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO harvest_logs (id, farm_id, block, date, coconuts, grade, notes)
VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', 'Block A', '2026-05-10', 1200, 'A', 'Good yield after irrigation'),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001', 'Block B', '2026-05-15', 980, 'B', 'Some pest damage noticed'),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001', 'Block A', '2026-06-01', 1350, 'A', 'Best harvest this season')
ON CONFLICT (id) DO NOTHING;

INSERT INTO irrigation_valves (id, farm_id, name, block, status, last_run, duration)
VALUES
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000001', 'Valve 1', 'Block A', 'closed', '2026-06-20', '3 hrs'),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000001', 'Valve 2', 'Block B', 'open', '2026-06-23', '2 hrs')
ON CONFLICT (id) DO NOTHING;

INSERT INTO borewells (id, farm_id, name, depth, motor, feeds, last_service)
VALUES
  ('00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0000-000000000001', 'Borewell 1', '300 ft', '5 HP', 'Block A, B', '2026-03-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO problems (id, farm_id, type, title, block, date, solution, status)
VALUES
  ('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0000-000000000001', 'Pest', 'Rhinoceros beetle spotted', 'Block B', '2026-05-12', 'Applied neem oil treatment', 'resolved'),
  ('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0000-000000000001', 'Water', 'Borewell motor overheating', 'Block A', '2026-06-10', '', 'in-progress')
ON CONFLICT (id) DO NOTHING;
