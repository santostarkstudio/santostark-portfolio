@echo off
title Restore Checkpoint 1 - Solar Zoom Fixed
echo ===================================================
echo   RESTORE CHECKPOINT 1: Solar Zoom Fixed
echo ===================================================
echo.
echo Reverting workspace to checkpoint-1-solar-zoom-fixed...
git checkout -f checkpoint-1-solar-zoom-fixed
node build.js
echo.
echo Checkpoint 1 restored successfully!
echo Launching server at http://localhost:3000 ...
node dev-server.js
pause
