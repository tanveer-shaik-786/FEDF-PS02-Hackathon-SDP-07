# Copy assets from src/assets to public/assets and map to seed slugs
# Run this from the repository root (PowerShell):
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\fedf-ps02\scripts\copy-assets-to-public.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$src = Join-Path $scriptDir "..\src\assets"
$dest = Join-Path $scriptDir "..\public\assets"

Write-Host "Source: $src"
Write-Host "Destination: $dest"

if (!(Test-Path $src)) {
    Write-Error "Source folder not found: $src"
    exit 1
}

if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest | Out-Null
    Write-Host "Created destination folder: $dest"
}

# Copy all existing images to public/assets
$patterns = @('*.jpg','*.jpeg','*.png','*.webp','*.avif')
Get-ChildItem -Path $src -File -Include $patterns -Recurse | ForEach-Object {
    $targetPath = Join-Path $dest $_.Name
    Copy-Item -Path $_.FullName -Destination $targetPath -Force
    Write-Host "Copied: $($_.Name) -> public/assets/"
}

# Mapping for seed entries (seed.js) -> source filename in src/assets (best-effort)
$map = @{
    'handwoven-basket.jpg' = 'Olive_leaf_bowl.jpg'
    'ceramic-pottery-vase.jpg' = 'Vase.avif'
    'embroidered-wall-hanging.jpg' = 'Signature-Piece.jpg'
    'wooden-carved-box.jpg' = 'Sculpture.jpg'
    'hand-painted-ceramic-plate.jpg' = 'Hand-etched-Plate.jpg'
    'brass-oil-lamp.jpg' = 'Pot.jpg'
    'terracotta-planter.jpg' = 'Collector-Pot.jpg'
    'silk-cushion-cover.jpg' = 'PS02.jpg'
    'marble-coaster-set.jpg' = 'Decorative-Tile.jpg'
    'jute-table-runner.jpg' = 'craftStore.png'
}

# Fallback image if a mapped source doesn't exist
$fallback = Join-Path $dest 'Vase.avif'

foreach ($targetName in $map.Keys) {
    $sourceName = $map[$targetName]
    $sourcePath = Join-Path $dest $sourceName
    $targetPath = Join-Path $dest $targetName

    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $targetPath -Force
        Write-Host "Mapped: $sourceName -> $targetName"
    } elseif (Test-Path (Join-Path $src $sourceName)) {
        # if source exists in original src folder but wasn't copied due to extension casing, try copying from src
        Copy-Item -Path (Join-Path $src $sourceName) -Destination $targetPath -Force
        Write-Host "Copied from src: $sourceName -> $targetName"
    } elseif (Test-Path $fallback) {
        Copy-Item -Path $fallback -Destination $targetPath -Force
        Write-Warning "Source $sourceName not found — used fallback for $targetName"
    } else {
        Write-Warning "Source $sourceName and fallback missing — $targetName not created"
    }
}

Write-Host "\nAll done. Check the folder: $dest"
Write-Host "If any files used the fallback, consider adding proper images to src/assets and re-run this script."