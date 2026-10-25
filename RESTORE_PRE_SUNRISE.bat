@echo off
echo Restoring pre-sunrise checkpoint...
git checkout checkpoint-before-cinematic-sunrise --force
node build.js
echo Done! Pre-sunrise website restored.
pause
