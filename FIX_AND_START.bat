@echo off
echo.
echo ========================================
echo   TrendyCart - Complete Reinstall
echo ========================================
echo.
echo This will do a clean install of all dependencies.
echo It may take 2-3 minutes.
echo.
pause

cd /d "%~dp0"

echo.
echo [1/6] Stopping any running servers...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq TrendyCart*" >nul 2>&1

echo.
echo [2/6] Removing corrupted node_modules...
rmdir /s /q node_modules 2>nul
del /q package-lock.json 2>nul

echo.
echo [3/6] Cleaning npm cache...
npm cache clean --force

echo.
echo [4/6] Installing dependencies (this will take a moment)...
npm install --legacy-peer-deps

echo.
echo [5/6] Setting up database...
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed

echo.
echo [6/6] Clearing Next.js cache...
rmdir /s /q .next 2>nul

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Login Credentials:
echo   Admin: admin@trendycart.com / admin123
echo   User:  user@trendycart.com / user123
echo.
echo Starting the app...
echo.

start "TrendyCart Server" cmd /k "npm run dev"

timeout /t 10 /nobreak > nul
start http://localhost:3000

echo.
echo ========================================
echo   TrendyCart is starting!
echo ========================================
echo.
echo The dev server is running in a new window.
echo Your browser should have opened automatically.
echo.
echo If not, open: http://localhost:3000
echo.
pause
