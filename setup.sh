#!/bin/bash
# TrendyCart Setup Script for Linux/Mac

echo "Setting up TrendyCart..."
echo ""

echo "1. Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "2. Copying environment file..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file - please fill in your API keys!"
else
    echo ".env file already exists, skipping..."
fi

echo ""
echo "3. Generating Prisma client..."
npx prisma generate

echo ""
echo "4. Pushing database schema..."
npx prisma db push

echo ""
echo "5. Seeding database with sample data..."
npx prisma db seed

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Default Credentials:"
echo "Admin: admin@trendycart.com / admin123"
echo "User:  user@trendycart.com / user123"
echo ""
echo "To start the development server:"
echo "npm run dev"
echo ""
