$schema = "prisma/schema.prisma"
$migrations = "prisma/migrations"

if (-not (Test-Path $schema)) {
  Write-Host "Missing $schema"
  exit 1
}

if (-not (Test-Path $migrations)) {
  Write-Host "Missing $migrations. Run: npx prisma migrate dev --schema=./prisma/schema.prisma --name <change>"
  exit 1
}

Write-Host "Prisma migration checklist:"
Write-Host "1. npx prisma migrate dev --schema=./prisma/schema.prisma --name <change>"
Write-Host "2. npx prisma generate --schema=./prisma/schema.prisma"
Write-Host "3. Rebuild backend or restart Docker backend service"
