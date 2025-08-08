@echo off
REM Start Angular frontend first
start cmd /k "cd /d %~dp0\Frontend\AngularProject && ng serve --open"
REM Wait a few seconds to ensure frontend starts before backend
ping 127.0.0.1 -n 6 > nul
REM Start backend
start cmd /k "cd /d %~dp0 && node server.js" 