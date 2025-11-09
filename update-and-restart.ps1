# Quick script to update docker-compose and restart when build is ready
Write-Host "Checking for custom Docker image..." -ForegroundColor Cyan

$image = docker images activepieces:custom-locale -q
if ($image) {
    Write-Host "✓ Custom image found! Updating docker-compose..." -ForegroundColor Green
    
    # Update docker-compose.yml
    $content = Get-Content docker-compose.yml -Raw
    $content = $content -replace 'image: ghcr.io/activepieces/activepieces:0.71.1', 'image: activepieces:custom-locale'
    Set-Content docker-compose.yml -Value $content -NoNewline
    
    Write-Host "✓ Updated docker-compose.yml" -ForegroundColor Green
    Write-Host "`nStopping containers..." -ForegroundColor Yellow
    docker compose -p activepieces down
    
    Write-Host "Starting containers with custom image..." -ForegroundColor Cyan
    docker compose -p activepieces up -d
    
    Write-Host "`n✓ Done! Waiting for services to start..." -ForegroundColor Green
    Start-Sleep -Seconds 10
    
    Write-Host "`n=== Testing Instructions ===" -ForegroundColor Cyan
    Write-Host "1. Open http://localhost:8080 in your browser" -ForegroundColor White
    Write-Host "2. Login to your account" -ForegroundColor White
    Write-Host "3. Go to Profile → Settings → Language" -ForegroundColor White
    Write-Host "4. Select a language (e.g., Arabic, French, Spanish)" -ForegroundColor White
    Write-Host "5. The entire interface should switch to that language" -ForegroundColor White
    Write-Host "6. Refresh the page - language should persist" -ForegroundColor White
    Write-Host "7. Check third-party pieces - they should be in your selected language" -ForegroundColor White
    
    Write-Host "`nTo verify locale is saved in database:" -ForegroundColor Yellow
    Write-Host "  docker exec postgres psql -U activepieces -d activepieces -c `"SELECT email, locale FROM user_identity;`"" -ForegroundColor Gray
} else {
    Write-Host "✗ Custom image not found yet." -ForegroundColor Red
    Write-Host "`nThe image needs to be built first. Run:" -ForegroundColor Yellow
    Write-Host "  docker build -t activepieces:custom-locale ." -ForegroundColor White
    Write-Host "`nNote: This may take 10-15 minutes and may have Windows permission issues." -ForegroundColor Yellow
    Write-Host "If build fails, consider using WSL2 or building on Linux." -ForegroundColor Yellow
}

