@echo off
REM Course Management System - Quick Start Script

echo.
echo ========================================
echo Course Management System - Quick Start
echo ========================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dotnet is installed
where dotnet >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: dotnet is not installed or not in PATH
    echo Please install .NET SDK from https://dot.microsoft.com/
    pause
    exit /b 1
)

echo Starting Course Management System...
echo.

REM Start backend in new window
echo Starting backend (ASP.NET Core)...
start "Course Management API" cmd /k "cd WebProject && dotnet run"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
echo Starting frontend (React)...
start "Course Management UI" cmd /k "cd CourseManagementUI && npm run dev"

echo.
echo ========================================
echo Applications are starting...
echo.
echo Backend: https://localhost:7029
echo Frontend: http://localhost:5173
echo.
echo Backend Swagger: https://localhost:7029/swagger
echo.
echo Press any key to exit this window...
pause
