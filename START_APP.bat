@echo off
echo.
echo ========================================
echo   Starting TrendyCart
echo ========================================
echo.
echo Opening browser in 5 seconds...
echo.

cd /d "%~dp0"

REM Start the dev server
start "TrendyCart Server" cmd /k "npm run dev"

REM Wait a bit then open browser
timeout /t 8 /nobreak > nul
start http://localhost:3000

echo.
echo ========================================
echo   TrendyCart is starting!
echo ========================================
echo.
echo The dev server is running in a new window.
echo Your browser should open automatically.
echo.
echo Login Credentials:
echo   Admin: admin@trendycart.com / admin123
echo   User:  user@trendycart.com / user123
echo.
pause
