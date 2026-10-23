# ==============================================================================
# Yazhi Sovereign CLI Installer & Environment Linker (`yz` / `yazhi`)
# Designed for PowerShell installation on Windows.
#
# Usage:
#   .\install.ps1
# ==============================================================================

# Exit immediately if a command exits with a non-zero status.
# Treat unset variables as an error when substituting.
$ErrorActionPreference = "Stop"

# ANSI color styling matching Yazhi brand kit
$BOLD = "`e[1m"
$GOLD = "`e[38;2;211;179;106m"
$CYAN = "`e[38;2;56;189;248m"
$GREEN = "`e[38;2;16;185;129m"
$RED = "`e[38;2;244;63;94m"
$RESET = "`e[0m"

Write-Host "${GOLD}"
@"
                                           ▐█▓▓░         ▐█▓▓░      
                   ▄░░▄▄       ▄▄▄▄▄▄▄     ▐▓▓▒░▄▄▄▄     ▐▀▀▀░      
 ▄▄▄▓    ▓ ▄    ▄ ░░▒▀▓▓▄▄▄  ▐█▄▓▓▒░░▓▓ ▄  ▐▓▓▓▓▓▀▒▓▓ ▄  ▀▓▓▓▓▀     
▐▓▓▓▀    █░█▌   ░░█▀  ▀▀▓▓▌▌  ▀▀▀▀▀  ▀█░█▌ ▐▓▓▓▀   ▀█░█▌ ▐▓▓▓▓      
▓▓▓▌▌ ░░░▐███ ▐   ▌░░░ ▐▐▓▓▌ ░▄█▄▓▓▒░██▀▀  ▓▓▓▌█ ░░░▐███ ▓▓▓▓█      
▐▀▓▀ ▄  ▄ ░█ ▐▓▓      ▐▀▓▌▌ ▐▀▓▀ ▄  ▄▄▄█▌ ▓▀▓▀  ░░░▐▓██ ▓▀▓██      
 ▀  ░░   ░▒▒░  ▀█░ ▄▄▄░ ░░░  ▀  ░░   ░░██ ██  ░ ░░░▐░██ █████      
    ▀▀░▀▀█░▓░     ▀▀▀▀░▒▒▀▀▀     ▀▀░▀▀▀▀   ▀▀▀▀▀    ▀▀▀▀ ▀▀▀▀       
  ▄▄▄▄▄▄█▒█▀
"@
Write-Host "${RESET}"

Write-Host "${BOLD}${GOLD}YAZHI SOVEREIGN CLI INSTALLER (v0.3.0)${RESET}"
Write-Host "${CYAN}Installing 'yz' and 'yazhi' CLI binaries into local system environment...${RESET}`n"

# 1. Target Directories
$DEST_BIN = "$env:USERPROFILE\\.local\\bin"
If (-not (Test-Path $DEST_BIN)) {
    New-Item -Path $DEST_BIN -ItemType Directory | Out-Null
}

# Determine repository root
$SCRIPT_DIR = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$PROJECT_ROOT = $SCRIPT_DIR

# Assuming Yazhi/repos/yazhi-api is the target project
# In a Windows context, the path separator is '\' not '/'
$YAZHI_API_PATH = Join-Path $env:USERPROFILE "Yazhi\\repos\\yazhi-api"

If (-not (Test-Path (Join-Path $PROJECT_ROOT "pyproject.toml"))) {
    If (Test-Path $YAZHI_API_PATH) {
        $PROJECT_ROOT = $YAZHI_API_PATH
    } ElseIf (Test-Path (Join-Path (Get-Location) "repos\\yazhi-api")) {
        $PROJECT_ROOT = Join-Path (Get-Location) "repos\\yazhi-api"
    } ElseIf (Test-Path (Get-Location) -and (Test-Path (Join-Path (Get-Location) "pyproject.toml"))) {
        $PROJECT_ROOT = Get-Location
    } Else {
        Write-Host "${RED}[ERROR] Could not locate yazhi-api repository root.${RESET}"
        Write-Host "Please clone repository first or run within the workspace."
        exit 1
    }
}

Write-Host "[1/4] ${CYAN}Targeting repository at:${RESET} ${PROJECT_ROOT}"

# 2. Virtual environment verification
$VENV_DIR = Join-Path $PROJECT_ROOT ".venv"

If (-not (Test-Path (Join-Path $VENV_DIR "Scripts\\python.exe"))) {
    Write-Host "[2/4] ${GOLD}Creating virtual environment at ${VENV_DIR}...${RESET}"
    python -m venv "$VENV_DIR"
}

# 3. Install / Link CLI package
Write-Host "[2/4] ${CYAN}Building and linking Yazhi CLI in editable mode...${RESET}"
$PIP_EXEC = Join-Path $VENV_DIR "Scripts\\pip.exe"
& "$PIP_EXEC" install -q --upgrade pip
& "$PIP_EXEC" install -q -e "$PROJECT_ROOT"

# 4. Generate Launcher Wrappers in ~/.local/bin
$YZ_LAUNCHER_PATH = Join-Path $DEST_BIN "yz.cmd" # Using .cmd for Windows compatibility
$YAZHI_LAUNCHER_PATH = Join-Path $DEST_BIN "yazhi.cmd"

# yz.cmd launcher
@"
@echo off
set "VENV_PYTHON=%VENV_DIR%\\Scripts\\python.exe"
set "YZ_ENTRYPOINT=%PROJECT_ROOT%\\console\\cli.py"
"%VENV_PYTHON%" "%YZ_ENTRYPOINT%" --yz-command %*
"@ | Set-Content -Path $YZ_LAUNCHER_PATH

# Alternative if `yz` is directly an entry point script created by pip
# $YZ_VENV_EXEC = Join-Path $VENV_DIR "Scripts\\yz.exe" # assuming pip creates .exe
# "@echo off`n\"$YZ_VENV_EXEC\" %*`n" | Set-Content -Path $YZ_LAUNCHER_PATH

# yazhi.cmd launcher
@"
@echo off
set "VENV_PYTHON=%VENV_DIR%\\Scripts\\python.exe"
set "YAZHI_ENTRYPOINT=%PROJECT_ROOT%\\console\\cli.py"
"%VENV_PYTHON%" "%YAZHI_ENTRYPOINT%" --yazhi-command %*
"@ | Set-Content -Path $YAZHI_LAUNCHER_PATH

# Alternative if `yazhi` is directly an entry point script created by pip
# $YAZHI_VENV_EXEC = Join-Path $VENV_DIR "Scripts\\yazhi.exe" # assuming pip creates .exe
# "@echo off`n\"$YAZHI_VENV_EXEC\" %*`n" | Set-Content -Path $YAZHI_LAUNCHER_PATH


Write-Host "[3/4] ${GREEN}✓ Created executable launchers:${RESET}"
Write-Host "      • ${YZ_LAUNCHER_PATH}"
Write-Host "      • ${YAZHI_LAUNCHER_PATH}"

# 5. Bootstrap Dev Security & Telemetry
Write-Host "[4/4] ${CYAN}Running diagnostics probe ('yz doctor')...${RESET}"
# Execute the doctor command using the newly created launcher
& "$YZ_LAUNCHER_PATH" doctor || Write-Host "${RED}Yazhi doctor command failed.${RESET}"

# 6. Shell PATH Advice
$PATH_EXPORT = "Add `$env:USERPROFILE\\.local\\bin` to your system PATH environment variable."
$CURRENT_PATH = [System.Environment]::GetEnvironmentVariable("Path", "User")
If ($CURRENT_PATH -notlike "*$DEST_BIN*") {
    Write-Host "`n${GOLD}Note: ${DEST_BIN} is not in your current PATH.${RESET}"
    Write-Host "Add it to your User or System PATH environment variable for easy access:"
    Write-Host "  ${CYAN}${PATH_EXPORT}${RESET}`n"
}

Write-Host "${GREEN}${BOLD}✓ Installation complete!${RESET}"
Write-Host "Try running:"
Write-Host "  ${GOLD}yz open${RESET}              # Launch interactive Agent Space TUI"
Write-Host "  ${GOLD}yz serve${RESET}             # Run gRPC Daemon (50051) + Operator Console"
Write-Host "  ${GOLD}yz keygen${RESET}            # Mint domain-scoped API keys"
Write-Host "  ${GOLD}yz collector-status${RESET}  # Inspect crawl frontier on disk`n"
