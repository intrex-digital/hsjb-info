@echo off
REM Database initialization script for Cloudflare D1 (Windows)
REM Usage: init-db.bat

setlocal enabledelayedexpansion

echo Initializing Cloudflare D1 Database...

REM Check if wrangler is installed
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: wrangler is not installed. Please install it first:
    echo   npm install -g wrangler
    exit /b 1
)

REM Check if database ID is configured
findstr /C:"<YOUR_D1_DATABASE_ID>" wrangler.toml >nul 2>nul
if %errorlevel% equ 0 (
    echo Error: Please update wrangler.toml with your D1 database ID first.
    echo   1. Run: wrangler d1 create hsjb-info-db
    echo   2. Copy the database_id to wrangler.toml
    exit /b 1
)

echo Step 1: Creating database tables...
call wrangler d1 execute hsjb-info-db --file=./src/db/schema.sql
if %errorlevel% neq 0 (
    echo Error: Failed to create database tables
    exit /b 1
)

echo Step 2: Seeding skills and resume data...
call wrangler d1 execute hsjb-info-db --file=./src/db/seed.sql
if %errorlevel% neq 0 (
    echo Error: Failed to seed skills and resume data
    exit /b 1
)

echo Step 3: Seeding blog posts...
call wrangler d1 execute hsjb-info-db --file=./src/db/blog-seed.sql
if %errorlevel% neq 0 (
    echo Error: Failed to seed blog posts
    exit /b 1
)

echo.
echo Database initialization complete!
echo.
echo To verify, run:
echo   wrangler d1 execute hsjb-info-db --command="SELECT COUNT(*) FROM blog_posts"

endlocal
