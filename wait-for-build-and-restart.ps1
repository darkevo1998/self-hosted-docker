# Script to wait for Docker build and restart with custom image
Write-Host "Waiting for Docker build to complete..." -ForegroundColor Cyan
Write-Host "This will check every 30 seconds for the custom image." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to cancel." -ForegroundColor Gray
Write-Host ""

$maxWait = 1800 # 30 minutes max
$elapsed = 0
$checkInterval = 30

while ($elapsed -lt $maxWait) {
    $image = docker images activepieces:custom-locale -q
    if ($image) {
        Write-Host "`n✓ Custom image found! Updating docker-compose..." -ForegroundColor Green
        
        # Update docker-compose.yml
        $content = Get-Content docker-compose.yml -Raw
        $content = $content -replace 'image: ghcr.io/activepieces/activepieces:0.71.1', 'image: activepieces:custom-locale'
        Set-Content docker-compose.yml -Value $content -NoNewline
        
        Write-Host "✓ Updated docker-compose.yml" -ForegroundColor Green
        Write-Host "`nRestarting containers with custom image..." -ForegroundColor Cyan
        
        docker compose -p activepieces down
        docker compose -p activepieces up -d
        
        Write-Host "`n✓ Containers restarted!" -ForegroundColor Green
        Write-Host "`nYou can now test the language functionality at http://localhost:8080" -ForegroundColor Cyan
        Write-Host "The migration will run automatically on startup." -ForegroundColor Yellow
        
        exit 0
    }
    
    Write-Host "." -NoNewline -ForegroundColor Gray
    Start-Sleep -Seconds $checkInterval
    $elapsed += $checkInterval
}

Write-Host "`nBuild timeout reached. Image may still be building." -ForegroundColor Yellow
Write-Host "You can manually check with: docker images activepieces:custom-locale" -ForegroundColor Cyan

