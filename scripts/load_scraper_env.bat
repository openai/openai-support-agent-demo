@echo off
set "ENV_FILE=%~dp0..\.env.scrapers"
if defined SCRAPER_ENV_FILE set "ENV_FILE=%SCRAPER_ENV_FILE%"
if not exist "%ENV_FILE%" goto :EOF
for /f "usebackq tokens=1* delims==" %%A in (`findstr /r /v "^[ ]*#" "%ENV_FILE%"`) do (
  if not "%%A"=="" (
    set "%%A=%%B"
  )
)
:EOF
