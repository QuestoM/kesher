@echo off
setlocal

:: Get current date and time in format YYYY-MM-DD_HH-MM
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set version=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%

:: Print current action
echo Publishing Kesher version %version% to GitHub...

:: Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Git is not installed or not in PATH
    exit /b 1
)

:: Add all files
echo Adding files to git...
git add .

:: Commit with version as message
echo Committing changes...
git commit -m "Version %version%"

:: Check if remote exists, if not add it
git remote -v | findstr "origin" >nul
if %ERRORLEVEL% neq 0 (
    echo Remote 'origin' not found
    set /p repo_url="Enter your GitHub repository URL: "
    git remote add origin %repo_url%
)

:: Push to GitHub
echo Pushing to GitHub...
git push -u origin master

:: Create tag with version
echo Creating tag v%version%...
git tag v%version%

:: Push tag to GitHub
echo Pushing tag to GitHub...
git push origin v%version%

echo Done! Kesher version %version% has been published to GitHub.

endlocal 