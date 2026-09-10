@echo off
title SMART-ASD Platform Launcher
echo ===================================================
echo        Starting SMART-ASD Platform Services
echo ===================================================
echo.

:: Check PostgreSQL
echo [1/3] Ensuring Database is ready...
net start postgresql-x64-16 >nul 2>&1
net start postgresql-x64-15 >nul 2>&1
net start postgresql-x64-14 >nul 2>&1
net start postgresql >nul 2>&1

:: Start Python ML Inference Microservice
echo [2/3] Starting Python Questionnaire Model Server (Port 5001)...
start "SMART-ASD Python ML Service" cmd /k ".\tfenv\Scripts\python.exe python_inference\app.py"

:: Wait 3 seconds for Python service to initialize
timeout /t 3 /nobreak >nul

:: Generate Prisma Client (ensures schema changes are always applied)
echo [3/4] Generating Prisma Client (ensures latest schema)...
call npx prisma generate >nul 2>&1
echo       Prisma client ready.

:: Start Next.js Frontend & Backend API
echo [4/4] Starting Next.js Web Application (Port 3000)...
start "SMART-ASD Next.js Server" cmd /k "npm run dev"

echo.
echo ===================================================
echo  All services launched!
echo  Website:  http://localhost:3000
echo  ML Model: http://127.0.0.1:5001/health
echo ===================================================
echo.
pause
