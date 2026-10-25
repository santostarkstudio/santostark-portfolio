@echo off
echo ===================================================
echo   RESTORE CHECKPOINT: MFA + Lightbox + Docs (Working)
echo ===================================================
echo.
echo Restoring verified files...
xcopy /E /I /Y "C:\Users\santo\OneDrive\Desktop\santostark-live-checkpoint-mfa-lightbox\*" "C:\Users\santo\OneDrive\Desktop\santostark-live\"
echo.
echo Checkpoint Restored! Launching server on Port 3001...
cd /d "C:\Users\santo\OneDrive\Desktop\santostark-live"
call npx serve -s -p 3001 .
pause
