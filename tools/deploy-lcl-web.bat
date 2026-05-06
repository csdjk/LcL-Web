@echo off
echo.
echo === Deploy LcL-Web to Tencent COS ===
echo   Usage: deploy-lcl-web.bat [--full] [--include=demos]
echo.
python "%~dp0deploy.py" %*
echo.
if %errorlevel% == 0 (
    echo [OK] Deploy success!
) else (
    echo [ERROR] Deploy failed. Check network or key config.
)
echo.
pause
