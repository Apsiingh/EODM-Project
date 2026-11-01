#!/usr/bin/env bash
# ==============================================================================
# Enterprise Optical Document Management (EODM) Platform
# Bash Migration Runner
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load .env if present
if [ -f "$ROOT_DIR/.env" ]; then
    set -a
    source "$ROOT_DIR/.env"
    set +a
fi

CONTAINER_NAME=${CONTAINER_NAME:-"ocr-postgres"}
DB_USER=${POSTGRES_USER:-"postgres"}
DB_NAME=${POSTGRES_DB:-"enterprise_ocr"}
DB_PASS=${POSTGRES_PASSWORD:-"welcome"}
DB_HOST=${POSTGRES_HOST:-"localhost"}
DB_PORT=${POSTGRES_PORT:-5432}

echo "=========================================================="
echo "  EODM Database Migration Runner"
echo "=========================================================="

# Check if Docker daemon is running
DOCKER_ONLINE=false
if command -v docker >/dev/null 2>&1; then
    if docker info >/dev/null 2>&1; then
        DOCKER_ONLINE=true
    fi
fi

if [ "$DOCKER_ONLINE" = true ]; then
    # Check if container is running
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo "[INFO] Detected active PostgreSQL container: '$CONTAINER_NAME'"
        echo "[INFO] Applying 01_schema_init.sql..."
        docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$SCRIPT_DIR/01_schema_init.sql"
        echo "[INFO] Applying 02_seed_data.sql..."
        docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$SCRIPT_DIR/02_seed_data.sql"
        echo "[SUCCESS] All database migrations applied successfully to container!"
        echo "=========================================================="
        exit 0
    else
        echo "[WARN] Container '$CONTAINER_NAME' is not currently running."
        echo "[TIP] Start the database container with:"
        echo "      cd \"$ROOT_DIR/infrastructure/docker\" && docker compose up -d"
        echo "=========================================================="
        exit 1
    fi
fi

# Fallback: check if local psql command exists
if command -v psql >/dev/null 2>&1; then
    echo "[INFO] Docker not active. Using local psql command on $DB_HOST:$DB_PORT..."
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SCRIPT_DIR/01_schema_init.sql"
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SCRIPT_DIR/02_seed_data.sql"
    echo "[SUCCESS] Migrations completed via local psql!"
    echo "=========================================================="
    exit 0
fi

# If neither is available, display helpful resolution steps
echo ""
echo "[NOTICE] Docker Desktop is currently stopped, and 'psql' is not installed in PATH."
echo ""
echo "To run the PostgreSQL database and execute migrations:"
echo "  1. Start the Docker Desktop application on your Windows machine."
echo "  2. Once Docker Desktop is running, start the database with:"
echo "     cd \"$ROOT_DIR/infrastructure/docker\""
echo "     docker compose up -d"
echo ""
echo "Note: The migrations in 'migration/' are automatically mounted and executed"
echo "      by PostgreSQL whenever the container boots!"
echo "=========================================================="
