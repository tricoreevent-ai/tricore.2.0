@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

:: TriCore Events - Safe Startup Script
:: This script creates a local server .env when needed, installs missing
:: dependencies, clears the backend port, and then starts the app.

if not exist server\.env if exist server\.env.example (
    echo [TriCore] server\.env is missing. Creating it from server\.env.example...
    copy /Y server\.env.example server\.env >nul
    if errorlevel 1 (
        echo [TriCore] Failed to create server\.env.
        exit /b 1
    )
)

if not exist node_modules\cors\package.json (
    echo [TriCore] Root dependencies are missing. Installing packages...
    call npm install
    if errorlevel 1 (
        echo [TriCore] Root dependency install failed.
        exit /b 1
    )
)

if not exist client\node_modules\vite\bin\vite.js (
    echo [TriCore] Client dependencies are missing. Installing client packages...
    call npm --prefix client install --include=dev
    if errorlevel 1 (
        echo [TriCore] Client dependency install failed.
        exit /b 1
    )
)

set PORT=5000
echo [TriCore] Searching for processes on port %PORT%...

:: Find and terminate any process listening on the target port.
set PORT_WAS_BUSY=
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT% ^| findstr LISTENING') do (
    set PORT_WAS_BUSY=1
    echo [TriCore] Port %PORT% is currently occupied by PID %%a.
    echo [TriCore] Terminating process %%a...
    taskkill /F /PID %%a >nul 2>&1
    if not errorlevel 1 (
        echo [TriCore] Process terminated successfully.
    ) else (
        echo [TriCore] Failed to kill process %%a. You may need to run this script as Administrator.
    )
)

if defined PORT_WAS_BUSY (
    call :wait_for_port_release %PORT%
    if errorlevel 1 (
        echo [TriCore] Port %PORT% is still busy after cleanup. Please close the blocking app and try again.
        exit /b 1
    )
) else (
    echo [TriCore] Port %PORT% is free.
)

echo [TriCore] Starting application...
call npm run dev
exit /b %ERRORLEVEL%

:wait_for_port_release
set WAIT_PORT=%~1
for /l %%i in (1,1,20) do (
    set STILL_BUSY=
    for /f "tokens=5" %%p in ('netstat -aon ^| findstr :!WAIT_PORT! ^| findstr LISTENING') do (
        set STILL_BUSY=1
    )

    if not defined STILL_BUSY (
        exit /b 0
    )

    timeout /t 1 /nobreak >nul
)

exit /b 1
