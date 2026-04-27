# TrendyCart - Complete Setup Script
# Run this in PowerShell to finalize everything

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TrendyCart - Finalizing Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "[1/5] node_modules found, skipping install..." -ForegroundColor Green
} else {
    Write-Host "[1/5] Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error installing dependencies. Trying with force..." -ForegroundColor Red
        npm install --legacy-peer-deps --force
    }
}

Write-Host ""

# Step 2: Create .env if not exists
if (!(Test-Path ".env")) {
    Write-Host "[2/5] Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "      .env file created! You can add your API keys later." -ForegroundColor Green
} else {
    Write-Host "[2/5] .env file already exists..." -ForegroundColor Green
}

Write-Host ""

# Step 3: Generate Prisma Client
Write-Host "[3/5] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""

# Step 4: Push database schema
Write-Host "[4/5] Creating database..." -ForegroundColor Yellow
npx prisma db push --accept-data-loss

Write-Host ""

# Step 5: Seed database
Write-Host "[5/5] Seeding database with sample data..." -ForegroundColor Yellow
npx prisma db seed

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete! " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Default Login Credentials:" -ForegroundColor Cyan
Write-Host "  Admin: admin@trendycart.com / admin123" -ForegroundColor White
Write-Host "  User:  user@trendycart.com / user123" -ForegroundColor White
Write-Host ""
Write-Host "To start the app:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
