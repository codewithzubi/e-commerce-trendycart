@echo off
echo.
echo ========================================
echo   TrendyCart - Database Setup
echo ========================================
echo.
echo This will:
echo  1. Install tsx (TypeScript runner)
echo  2. Generate Prisma Client
echo  3. Create SQLite database
echo  4. Seed 12 products + users
echo.
pause

cd /d "%~dp0"

echo.
echo [1/4] Installing tsx...
npm install -D tsx --legacy-peer-deps

echo.
echo [2/4] Generating Prisma Client...
npx prisma generate

echo.
echo [3/4] Pushing schema to database...
npx prisma db push --accept-data-loss

echo.
echo [4/4] Seeding database...
npx prisma db seed

echo.
echo ========================================
echo   Database Setup Complete!
echo ========================================
echo.
echo Login Credentials:
echo   Admin: admin@trendycart.com / admin123
echo   User:  user@trendycart.com / user123
echo.
echo Starting TrendyCart...
echo.

start "TrendyCart Server" cmd /k "npm run dev"

timeout /t 8 /nobreak > nul
start http://localhost:3000

echo.
echo App is starting at http://localhost:3000
echo.
pause
