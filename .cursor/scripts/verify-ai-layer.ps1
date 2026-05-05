$ErrorActionPreference = "Stop"

$requiredPaths = @(
  ".cursor/manifest.json",
  ".cursor/hooks.json",
  ".cursor/skills/observability-integration/SKILL.md",
  ".cursor/skills/nestjs-endpoint-scaffold/SKILL.md",
  ".cursor/skills/prisma-schema-review/SKILL.md",
  ".cursor/skills/signal-lab-orchestrator/SKILL.md",
  ".cursor/commands/add-endpoint.md",
  ".cursor/commands/check-obs.md",
  ".cursor/commands/health-check.md",
  ".cursor/commands/run-prd.md"
)

foreach ($path in $requiredPaths) {
  if (-not (Test-Path $path)) {
    Write-Host "Missing AI layer artifact: $path"
    exit 1
  }
}

powershell -ExecutionPolicy Bypass -File .cursor/hooks/scripts/check-endpoint-observability.ps1 apps/backend/src/scenarios/scenarios.service.ts
powershell -ExecutionPolicy Bypass -File .cursor/hooks/scripts/check-prisma-migration.ps1

Write-Host "AI layer verification passed"
