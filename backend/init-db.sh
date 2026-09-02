#!/bin/bash

# Database initialization script for Cloudflare D1
# Usage: ./init-db.sh

set -e

echo "Initializing Cloudflare D1 Database..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Error: wrangler is not installed. Please install it first:"
    echo "  npm install -g wrangler"
    exit 1
fi

# Check if database ID is configured
if grep -q "<YOUR_D1_DATABASE_ID>" wrangler.toml; then
    echo "Error: Please update wrangler.toml with your D1 database ID first."
    echo "  1. Run: wrangler d1 create hsjb-info-db"
    echo "  2. Copy the database_id to wrangler.toml"
    exit 1
fi

echo "Step 1: Creating database tables..."
wrangler d1 execute hsjb-info-db --file=./src/db/schema.sql

echo "Step 2: Seeding skills and resume data..."
wrangler d1 execute hsjb-info-db --file=./src/db/seed.sql

echo "Step 3: Seeding blog posts..."
wrangler d1 execute hsjb-info-db --file=./src/db/blog-seed.sql

echo ""
echo "Database initialization complete!"
echo ""
echo "To verify, run:"
echo "  wrangler d1 execute hsjb-info-db --command='SELECT COUNT(*) FROM blog_posts'"
