@echo off
title Restore Checkpoint 2 - Header Home Scroll Fixed
echo =========================================================
echo   RESTORE CHECKPOINT 2: Header & Home Button Scroll Fixed
echo =========================================================
echo.
echo Reverting workspace to checkpoint-2-header-home-scroll-fixed...
git checkout -f checkpoint-2-header-home-scroll-fixed
node build.js
echo.
echo Checkpoint 2 restored successfully!
echo Launching server at http://localhost:3000 ...
node dev-server.js
pause
