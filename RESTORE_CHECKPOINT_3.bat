@echo off
title Restore Checkpoint 3 - Studio Pedestal, Atmosphere & CMS
echo ====================================================================
echo   RESTORE CHECKPOINT 3: Studio Pedestal Grounded, Foreground
echo   Atmospheric Mist, Universal CMS, Header Gap Fixed, Clean Lab BG
echo ====================================================================
echo.
echo Reverting workspace to checkpoint-3-studio-pedestal-atmosphere-cms-fixed...
git checkout -f checkpoint-3-studio-pedestal-atmosphere-cms-fixed
echo.
echo Checkpoint 3 restored successfully!
echo Launching server at http://localhost:3000 ...
node dev-server.js
pause
