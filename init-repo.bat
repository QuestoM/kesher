@echo off
setlocal

echo Initializing Git repository for Kesher...

:: Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Git is not installed or not in PATH
    exit /b 1
)

:: Initialize git repository if not already initialized
if not exist .git (
    echo Initializing git repository...
    git init
) else (
    echo Git repository already exists.
)

:: Set user info if not already set
git config --get user.name >nul 2>nul
if %ERRORLEVEL% neq 0 (
    set /p git_name="Enter your name for Git: "
    git config user.name "%git_name%"
)

git config --get user.email >nul 2>nul
if %ERRORLEVEL% neq 0 (
    set /p git_email="Enter your email for Git: "
    git config user.email "%git_email%"
)

:: Add GitHub remote repository
echo Setting up GitHub remote repository...
set /p repo_url="Enter your GitHub repository URL (e.g., https://github.com/username/kesher.git): "
git remote remove origin 2>nul
git remote add origin %repo_url%

:: Initial commit
if not exist .git\refs\heads (
    echo Creating initial commit...
    git add .
    git commit -m "Initial commit"
)

echo Kesher Git repository has been initialized!
echo You can now use 'publish-to-github.bat' to publish updates.

endlocal 