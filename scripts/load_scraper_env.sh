#!/usr/bin/env sh
# shellcheck shell=sh
set -e

resolve_project_root() {
  if [ -n "${SCRAPER_ENV_ROOT:-}" ]; then
    printf '%s\n' "$SCRAPER_ENV_ROOT"
    return
  fi

  if [ -n "${1:-}" ]; then
    printf '%s\n' "$1"
    return
  fi

  script_path="$0"
  if [ -n "${BASH_SOURCE:-}" ]; then
    script_path="${BASH_SOURCE}"
  fi

  if project_dir=$(cd "$(dirname "$script_path")/.." 2>/dev/null && pwd); then
    printf '%s\n' "$project_dir"
    return
  fi

  pwd
}

PROJECT_ROOT="$(resolve_project_root "$1")"
SCRAPER_ENV_FILE="${SCRAPER_ENV_FILE:-$PROJECT_ROOT/.env.scrapers}"

if [ ! -f "$SCRAPER_ENV_FILE" ]; then
  return 0 2>/dev/null || exit 0
fi

set -a
. "$SCRAPER_ENV_FILE"
set +a
