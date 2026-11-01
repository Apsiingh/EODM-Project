<#
.SYNOPSIS
    Automated Database Migration Runner for Enterprise Optical Document Management (EODM) Platform.
.DESCRIPTION
    Executes 01_schema_init.sql and 02_seed_data.sql against PostgreSQL via Docker or local psql.
    Automatically reads database passwords and configuration from root .env.
#>

param(
    [string]$DbHost,
    [int]$Port = 0,
    [string]$Database,
    [string]$User,
    [string]$Password,
    [string]$ContainerName = "ocr-postgres"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$rootDir = Split-Path -Parent $scriptDir
$envFile = Join-Path $rootDir ".env"

# Auto-load variables from .env if present
$envMap = @{}
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $envMap[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
}

# Resolve parameters with fallback to .env and then defaults
if (-not $DbHost) { $DbHost = if ($envMap.ContainsKey("POSTGRES_HOST")) { $envMap["POSTGRES_HOST"] } else { "localhost" } }
if ($Port -eq 0) { $Port = if ($envMap.ContainsKey("POSTGRES_PORT")) { [int]$envMap["POSTGRES_PORT"] } else { 5432 } }
if (-not $Database) { $Database = if ($envMap.ContainsKey("POSTGRES_DB")) { $envMap["POSTGRES_DB"] } else { "enterprise_ocr" } }
if (-not $User) { $User = if ($envMap.ContainsKey("POSTGRES_USER")) { $envMap["POSTGRES_USER"] } else { "postgres" } }
if (-not $Password) { $Password = if ($envMap.ContainsKey("POSTGRES_PASSWORD")) { $envMap["POSTGRES_PASSWORD"] } else { "welcome" } }

$schemaFile = Join-Path $scriptDir "01_schema_init.sql"
$seedFile = Join-Path $scriptDir "02_seed_data.sql"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  EODM Database Migration Runner" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if Docker daemon is running
$dockerOnline = $false
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        $dockerOnline = $true
    }
} catch {
    $dockerOnline = $false
}

if ($dockerOnline) {
    # Check if container is running
    $containerRunning = $false
    try {
        $state = docker inspect --format="{{.State.Running}}" $ContainerName 2>$null
        if ($state -eq "true") { $containerRunning = $true }
    } catch {
        $containerRunning = $false
    }

    if ($containerRunning) {
        Write-Host "[INFO] Detected active PostgreSQL container: '$ContainerName'" -ForegroundColor Green
        Write-Host "[INFO] Applying 01_schema_init.sql..." -ForegroundColor Yellow
        Get-Content $schemaFile -Raw | docker exec -i $ContainerName psql -U $User -d $Database

        if ($LASTEXITCODE -eq 0) {
            Write-Host "[SUCCESS] Schema initialized successfully!" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Failed to apply schema." -ForegroundColor Red
            exit 1
        }

        Write-Host "[INFO] Applying 02_seed_data.sql..." -ForegroundColor Yellow
        Get-Content $seedFile -Raw | docker exec -i $ContainerName psql -U $User -d $Database

        if ($LASTEXITCODE -eq 0) {
            Write-Host "[SUCCESS] Master seed data applied successfully!" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Failed to apply seed data." -ForegroundColor Red
            exit 1
        }

        Write-Host "==========================================================" -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host "[WARN] Container '$ContainerName' is not currently running." -ForegroundColor Yellow
        Write-Host "[TIP] Start the database container with:" -ForegroundColor White
        Write-Host "      cd infrastructure/docker; docker compose up -d" -ForegroundColor White
        Write-Host "==========================================================" -ForegroundColor Cyan
        exit 1
    }
}

# Fallback: check if local psql command exists
$psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlCmd) {
    Write-Host "[INFO] Docker not active. Using local psql command on ${DbHost}:${Port}..." -ForegroundColor Green
    $env:PGPASSWORD = $Password
    psql -h $DbHost -p $Port -U $User -d $Database -f $schemaFile
    psql -h $DbHost -p $Port -U $User -d $Database -f $seedFile
    $env:PGPASSWORD = $null
    Write-Host "[SUCCESS] Migrations completed via local psql!" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Cyan
    exit 0
}

# If neither is available, display helpful resolution steps
Write-Host ""
Write-Host "[NOTICE] Docker Desktop is currently stopped, and 'psql' is not installed in PATH." -ForegroundColor Yellow
Write-Host ""
Write-Host "To run the PostgreSQL database and execute migrations:" -ForegroundColor White
Write-Host "  1. Start the Docker Desktop application on your Windows machine." -ForegroundColor White
Write-Host "  2. Once Docker Desktop is running, start the database with:" -ForegroundColor White
Write-Host "     cd infrastructure/docker" -ForegroundColor White
Write-Host "     docker compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "Note: The migrations in 'migration/' are automatically mounted and executed" -ForegroundColor Cyan
Write-Host "      by PostgreSQL whenever the container boots!" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
