param(
  [string]$Path
)

if (-not $Path -or -not (Test-Path $Path)) {
  Write-Host "Usage: check-endpoint-observability.ps1 <changed-file>"
  exit 1
}

$content = Get-Content $Path -Raw
$missing = @()

if ($Path -like "*.service.ts" -and $content -notmatch "structuredLogger") {
  $missing += "structured logging"
}

if ($Path -like "*.service.ts" -and $content -notmatch "MetricsService|metrics") {
  $missing += "metrics tracking"
}

if ($content -match "throw new Error" -and $content -notmatch "HttpException|BadRequestException|InternalServerErrorException") {
  $missing += "NestJS HTTP exception usage"
}

if ($missing.Count -gt 0) {
  Write-Host "Endpoint observability check failed for $Path"
  $missing | ForEach-Object { Write-Host "- Missing: $_" }
  exit 1
}

Write-Host "Endpoint observability check passed for $Path"
