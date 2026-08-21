#!/usr/bin/env bash
#
# Yazhi local installer — https://yazhi.dev/install
#
#     curl -fsSL https://yazhi.dev/install | bash
#
# Read it before you run it; that is the point of publishing it in the clear.
#
# PUBLISHED COPY. Canonical source: bin/install-yazhi.sh in the private
# yazhi-api repository. To check this copy is current, compare the canonical
# file's blob hash:
#
#     git -C yazhi-api rev-parse main:bin/install-yazhi.sh
#     # expect: b594bc5e9ae9b0330db8d502bd4caa81004f77d4
#
# A blob hash is used rather than a commit sha because it is content
# addressed: it survives the squash merges this repo uses, where a branch
# commit stops existing on main and a commit-based reference goes dead.
#
# What this does: installs the Yazhi console TUI and CLI into a virtualenv
# in a checkout of yazhi-api. yazhi-api is a PRIVATE repository, so the
# clone step needs an authorised SSH key — this script being public does not
# make the source public. If you do not have access the clone fails and
# tells you to check `ssh -T git@github.com`.
#
#
# Install yazhi locally and put the Agent Space TUI on your PATH.
#
# Scope: the console TUI only. It drives YazhiOrchestrator in-process and
# defaults to the local-first model registry — in-house workers, then a local
# Ollama, then an offline echo fixture — so it needs no API keys, no cloud
# calls and no running server. To run the gRPC server, HTTP shim and web
# console instead, use ./run.sh.
#
#   ./bin/install-yazhi.sh              # install into ./.venv
#   ./bin/install-yazhi.sh --dev        # also install dev deps (pytest, ruff, mypy)
#   ./bin/install-yazhi.sh --prefix ~/.local/bin
#   ./bin/install-yazhi.sh --uninstall
#
# Bootstrap (run from outside a checkout — clones first, then installs):
#
#   ./install-yazhi.sh --bootstrap
#   YAZHI_REPO=git@github.com:yazhi-lem/yazhi-api.git ./install-yazhi.sh --bootstrap
#   YAZHI_DIR=~/src/yazhi-api ./install-yazhi.sh --bootstrap
#
# Yazhi is a private repo and README.md says Git-over-SSH only, so bootstrap
# clones over SSH by default rather than fetching an archive over HTTPS.
#
# Afterwards: `yazhi-tui` (or `.venv/bin/yazhi-tui` if you skipped the shim).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV="$REPO_ROOT/.venv"
PREFIX="${HOME}/.local/bin"
EXTRAS=""
UNINSTALL=0
BOOTSTRAP=0
MIN_PY_MINOR=11
YAZHI_REPO="${YAZHI_REPO:-git@github.com:yazhi-lem/yazhi-api.git}"
YAZHI_DIR="${YAZHI_DIR:-${HOME}/yazhi-api}"
YAZHI_REF="${YAZHI_REF:-main}"

log()  { printf '  %s\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }
die()  { printf '\n\033[31merror:\033[0m %s\n' "$*" >&2; exit 1; }

while [ $# -gt 0 ]; do
  case "$1" in
    --dev)       EXTRAS="[dev]"; shift ;;
    --prefix)    PREFIX="${2:?--prefix needs a directory}"; shift 2 ;;
    --uninstall) UNINSTALL=1; shift ;;
    --bootstrap) BOOTSTRAP=1; shift ;;
    -h|--help)   sed -n '3,25p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *)           die "unknown option: $1 (try --help)" ;;
  esac
done

if [ "$UNINSTALL" -eq 1 ]; then
  echo "Uninstalling yazhi"
  for cmd in yazhi-tui yz yazhi; do
    if [ -L "$PREFIX/$cmd" ]; then
      rm -f "$PREFIX/$cmd"; ok "removed $PREFIX/$cmd"
    else
      log "no shim at $PREFIX/$cmd"
    fi
  done
  if [ -d "$VENV" ]; then
    rm -rf "$VENV"; ok "removed $VENV"
  else
    log "no virtualenv at $VENV"
  fi
  echo; ok "done — the repo itself is untouched"
  exit 0
fi

echo "Installing yazhi (console TUI)"
echo

# --- bootstrap: get a checkout before anything else ------------------------
# Piped through a shell (curl ... | bash) there is no repo around the script,
# so BASH_SOURCE points at /dev/stdin and REPO_ROOT is meaningless. Detect
# that and clone, rather than failing with a confusing pip error.
if [ "$BOOTSTRAP" -eq 1 ] || [ ! -f "$REPO_ROOT/pyproject.toml" ]; then
  command -v git >/dev/null 2>&1 || die "git is required to bootstrap. Install git and retry."
  if [ -d "$YAZHI_DIR/.git" ]; then
    log "updating existing checkout at $YAZHI_DIR"
    git -C "$YAZHI_DIR" fetch --quiet origin "$YAZHI_REF" || die "git fetch failed"
    git -C "$YAZHI_DIR" checkout --quiet "$YAZHI_REF" || die "git checkout $YAZHI_REF failed"
    git -C "$YAZHI_DIR" merge --quiet --ff-only "origin/$YAZHI_REF" 2>/dev/null || \
      warn "could not fast-forward $YAZHI_REF — leaving the checkout as-is"
  else
    log "cloning $YAZHI_REPO into $YAZHI_DIR"
    git clone --quiet --branch "$YAZHI_REF" "$YAZHI_REPO" "$YAZHI_DIR" || die "git clone failed.

Yazhi is a private repository. Check that your SSH key is authorised:
    ssh -T git@github.com
Or point at a different remote:
    YAZHI_REPO=<url> $0 --bootstrap"
  fi
  REPO_ROOT="$YAZHI_DIR"
  VENV="$REPO_ROOT/.venv"
  ok "checkout ready at $REPO_ROOT"
fi

# --- Python ---------------------------------------------------------------
PY=""
for c in python3.13 python3.12 python3.11 python3; do
  command -v "$c" >/dev/null 2>&1 || continue
  minor="$("$c" -c 'import sys; print(sys.version_info[1])' 2>/dev/null || echo 0)"
  major="$("$c" -c 'import sys; print(sys.version_info[0])' 2>/dev/null || echo 0)"
  if [ "$major" -eq 3 ] && [ "$minor" -ge "$MIN_PY_MINOR" ]; then PY="$c"; break; fi
done
[ -n "$PY" ] || die "need Python 3.$MIN_PY_MINOR+ (pyproject requires-python). None found on PATH."
ok "python: $($PY --version 2>&1) ($(command -v "$PY"))"

# --- virtualenv -----------------------------------------------------------
if [ -d "$VENV" ]; then
  log "reusing virtualenv at $VENV"
else
  "$PY" -m venv "$VENV" || die "could not create a virtualenv at $VENV.
On Debian/Ubuntu you may need: sudo apt install python3-venv"
  ok "created $VENV"
fi

"$VENV/bin/python" -m pip install --quiet --upgrade pip >/dev/null 2>&1 || \
  warn "could not upgrade pip — continuing"

# --- project --------------------------------------------------------------
log "installing project${EXTRAS:+ with dev extras} (this takes a minute)"
# Install the checkout explicitly, not ".", so this works regardless of the
# directory the script was invoked from — including piped through a shell.
"$VENV/bin/pip" install --quiet -e "${REPO_ROOT}${EXTRAS}" || die "pip install failed. Re-run without --quiet to see why:
  $VENV/bin/pip install -e \"${REPO_ROOT}${EXTRAS}\""
ok "installed yazhi-api and dependencies"

# --- verify ---------------------------------------------------------------
cd "$REPO_ROOT"
"$VENV/bin/python" - <<'PY' || die "the install imports but the agent registry does not load"
from agents.agent_registry import AgentRegistry
agents = AgentRegistry.default().list_agents()
print(f"  \033[32m✓\033[0m agent registry: {len(agents)} agents — {', '.join(agents)}")
PY

for cmd in yazhi-tui yz yazhi; do
  [ -x "$VENV/bin/$cmd" ] || die "$cmd was not installed into $VENV/bin"
done
ok "entry points present: yazhi-tui, yz, yazhi"

# --- PATH shim ------------------------------------------------------------
if mkdir -p "$PREFIX" 2>/dev/null; then
  for cmd in yazhi-tui yz yazhi; do
    ln -sf "$VENV/bin/$cmd" "$PREFIX/$cmd"
  done
  ok "linked yazhi-tui, yz and yazhi into $PREFIX"
  case ":$PATH:" in
    *":$PREFIX:"*) ;;
    *) warn "$PREFIX is not on your PATH — add it, or run $VENV/bin/yazhi-tui" ;;
  esac
else
  warn "could not write to $PREFIX — run $VENV/bin/yazhi-tui directly"
fi

cat <<EOF

Done. Start Agent Space (the console TUI) with:

    yazhi-tui
    yazhi-tui --echo     offline fixture only, no local backend probing
    yazhi-tui --live     real in-house workers / OpenRouter instead of local-first

Or run the daemon and operator console together:

    yz serve             gRPC daemon + console  (`yazhi` is the same command)
    yz --help            every subcommand

Also in this virtualenv: yazhi-legal, yazhi-education, yazhi-insight.
Remove everything with: ./bin/install-yazhi.sh --uninstall
EOF
