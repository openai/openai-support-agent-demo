#!/bin/sh
set -e

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

if [ -x "$ROOT_DIR/scripts/setup_crawler_envs.sh" ]; then
  POSIX_VENV_FOUND=0
  for venv_dir in \
    "$ROOT_DIR/.venv-c4ai-v2" \
    "$ROOT_DIR/.venv-c4ai-v1"; do
    if [ -f "$venv_dir/bin/activate" ]; then
      POSIX_VENV_FOUND=1
      break
    fi
  done

  if [ "$POSIX_VENV_FOUND" -eq 0 ] || [ "${FORCE_CRAWLER_SETUP:-0}" -eq 1 ]; then
    echo "Ensuring crawler environments are provisioned..."
    bash "$ROOT_DIR/scripts/setup_crawler_envs.sh"
  else
    echo "Skipping crawler provisioning; existing POSIX virtualenv detected (set FORCE_CRAWLER_SETUP=1 to rebuild)."
  fi
fi

activate_venv() {
  for venv_dir in \
    "$ROOT_DIR/.venv-c4ai-v2" \
    "$ROOT_DIR/.venv-c4ai-v1"; do
    if [ -f "$venv_dir/bin/activate" ]; then
      echo "Activating crawler virtualenv at $venv_dir"
      # shellcheck disable=SC1090
      . "$venv_dir/bin/activate"
      export SCRAPE_WORKER_PYTHON="$venv_dir/bin/python"
      return 0
    fi
  done

  echo "No crawler virtualenv found to activate; proceeding without one."
  return 0
}

activate_venv

# Defensive check: bail out early if any migration directories are missing their SQL file.
MISSING_MIGRATIONS=$(find prisma/migrations -mindepth 1 -maxdepth 1 -type d \
  ! -name "migration_lock.toml" \
  -print | while read dir; do
    if [ ! -f "$dir/migration.sql" ]; then
      echo "$dir"
    fi
  done)

if [ -n "$MISSING_MIGRATIONS" ]; then
  echo "Missing migration.sql in the following directories:"
  echo "$MISSING_MIGRATIONS"
  echo "Please rebuild the ai-agent image (e.g., docker compose build --no-cache ai-agent) so Prisma migrations are included."
  exit 1
fi

npx prisma migrate deploy
npm run start:all
