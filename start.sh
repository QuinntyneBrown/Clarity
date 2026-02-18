#!/usr/bin/env bash
# Start Clarity via Aspire AppHost.
# Aspire orchestrates: SQL Server (Docker container), API (port 50124), Angular frontend.
#
# Prerequisites:
#   - Docker Desktop must be running (Aspire uses it for the SQL Server container)
#   - .NET 9 SDK
#   - Node.js / npm

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# --- Preflight: check Docker ---
if ! docker info > /dev/null 2>&1; then
  echo "ERROR: Docker is not running."
  echo "Aspire needs Docker Desktop to spin up the SQL Server container."
  echo "Please start Docker Desktop and try again."
  exit 1
fi

echo "Starting Clarity via Aspire AppHost..."
echo ""
echo "Aspire will start:"
echo "  - SQL Server   (Docker container)"
echo "  - Backend API   https://localhost:50124"
echo "  - Angular frontend (Aspire-managed port)"
echo "  - Aspire Dashboard https://localhost:17171"
echo ""

dotnet run --project src/Clarity.AppHost
