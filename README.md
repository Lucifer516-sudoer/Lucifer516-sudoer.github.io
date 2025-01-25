# DEV
```bat
@echo off
:: Check if Ollama CLI is installed
echo Checking for Ollama installation...
where ollama >nul 2>nul

IF %ERRORLEVEL% NEQ 0 (
    echo Ollama is not installed. Installing Ollama CLI...
    winget install Ollama.Ollama -e
    IF %ERRORLEVEL% NEQ 0 (
        echo Failed to install Ollama CLI. Please install manually from https://ollama.com/
        pause
        exit /b 1
    )
) ELSE (
    echo Ollama CLI is already installed.
)

:: Run the Gemma2:2B model using Ollama
echo Starting Ollama with Gemma2:2B model...
powershell -Command "Start-Process cmd -ArgumentList '/c ollama run gemma2:2b' -NoNewWindow"
echo Ollama with Gemma2:2B model is running.

pause
```
765kULENRrlrYlnX5MjZW5Bw4LzuAimE