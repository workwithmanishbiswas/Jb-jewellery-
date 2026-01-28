#!/bin/bash

# JB Jewellery Collection - Setup Script

echo "=========================================="
echo "JB Jewellery Collection - Setup"
echo "=========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✓ Python 3 found"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is not installed. Please install pip3 first."
    exit 1
fi

echo "✓ pip3 found"

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv

echo "✓ Virtual environment created"

# Activate virtual environment
echo ""
echo "Activating virtual environment..."
source venv/bin/activate

echo "✓ Virtual environment activated"

# Install dependencies
echo ""
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "✓ Dependencies installed"

# Create .env file if it doesn't exist
echo ""
echo "Checking for .env file..."
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created. Please update it with your configuration."
else
    echo "✓ .env file already exists"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update your .env file with the required credentials"
echo "2. Run 'source venv/bin/activate' to activate the virtual environment"
echo "3. Run 'python backend/app.py' to start the development server"
echo "4. Open http://localhost:5000 in your browser"
echo ""
echo "For Vercel deployment:"
echo "1. Push to GitHub"
echo "2. Connect to Vercel"
echo "3. Add environment variables"
echo "4. Deploy"
