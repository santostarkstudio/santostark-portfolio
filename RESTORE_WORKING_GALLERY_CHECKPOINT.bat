@echo off
title Restore Working Checkpoint
echo ========================================================
echo   RESTORING TO VERIFIED WORKING CHECKPOINT
echo ========================================================
echo.
git checkout working-checkpoint-gallery-fixed --force
node build.js
echo.
echo ========================================================
echo   RESTORE COMPLETE! 
echo   Your working website (with gallery fix) is restored.
echo ========================================================
pause
