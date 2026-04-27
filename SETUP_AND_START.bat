@echo off
echo.
echo ========================================
echo   TrendyCart - Database Setup
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Generating Prisma Client...
npx prisma generate
echo.

echo Step 2: Creating Database...
npx prisma db push --accept-data-loss
echo.

echo Step 3: Seeding Sample Data...
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
echo Press any key to start the app...
pause > nul

echo.
echo Starting TrendyCart...
start "TrendyCart Server" cmd /k "npm run dev"

timeout /t 8 /nobreak > nul
start http://localhost:3000
