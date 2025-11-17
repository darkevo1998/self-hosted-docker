#!/usr/bin/env bash

set -euo pipefail

cyan() { printf '\033[36m%s\033[0m\n' "$1"; }
yellow() { printf '\033[33m%s\033[0m\n' "$1"; }
green() { printf '\033[32m%s\033[0m\n' "$1"; }
red() { printf '\033[31m%s\033[0m\n' "$1"; }

header_line="================================================"
echo
cyan "$header_line"
cyan "Activepieces Self-Hosted Setup"
cyan "Full Localization Support (macOS & Linux)"
cyan "$header_line"
echo

require_command() {
  local cmd="$1"
  local install_hint="$2"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    red "[ERROR] '$cmd' not found."
    [ -n "$install_hint" ] && yellow "$install_hint"
    exit 1
  fi
}

yellow "Checking Docker installation..."
require_command docker "Install Docker: https://docs.docker.com/engine/install/"
docker_version="$(docker --version 2>/dev/null || true)"
if [ -n "$docker_version" ]; then
  green "[OK] Docker found: $docker_version"
else
  red "[ERROR] Unable to determine Docker version."
  exit 1
fi

yellow "Verifying Docker daemon is running..."
if ! docker info >/dev/null 2>&1; then
  red "[ERROR] Docker daemon is not reachable."
  yellow "Please start Docker Desktop (macOS) or the Docker service (Linux)."
  exit 1
fi
green "[OK] Docker daemon is running."

compose_cmd="docker compose"
yellow "Checking Docker Compose..."
if $compose_cmd version >/dev/null 2>&1; then
  compose_version="$($compose_cmd version | head -n1)"
  green "[OK] Docker Compose plugin found: $compose_version"
elif command -v docker-compose >/dev/null 2>&1; then
  compose_cmd="docker-compose"
  compose_version="$(docker-compose version | head -n1)"
  green "[OK] docker-compose found: $compose_version"
else
  red "[ERROR] Docker Compose (plugin or legacy) not available."
  yellow "Install instructions: https://docs.docker.com/compose/install/"
  exit 1
fi

generate_hex() {
  local length="$1"
  if command -v python3 >/dev/null 2>&1; then
    python3 - "$length" <<'PY'
import os, sys
length = int(sys.argv[1])
print(os.urandom(length).hex())
PY
    return
  fi

  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex "$length"
    return
  fi

  # Fallback: read from /dev/urandom
  od -An -tx1 -N "$length" /dev/urandom | tr -d ' \n'
}

echo
yellow "Generating secure random values for environment variables..."
api_key="$(generate_hex 64)"
postgres_password="$(generate_hex 32)"
jwt_secret="$(generate_hex 32)"
encryption_key="$(generate_hex 16)"

cat_env() {
  cat <<EOF
# Activepieces Configuration
AP_API_KEY=$api_key
AP_POSTGRES_DATABASE=activepieces
AP_POSTGRES_USERNAME=activepieces
AP_POSTGRES_PASSWORD=$postgres_password
AP_POSTGRES_HOST=postgres
AP_POSTGRES_PORT=5432

# Optional: Redis configuration if you connect to an external instance
# AP_REDIS_HOST=
# AP_REDIS_PORT=6379

# Security
AP_JWT_SECRET=$jwt_secret
ENCRYPTION_KEY=$encryption_key

# Frontend/API URLs
AP_FRONTEND_URL=http://localhost:8080
AP_API_URL=http://localhost:8080/api

# Optional: Set default language (users can change in UI)
# Supported languages: ar, de, en, es, fr, ja, nl, pt, ru, zh, zh-TW
# AP_DEFAULT_LOCALE=en
EOF
}

echo
yellow "Creating .env file..."
if [ -f .env ]; then
  yellow "[WARNING] .env already exists."
  read -r -p "Overwrite with new secure values? (y/N) " overwrite
  if [[ "$overwrite" =~ ^[Yy]$ ]]; then
    cat_env > .env
    green "[OK] .env file recreated with fresh secrets."
  else
    yellow "Keeping existing .env file."
  fi
else
  cat_env > .env
  green "[OK] .env file created."
fi

if [ ! -d cache ]; then
  mkdir -p cache
  green "[OK] Created cache directory."
fi

echo
yellow "Starting Activepieces with Docker Compose..."
yellow "This may take a few minutes on first run while images build/pull."
echo

if ! $compose_cmd -p activepieces up -d; then
  red "[ERROR] Failed to start Docker Compose."
  yellow "Try running manually: $compose_cmd -p activepieces up -d"
  exit 1
fi

echo
cyan "$header_line"
green "Setup Complete!"
cyan "$header_line"
echo
cyan "Access Activepieces at: http://localhost:8080"
echo
yellow "To change language:"
printf '  1. Open http://localhost:8080 in your browser\n'
printf '  2. Create your admin account\n'
printf '  3. Go to Profile/Settings\n'
printf '  4. Select your preferred language\n'
printf '  5. The interface switches instantly\n'
echo
yellow "Useful commands:"
printf '  View logs: %s -p activepieces logs -f\n' "$compose_cmd"
printf '  Stop:      %s -p activepieces stop\n' "$compose_cmd"
printf '  Start:     %s -p activepieces start\n' "$compose_cmd"
printf '  Restart:   %s -p activepieces restart\n' "$compose_cmd"
echo
green "Happy automating! 🎉"


