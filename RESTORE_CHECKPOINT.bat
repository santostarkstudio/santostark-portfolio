@echo off
echo ===================================================
echo    RESTORE WORKING CHECKPOINT (Exact Safe State)
echo ===================================================
echo.
echo Restoring exact working files from checkpoint...
xcopy /E /I /Y "C:\Users\santo\OneDrive\Desktop\santostark-live-checkpoint-working\*" "C:\Users\santo\OneDrive\Desktop\santostark-live\"
echo.
echo Checkpoint restored successfully!
echo Launching server on Port 3001...
cd /d "C:\Users\santo\OneDrive\Desktop\santostark-live"
call npx serve -s -p 3001 .
pause
