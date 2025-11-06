# start-dev.ps1
# Windows PowerShell helper to start backend (with in-memory DB) and then frontend
# Usage: Right-click -> Run with PowerShell, or from PowerShell: .\start-dev.ps1

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "Starting backend (in-memory DB) in new window..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$repoRoot\backend'; `$env:USE_IN_MEMORY_DB='1'; npm run dev" 

Write-Host "Waiting for backend to become available on http://localhost:5000..." -ForegroundColor Cyan
function Wait-ForUrl($url, $timeoutSec=30){
  $start = Get-Date
  while((Get-Date) - $start -lt (New-TimeSpan -Seconds $timeoutSec)){
    try{
      Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 2 -ErrorAction Stop | Out-Null
      return $true
    }catch{
      # ignore and retry
    }
    Start-Sleep -Milliseconds 500
  }
  return $false
}

$ok = Wait-ForUrl 'http://localhost:5000'
if(-not $ok){
  Write-Host "Backend did not start within timeout. Check backend logs in the new window." -ForegroundColor Yellow
  exit 1
}

Write-Host "Backend is up - starting frontend in this window..." -ForegroundColor Green
$frontendPath = Join-Path -Path $repoRoot -ChildPath 'frontend'
Set-Location -Path $frontendPath
npm start
