-- Seed 14 FKF League teams into standings
-- Run in Supabase SQL Editor after running supabase-schema.sql

INSERT INTO standings (team, position, played, won, drawn, lost, goals_for, goals_against, goal_difference, points) VALUES
('RVIBS FC',          1,  0, 0, 0, 0, 0, 0, 0, 0),
('Nakuru United FC',  2,  0, 0, 0, 0, 0, 0, 0, 0),
('Eldoret City FC',   3,  0, 0, 0, 0, 0, 0, 0, 0),
('Kisumu United',     4,  0, 0, 0, 0, 0, 0, 0, 0),
('Mombasa Academy',   5,  0, 0, 0, 0, 0, 0, 0, 0),
('Nairobi FC',        6,  0, 0, 0, 0, 0, 0, 0, 0),
('Thika United',      7,  0, 0, 0, 0, 0, 0, 0, 0),
('Rift Valley Railways', 8, 0, 0, 0, 0, 0, 0, 0, 0),
('Western Stima',     9,  0, 0, 0, 0, 0, 0, 0, 0),
('Coast Stars',       10, 0, 0, 0, 0, 0, 0, 0, 0),
('Nyeri Town FC',     11, 0, 0, 0, 0, 0, 0, 0, 0),
('Kakamega Homeboyz', 12, 0, 0, 0, 0, 0, 0, 0, 0),
('Murang''a Seal',    13, 0, 0, 0, 0, 0, 0, 0, 0),
('Kisii United',      14, 0, 0, 0, 0, 0, 0, 0, 0)
ON CONFLICT (team) DO NOTHING;
