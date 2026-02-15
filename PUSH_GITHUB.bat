@echo off
echo ========================================
echo  StackPay CLI - GitHub Push Script
echo ========================================
echo.

REM Minta username GitHub dari user
set /p GITHUB_USERNAME="Masukkan username GitHub Anda: "

echo.
echo Mengecek status Git...
git status

echo.
echo Menambahkan remote GitHub...
git remote add origin https://github.com/%GITHUB_USERNAME%/stackpay-cli.git

echo.
echo Verifikasi remote...
git remote -v

echo.
echo Pushing ke GitHub...
git push -u origin main

echo.
echo ========================================
echo  Push selesai!
echo  Repository URL: https://github.com/%GITHUB_USERNAME%/stackpay-cli
echo ========================================
echo.
pause
