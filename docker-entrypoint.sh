#!/bin/sh
set -eu

if [ ! -f "${DATABASE_PATH:-/data/property.db}" ]; then
  echo "Database not found; loading demo data..."
  node server/src/seed.js
fi

exec "$@"
