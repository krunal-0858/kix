@echo off
setlocal
title KIX - Instagram-style app
cd /d "%~dp0"

echo ============================================
echo   KIX  -  http://localhost:5180
echo ============================================
echo.

if not exist "node_modules" (
  echo [KIX] node_modules not found - installing dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo [KIX] npm install failed. Check your Node.js installation.
    pause
    exit /b 1
  )
  echo.
)

echo [KIX] Starting dev server on port 5180...
echo [KIX] Press Ctrl+C to stop.
echo.
call npm.cmd run dev

echo.
echo [KIX] Dev server stopped.
pause
