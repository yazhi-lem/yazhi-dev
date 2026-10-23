#!/usr/bin/env bash
# ==============================================================================
# Yazhi Sovereign CLI Installer & Environment Linker (`yz` / `yazhi`)
# Designed for curl installation from yazhi-dev and local sovereign nodes.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/yazhi-lem/yazhi-api/main/install.sh | bash # Example: remote install from yazhi-api project
#   or locally: ./install.sh
# ==============================================================================

set -euo pipefail

# ANSI color styling matching Yazhi brand kit
BOLD="\033[1m"
GOLD="\033[38;2;211;179;106m"
CYAN="\033[38;2;56;189;248m"
GREEN="\033[38;2;16;185;129m"
RED="\033[38;2;244;63;94m"
RESET="\033[0m"

echo -e "${GOLD}"
cat << 'EOF'
                                           ▐█▓▓░         ▐█▓▓░      
                   ▄░░▄▄       ▄▄▄▄▄▄▄     ▐▓▓▒░▄▄▄▄     ▐▀▀▀░      
 ▄▄▄▓    ▓ ▄    ▄ ░░▒▀▓▓▄▄▄  ▐█▄▓▓▒░░▓▓ ▄  ▐▓▓▓▓▓▀▒▓▓ ▄  ▀▓▓▓▓▀     
▐▓▓▓▀    █░█▌   ░░█▀  ▀▀▓▓▌▌  ▀▀▀▀▀  ▀█░█▌ ▐▓▓▓▀   ▀█░█▌ ▐▓▓▓▓      
▓▓▓▌▌ ░░░▐███ ▐   ▌░░░ ▐▐▓▓▌ ░▄█▄▓▓▒░██▀▀  ▓▓▓▌█ ░░░▐███ ▓▓▓▓█      
▐▀▓▀ ▄  ▄ ░█ ▐▓▓      ▐▀▓▌▌ ▐▀▓▀ ▄  ▄▄▄█▌ ▓▀▓▀  ░░░▐▓██ ▓▀▓██      
 ▀  ░░   ░▒▒░  ▀█░ ▄▄▄░ ░░░  ▀  ░░   ░░██ ██  ░ ░░░▐░██ █████      
    ▀▀░▀▀█░▓░     ▀▀▀▀░▒▒▀▀▀     ▀▀░▀▀▀▀   ▀▀▀▀▀    ▀▀▀▀ ▀▀▀▀       
  ▄▄▄▄▄▄█▒█▀
EOF
echo -e "${RESET}"

echo -e "${BOLD}${GOLD}YAZHI SOVEREIGN CLI INSTALLER (v0.3.0)${RESET}"
echo -e "${CYAN}Installing 'yz' and 'yazhi' CLI binaries into local system environment...${RESET}\n"

# 1. Target Directories
DEST_BIN="${HOME}/.local/bin"
mkdir -p "${DEST_BIN}"

# Determine repository root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]:-$0}" )" &> /dev/null && pwd )"
PROJECT_ROOT="${SCRIPT_DIR}"

if [ ! -f "${PROJECT_ROOT}/pyproject.toml" ]; then
    # If running via remote curl pipe, check if yazhi-api exists in standard workspace
    if [ -d "${HOME}/Yazhi/repos/yazhi-api" ]; then
        PROJECT_ROOT="${HOME}/Yazhi/repos/yazhi-api"
    elif [ -d "$(pwd)/repos/yazhi-api" ]; then
        PROJECT_ROOT="$(pwd)/repos/yazhi-api"
    elif [ -d "$(pwd)" ] && [ -f "$(pwd)/pyproject.toml" ]; then
        PROJECT_ROOT="$(pwd)"
    else
        echo -e "${RED}[ERROR] Could not locate yazhi-api repository root.${RESET}"
        echo -e "Please clone repository first or run within the workspace."
        exit 1
    fi
fi

echo -e "[1/4] ${CYAN}Targeting repository at:${RESET} ${PROJECT_ROOT}"

# 2. Virtual environment verification
VENV_DIR="${PROJECT_ROOT}/.venv"

if [ ! -f "${VENV_DIR}/bin/python" ]; then
    echo -e "[2/4] ${GOLD}Creating virtual environment at ${VENV_DIR}...${RESET}"
    python3 -m venv "${VENV_DIR}"
fi

# 3. Install / Link CLI package
echo -e "[2/4] ${CYAN}Building and linking Yazhi CLI in editable mode...${RESET}"
"${VENV_DIR}/bin/pip" install -q --upgrade pip
"${VENV_DIR}/bin/pip" install -q -e "${PROJECT_ROOT}"

# 4. Generate Launcher Wrappers in ~/.local/bin
cat << EOF > "${DEST_BIN}/yz"
#!/usr/bin/env bash
exec "${VENV_DIR}/bin/yz" "\$@"
EOF
chmod +x "${DEST_BIN}/yz"

cat << EOF > "${DEST_BIN}/yazhi"
#!/usr/bin/env bash
exec "${VENV_DIR}/bin/yazhi" "\$@"
EOF
chmod +x "${DEST_BIN}/yazhi"

echo -e "[3/4] ${GREEN}✓ Created executable launchers:${RESET}"
echo -e "      • ${DEST_BIN}/yz"
echo -e "      • ${DEST_BIN}/yazhi"

# 5. Bootstrap Dev Security & Telemetry
echo -e "[4/4] ${CYAN}Running diagnostics probe ('yz doctor')...${RESET}"
"${DEST_BIN}/yz" doctor || true

# 6. Shell PATH Advice
PATH_EXPORT='export PATH="$HOME/.local/bin:$PATH"'
if [[ ":$PATH:" != *":${DEST_BIN}:"* ]]; then
    echo -e "\n${GOLD}Note: ${DEST_BIN} is not in your current PATH.${RESET}"
    echo -e "Add it to your shell config (~/.bashrc or ~/.zshrc):"
    echo -e "  ${CYAN}${PATH_EXPORT}${RESET}\n"
fi

echo -e "${GREEN}${BOLD}✓ Installation complete!${RESET}"
echo -e "Try running:"
echo -e "  ${GOLD}yz open${RESET}              # Launch interactive Agent Space TUI"
echo -e "  ${GOLD}yz serve${RESET}             # Run gRPC Daemon (50051) + Operator Console"
echo -e "  ${GOLD}yz keygen${RESET}            # Mint domain-scoped API keys"
echo -e "  ${GOLD}yz collector-status${RESET}  # Inspect crawl frontier on disk\n"
