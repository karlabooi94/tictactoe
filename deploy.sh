#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Check if required environment variables are set
if [ -z "$STRIPE_SECRET_KEY" ] || [ -z "$STRIPE_PUBLISHABLE_KEY" ] || [ -z "$STRIPE_WEBHOOK_SECRET" ]; then
    echo "❌ Error: Required environment variables are not set"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test

# Build the application (if needed)
echo "🏗️ Building application..."
# Add build steps here if needed

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs

# Set up environment variables
echo "🔐 Setting up environment variables..."
cp .env.example .env
sed -i '' "s|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY|g" .env
sed -i '' "s|STRIPE_PUBLISHABLE_KEY=.*|STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY|g" .env
sed -i '' "s|STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET|g" .env

# Start the server
echo "🚀 Starting the server..."
if [ "$NODE_ENV" = "production" ]; then
    # Use PM2 for process management in production
    echo "📊 Setting up PM2..."
    npm install -g pm2
    pm2 start server.js --name "tic-tac-toe-server"
    pm2 save
else
    # Use nodemon for development
    npm run dev
fi

echo "✅ Deployment completed successfully!" 