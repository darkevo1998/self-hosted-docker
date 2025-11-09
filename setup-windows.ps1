# Activepieces Self-Hosted Setup Script for Windows
# This script helps set up Activepieces with full localization support

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Activepieces Self-Hosted Setup" -ForegroundColor Cyan
Write-Host "Full Localization Support" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "[OK] Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is available
Write-Host "Checking Docker Compose..." -ForegroundColor Yellow
try {
    $composeVersion = docker compose version
    Write-Host "[OK] Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker Compose is not available" -ForegroundColor Red
    exit 1
}

# Generate secure random values
Write-Host ""
Write-Host "Generating secure random values for environment variables..." -ForegroundColor Yellow

function Generate-RandomHex {
    param([int]$Length)
    $bytes = New-Object byte[] $Length
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    return ($bytes | ForEach-Object { $_.ToString("x2") }) -join ''
}

$apiKey = Generate-RandomHex 64
$postgresPassword = Generate-RandomHex 32
$jwtSecret = Generate-RandomHex 32
$encryptionKey = Generate-RandomHex 16

# Create .env file
Write-Host "Creating .env file..." -ForegroundColor Yellow

$envContent = @"
# Activepieces Configuration
AP_API_KEY=$apiKey
AP_POSTGRES_DATABASE=activepieces
AP_POSTGRES_USERNAME=activepieces
AP_POSTGRES_PASSWORD=$postgresPassword
AP_POSTGRES_HOST=postgres
AP_POSTGRES_PORT=5432

# Redis Configuration
AP_REDIS_HOST=redis
AP_REDIS_PORT=6379

# Security
AP_JWT_SECRET=$jwtSecret
ENCRYPTION_KEY=$encryptionKey

# Frontend/API URLs
AP_FRONTEND_URL=http://localhost:8080
AP_API_URL=http://localhost:8080/api

# Optional: Set default language (users can change in UI)
# Supported languages: ar, de, en, es, fr, ja, nl, pt, ru, zh, zh-TW
# AP_DEFAULT_LOCALE=en
"@

if (Test-Path .env) {
    Write-Host "[WARNING] .env file already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Keeping existing .env file" -ForegroundColor Yellow
    } else {
        $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
        Write-Host "[OK] .env file created with secure random values" -ForegroundColor Green
    }
} else {
    $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
    Write-Host "[OK] .env file created with secure random values" -ForegroundColor Green
}

# Create cache directory if it doesn't exist
if (-not (Test-Path cache)) {
    New-Item -ItemType Directory -Path cache | Out-Null
    Write-Host "[OK] Created cache directory" -ForegroundColor Green
}

# Start Docker Compose
Write-Host ""
Write-Host "Starting Activepieces with Docker Compose..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run as it downloads images..." -ForegroundColor Yellow
Write-Host ""

try {
    docker compose -p activepieces up -d
    Write-Host ""
    Write-Host "[OK] Activepieces started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "Setup Complete!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Access Activepieces at: http://localhost:8080" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To change language:" -ForegroundColor Yellow
    Write-Host "1. Open http://localhost:8080 in your browser" -ForegroundColor White
    Write-Host "2. Create your admin account" -ForegroundColor White
    Write-Host "3. Go to Profile/Settings" -ForegroundColor White
    Write-Host "4. Select your preferred language" -ForegroundColor White
    Write-Host "5. The entire interface will switch to your language" -ForegroundColor White
    Write-Host ""
    Write-Host "Supported languages:" -ForegroundColor Yellow
    Write-Host "  - Arabic (ar), German (de), English (en), Spanish (es)" -ForegroundColor White
    Write-Host "  - French (fr), Japanese (ja), Dutch (nl), Portuguese (pt)" -ForegroundColor White
    Write-Host "  - Russian (ru), Chinese Simplified (zh), Chinese Traditional (zh-TW)" -ForegroundColor White
    Write-Host ""
    Write-Host "Useful commands:" -ForegroundColor Yellow
    Write-Host "  View logs: docker compose -p activepieces logs -f" -ForegroundColor White
    Write-Host "  Stop: docker compose -p activepieces stop" -ForegroundColor White
    Write-Host "  Start: docker compose -p activepieces start" -ForegroundColor White
    Write-Host "  Restart: docker compose -p activepieces restart" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "[ERROR] Error starting Activepieces" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running manually: docker compose -p activepieces up -d" -ForegroundColor Yellow
    exit 1
}

