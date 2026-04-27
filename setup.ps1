# TrendyCart Setup Script
# Run this from PowerShell or Command Prompt in the trendycart directory

Write-Host "Setting up TrendyCart..." -ForegroundColor Green
Write-Host ""

Write-Host "1. Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

Write-Host ""
Write-Host "2. Copying environment file..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env file - please fill in your API keys!" -ForegroundColor Cyan
} else {
    Write-Host ".env file already exists, skipping..." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "3. Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "4. Pushing database schema..." -ForegroundColor Yellow
npx prisma db push

Write-Host ""
Write-Host "5. Seeding database with sample data..." -ForegroundColor Yellow
npx prisma db seed

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Default Credentials:" -ForegroundColor Cyan
Write-Host "Admin: admin@trendycart.com / admin123" -ForegroundColor White
Write-Host "User:  user@trendycart.com / user123" -ForegroundColor White
Write-Host ""
Write-Host "To start the development server:" -ForegroundColor Yellow
Write-Host "npm run dev" -ForegroundColor White
Write-Host ""
