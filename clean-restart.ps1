# Clean restart script for DevMarket Pulse
# This removes old volumes and starts fresh

Write-Host "🛑 Stopping all containers..." -ForegroundColor Yellow
docker-compose down

Write-Host "🗑️  Removing old volumes..." -ForegroundColor Yellow
docker volume rm dev-market-pulse_postgres_data -ErrorAction SilentlyContinue
docker volume rm dev-market-pulse_redis_data -ErrorAction SilentlyContinue

Write-Host "🚀 Starting fresh containers..." -ForegroundColor Green
docker-compose up --build
