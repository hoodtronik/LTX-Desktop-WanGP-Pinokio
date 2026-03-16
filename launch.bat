@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   LTX Desktop - WanGP Launcher
echo ============================================================
echo.

:: ------------------------------------------------------------------
:: 1. Check Node.js
:: ------------------------------------------------------------------
where node >nul 2>nul
if !ERRORLEVEL! neq 0 (
    echo [ERROR] Node.js is not installed. Download from https://nodejs.org/
    goto :fail
)
echo [OK] Node.js found

:: ------------------------------------------------------------------
:: 2. Check/install pnpm
:: ------------------------------------------------------------------
where pnpm >nul 2>nul
if !ERRORLEVEL! neq 0 (
    echo [INFO] pnpm not found. Installing via npm...
    call npm install -g pnpm
    for /f "delims=" %%i in ('npm prefix -g') do set "NPM_GLOBAL=%%i"
    set "PATH=!NPM_GLOBAL!;!PATH!"
)
where pnpm >nul 2>nul
if !ERRORLEVEL! neq 0 (
    echo [ERROR] pnpm not found after install. Try: npm install -g pnpm
    goto :fail
)
echo [OK] pnpm found

:: ------------------------------------------------------------------
:: 3. Set WANGP_ROOT for WanGP integration
:: ------------------------------------------------------------------
if exist "F:\pinokio\api\wan.git\app\wgp.py" (
    set "WANGP_ROOT=F:\pinokio\api\wan.git\app"
    echo [OK] WanGP detected
) else (
    echo [WARN] WanGP not found - will run in API-only mode
)

:: ------------------------------------------------------------------
:: 4. Navigate to app directory
:: ------------------------------------------------------------------
cd /d "%~dp0app"
if !ERRORLEVEL! neq 0 (
    echo [ERROR] app directory not found. Run Install in Pinokio first.
    goto :fail
)
echo [OK] App directory: %CD%

:: ------------------------------------------------------------------
:: 5. Install Node.js dependencies if needed
:: ------------------------------------------------------------------
if not exist "node_modules" (
    echo.
    echo [INFO] Installing Node.js dependencies ^(first run, may take a minute^)...
    call pnpm install
    if !ERRORLEVEL! neq 0 (
        echo [ERROR] pnpm install failed
        goto :fail
    )
    echo [OK] Node.js dependencies installed
) else (
    echo [OK] Node.js dependencies present
)

:: ------------------------------------------------------------------
:: 6. Setup Python backend if needed
:: ------------------------------------------------------------------
if not exist "backend\.venv" (
    echo.
    echo [INFO] Setting up Python backend venv...
    pushd backend
    uv sync
    if !ERRORLEVEL! neq 0 (
        echo [ERROR] uv sync failed
        popd
        goto :fail
    )
    popd
    echo [OK] Python backend ready
) else (
    echo [OK] Python backend venv present
)

:: ------------------------------------------------------------------
:: 7. Install Wan2GP deps into backend venv if needed
:: ------------------------------------------------------------------
if defined WANGP_ROOT (
    echo [INFO] Checking Wan2GP dependencies...
    powershell -ExecutionPolicy Bypass -File scripts\ensure-wan2gp.ps1 -RootDir "!WANGP_ROOT!" -InstallPythonDeps -PythonExe "backend\.venv\Scripts\python.exe" 2>nul
    echo [OK] Wan2GP setup done
)

:: ------------------------------------------------------------------
:: 8. Launch the Electron desktop app
:: ------------------------------------------------------------------
echo.
echo ============================================================
echo   Launching LTX Desktop...
echo   Close this window to stop the app.
echo ============================================================
echo.

call pnpm dev
goto :done

:fail
echo.
echo ============================================================
echo   Launcher failed. See error above.
echo ============================================================
pause
exit /b 1

:done
echo.
echo App closed.
pause
