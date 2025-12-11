#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.scrapers"
LOADER_POSIX="$ROOT_DIR/scripts/load_scraper_env.sh"
LOADER_POWERSHELL="$ROOT_DIR/scripts/load_scraper_env.ps1"
LOADER_BATCH="$ROOT_DIR/scripts/load_scraper_env.bat"
HOOK_MARKER="crawl4AI scraper env"

if [[ -f "$ENV_FILE" ]]; then
  echo "Loading scraper environment variables from $ENV_FILE"
  set -a
  # shellcheck source=/dev/null
  source "$ENV_FILE"
  set +a
else
  echo "No $ENV_FILE file found. Create one to override scraper URLs."
fi

command -v python3 >/dev/null 2>&1 || { echo "python3 is required"; exit 1; }

append_posix_hook() {
  local activate_file="$1"
  [[ -f "$activate_file" ]] || return 0

  python3 - "$activate_file" "$HOOK_MARKER" <<'PY'
import pathlib
import re
import sys

path = pathlib.Path(sys.argv[1])
marker = sys.argv[2]
text = path.read_text()
start = f"# >>> {marker} >>>"
end = f"# <<< {marker} <<<"
pattern = re.compile(rf"\n?{re.escape(start)}.*?{re.escape(end)}\n?", re.S)
text = pattern.sub("\n", text)
text = text.rstrip("\n") + "\n"
path.write_text(text)
PY

  cat <<EOF_HOOK >> "$activate_file"

# >>> $HOOK_MARKER >>>
if [ -f "$LOADER_POSIX" ]; then
  SCRAPER_ENV_ROOT="$ROOT_DIR"
  . "$LOADER_POSIX" "$ROOT_DIR"
  unset SCRAPER_ENV_ROOT
fi
# <<< $HOOK_MARKER <<<
EOF_HOOK
}

append_batch_hook() {
  local activate_file="$1"
  local loader_path="$2"
  [[ -f "$activate_file" ]] || return 0
  if grep -Fq "$HOOK_MARKER" "$activate_file"; then
    return
  fi
  cat <<EOF_HOOK >> "$activate_file"



REM >>> $HOOK_MARKER >>>

IF EXIST "$loader_path" CALL "$loader_path"

REM <<< $HOOK_MARKER <<<

EOF_HOOK
}

append_ps_hook() {
  local activate_file="$1"
  local loader_path="$2"
  [[ -f "$activate_file" ]] || return 0
  if grep -Fq "$HOOK_MARKER" "$activate_file"; then
    return
  fi
  cat <<EOF_HOOK >> "$activate_file"

# >>> $HOOK_MARKER >>>
\$scraperEnvScript = '$loader_path'
if (Test-Path \$scraperEnvScript) {
    . \$scraperEnvScript
}
# <<< $HOOK_MARKER <<<
EOF_HOOK
}

to_windows_path() {
  local path="$1"
  if command -v cygpath >/dev/null 2>&1; then
    cygpath -w "$path"
  else
    printf '%s' "$path"
  fi
}

install_scraper_env_hooks() {
  local env_dir="$1"
  append_posix_hook "$env_dir/bin/activate" || true
  append_posix_hook "$env_dir/Scripts/activate" || true

  local win_activate_dir="$env_dir/Scripts"
  local batch_loader
  batch_loader=$(to_windows_path "$LOADER_BATCH")
  append_batch_hook "$win_activate_dir/activate.bat" "$batch_loader" || true

  local ps_loader
  ps_loader=$(to_windows_path "$LOADER_POWERSHELL")
  append_ps_hook "$win_activate_dir/Activate.ps1" "$ps_loader" || true
}

select_activate_script() {
  local env_dir="$1"
  local candidate
  for candidate in \
    "$env_dir/bin/activate" \
    "$env_dir/Scripts/activate" \
    "$env_dir/Scripts/Activate.ps1"; do
    if [[ -f "$candidate" ]]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done
  return 1
}

create_env() {
  local env_dir="$1"
  local requirements_file="$2"

  local uname_out
  uname_out="$(uname -s 2>/dev/null || echo '')"

  if [[ ! -f "$requirements_file" ]]; then
    echo "Requirements file not found: $requirements_file" >&2
    exit 1
  fi

  if [[ -d "$env_dir" ]]; then
    if [[ ! -f "$env_dir/bin/activate" && -f "$env_dir/Scripts/activate" ]]; then
      if [[ "${uname_out,,}" == linux* || "${uname_out,,}" == darwin* ]]; then
        if grep -q $'\r' "$env_dir/Scripts/activate" 2>/dev/null; then
          echo "Existing virtual environment $env_dir looks Windows-style; recreating for POSIX"
          rm -rf "$env_dir"
        else
          echo "Existing virtual environment $env_dir uses Windows layout; recreating for POSIX"
          rm -rf "$env_dir"
        fi
      fi
    fi
  fi

  if [[ ! -d "$env_dir" ]]; then
    echo "Creating virtual environment $env_dir"
    python3 -m venv "$env_dir"
  else
    echo "Using existing virtual environment $env_dir"
  fi

  local activate_script
  if ! activate_script=$(select_activate_script "$env_dir"); then
    cat <<EOF >&2
Could not find an activation script in $env_dir.
Checked bin/activate, Scripts/activate, and Scripts/Activate.ps1.
EOF
    exit 1
  fi

  if [[ "$activate_script" == *.ps1 ]]; then
    cat <<EOF >&2
Found only a PowerShell activation script ($activate_script).
Re-run this helper from PowerShell or ensure a POSIX activate script exists.
EOF
    exit 1
  fi

  # shellcheck disable=SC1090
  source "$activate_script"
  python -m pip install --upgrade pip
  python -m pip install -r "$requirements_file"

  local playwright_args=(install chromium)
  if [[ "${uname_out,,}" == linux* ]]; then
    playwright_args=(install --with-deps chromium)
  fi
  python -m playwright "${playwright_args[@]}"
  deactivate

  install_scraper_env_hooks "$env_dir"
}

create_env "$ROOT_DIR/.venv-c4ai-v1" "$ROOT_DIR/crawl4AI-agent/requirements.txt"
create_env "$ROOT_DIR/.venv-c4ai-v2" "$ROOT_DIR/crawl4AI-agent-v2/requirements.txt"

echo "Virtual environments ready."
