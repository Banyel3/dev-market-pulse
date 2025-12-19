#!/bin/bash

# DevMarket Pulse - Docker Start Script

echo "🚀 Starting DevMarket Pulse..."
echo ""

# Check if Docker is running
echo "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Build and start services
echo "Building and starting services..."
docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All services started successfully!"
    echo ""
    echo "🌐 Access Points:"
    echo "   Frontend:  http://localhost:3000"
    echo "   Backend:   http://localhost:8000"
    echo "   API Docs:  http://localhost:8000/docs"
    echo "   Flower:    http://localhost:5555"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 Stop services:"
    echo "   docker-compose down"
    echo ""
else
    echo "❌ Failed to start services"
    echo "Check logs with: docker-compose logs"
fi
