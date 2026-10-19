@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py run-demo.py
  exit /b %errorlevel%
)
where python >nul 2>nul
if %errorlevel%==0 (
  python run-demo.py
  exit /b %errorlevel%
)
echo Python 3 is required. Install Python, then run this file again.
pause
