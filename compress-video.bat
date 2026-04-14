@echo off
REM Script untuk compress video untuk web (Windows)
REM Usage: compress-video.bat input.mp4

if "%1"=="" (
    echo ❌ Error: Masukkan nama file input
    echo Usage: compress-video.bat input.mp4
    exit /b 1
)

set INPUT_FILE=%1
set OUTPUT_FILE=%INPUT_FILE:~0,-4%-compressed.mp4

echo 🎬 Compressing video: %INPUT_FILE%
echo 📊 Output: %OUTPUT_FILE%

REM Check if ffmpeg installed
where ffmpeg >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ffmpeg tidak terinstall
    echo Silakan install dari: https://ffmpeg.org/download.html
    exit /b 1
)

REM Compress dengan optimal settings
ffmpeg -i "%INPUT_FILE%" ^
    -vcodec libx264 ^
    -crf 28 ^
    -preset slow ^
    -acodec aac ^
    -b:a 128k ^
    -movflags +faststart ^
    "%OUTPUT_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Compression selesai!
    echo 💡 Tip: Pindahkan ke: public\videos\hero-bg.mp4
) else (
    echo ❌ Compression gagal
    exit /b 1
)
