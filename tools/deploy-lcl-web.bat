@echo off
echo.
echo === Deploy LcL-Web to Tencent COS ===
echo.
C:\tools\coscli.exe sync "f:\LiChangLong\LcL-Web\" "cos://lclgame-res-1304962048/LcL-Web/" -r --exclude "\.git/.*" --delete
echo.
if %errorlevel% == 0 (
    echo [OK] Deploy success!
) else (
    echo [ERROR] Deploy failed. Check network or key config.
)
echo.
pause
