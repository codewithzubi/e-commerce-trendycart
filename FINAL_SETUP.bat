@echo off
echo.
echo ========================================
echo   TrendyCart - Final Setup
echo ========================================
echo.
echo This will install remaining packages and start the app.
echo.
pause

cd /d "%~dp0"

echo.
echo [1/3] Installing sonner (toast notifications)...
npm install sonner --legacy-peer-deps

echo.
echo [2/3] Installing tsx (TypeScript runner)...
npm install -D tsx --legacy-peer-deps

echo.
echo [3/3] Seeding database...
npx prisma db seed

echo.
echo ========================================
echo   Setup Complete!
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
echo App starting at http://localhost:3000
echo.
pause
