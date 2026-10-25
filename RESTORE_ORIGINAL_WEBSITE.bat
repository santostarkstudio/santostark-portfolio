@echo off
echo Restoring original portfolio checkpoint...
git checkout original-site-checkpoint --force
node build.js
echo Done! Original website restored.
pause
