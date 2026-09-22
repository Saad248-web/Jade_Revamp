# Set Axis Rooms preprod env vars on Vercel Production.
# Requires: npx vercel login (once) and project linked in this repo.
#
# Usage (PowerShell):
#   .\scripts\set-vercel-axis-env.ps1
#   .\scripts\set-vercel-axis-env.ps1 -Redeploy
#
# Source: Rohith Kumar K email 2026-09-22
#   Base URL  : https://preprod1.axisrooms.com
#   Channel   : 229
#   Hotel     : 1234 · rooms 1|2 · rates 1|2

param([switch]$Redeploy)

$vars = @{
  AXIS_ROOMS_API_KEY       = "229pms202Jadehdyjhvad"
  AXIS_ROOMS_CHANNEL_ID    = "229"
  AXIS_ROOMS_API_BASE_URL  = "https://preprod1.axisrooms.com"
  AXIS_ROOMS_PMS_NAME      = "Jade Host PMS"
  AXIS_TEST_HOTEL_ID       = "1234"
  AXIS_TEST_ROOM_ID        = "2"
  AXIS_TEST_RATE_PLAN_ID   = "2"
}

# Obsolete: AXIS_ROOMS_INBOUND_VERIFY_AXIS — API 5 no longer used on inbound webhook


foreach ($key in $vars.Keys) {
  $val = $vars[$key]
  Write-Host "Setting $key on production..."
  $val | npx -y vercel@latest env add $key production --force
}

if ($Redeploy) {
  Write-Host "Triggering production redeploy..."
  npx -y vercel@latest --prod
}

Write-Host "Done. Verify: npx vercel env ls production"
