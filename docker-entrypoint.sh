#!/bin/sh
set -e

# Wait for database
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy

echo "Running database seed..."
npm run prisma:seed:prod || echo "Seed skipped or failed"

exec "$@"
