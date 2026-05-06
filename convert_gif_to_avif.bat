@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

set IMG_DIR=%~dp0assets\images
set TOTAL=0
set DONE=0

for %%f in ("%IMG_DIR%\*.gif") do set /a TOTAL+=1
echo 共找到 %TOTAL% 个 GIF 文件，开始转换...
echo.

for %%f in ("%IMG_DIR%\*.gif") do (
    set /a DONE+=1
    set "INPUT=%%f"
    set "OUTPUT=%%~dpnf.avif"
    echo [!DONE!/%TOTAL%] %%~nxf -^> %%~nf.avif
    ffmpeg -y -i "%%f" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v av1 -pix_fmt yuva420p -crf 20 "!OUTPUT!" 2>nul
    if !errorlevel! equ 0 (
        echo       OK
    ) else (
        echo       FAILED
    )
)

echo.
echo 全部完成！
pause
