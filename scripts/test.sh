#!/bin/bash
# scripts/test.sh
set -e
    
echo "Starting test database..."
docker compose -f docker-compose.test.yml --env-file .env.test up -d test-db --wait

cleanup() {
    echo "Tearing down..."
    docker compose -f docker-compose.test.yml down -v
}
trap cleanup EXIT

set -a; source .env.test; set +a

echo "Running migrations..."
npx drizzle-kit generate
npx drizzle-kit migrate


echo "Running tests..."
vitest run