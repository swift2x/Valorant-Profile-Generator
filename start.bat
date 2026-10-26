@echo off
cd /d "%~dp0"
if not exist json mkdir json
node src/cli.js --name Agent --tag ASC --agent Jett --out json
echo.
echo Profiles written to json\
dir /b json
pause
