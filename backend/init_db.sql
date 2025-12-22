-- Initialize database for DevMarket Pulse
-- This ensures the database exists before the app connects

-- The database is already created by POSTGRES_DB env var in docker-compose
-- This file can be used for additional initialization if needed

-- Grant all privileges to devmarket user
GRANT ALL PRIVILEGES ON DATABASE devmarket_pulse TO devmarket;
