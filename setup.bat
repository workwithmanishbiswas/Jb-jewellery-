@echo off
REM JB Jewellery Collection - Setup Script for Windows

echo.
echo ==========================================
echo JB Jewellery Collection - Setup
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python first.
    exit /b 1
)

echo √ Python found

REM Create virtual environment
echo.
echo Creating virtual environment...
python -m venv venv

echo √ Virtual environment created

REM Activate virtual environment
echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo √ Virtual environment activated

REM Install dependencies
echo.
echo Installing Python dependencies...
pip install -r requirements.txt

echo √ Dependencies installed

REM Create .env file if it doesn't exist
echo.
echo Checking for .env file...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo √ .env file created. Please update it with your configuration.
) else (
    echo √ .env file already exists
)

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Update your .env file with the required credentials
echo 2. Run 'venv\Scripts\activate.bat' to activate the virtual environment
echo 3. Run 'python backend/app.py' to start the development server
echo 4. Open http://localhost:5000 in your browser
echo.
echo For Vercel deployment:
echo 1. Push to GitHub
echo 2. Connect to Vercel
echo 3. Add environment variables
echo 4. Deploy
