# Component Migration Script for Windows PowerShell
# This script reorganizes the component structure according to the new standards

Write-Host "Starting component migration..." -ForegroundColor Green

# Create new directory structure
Write-Host "Creating new directory structure..." -ForegroundColor Yellow

$directories = @(
    "src/components/layout",
    "src/components/common", 
    "src/components/forms",
    "src/components/features/auth",
    "src/components/features/dashboard",
    "src/components/features/songs",
    "src/components/features/lessons",
    "src/components/features/assignments",
    "src/components/features/spotify",
    "src/components/features/user-management",
    "src/components/features/landing"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir" -ForegroundColor Cyan
    }
}

# Move layout components
Write-Host "Moving layout components..." -ForegroundColor Yellow
if (Test-Path "src/components/dashboard/NavBar") {
    Move-Item "src/components/dashboard/NavBar" "src/components/layout/" -Force
    Write-Host "Moved NavBar to layout/" -ForegroundColor Cyan
}

# Move common components
Write-Host "Moving common components..." -ForegroundColor Yellow
$commonComponents = @(
    "src/components/dashboard/LoadingComponent.tsx",
    "src/components/dashboard/ErrorComponent.tsx", 
    "src/components/dashboard/NoSongsFound.tsx"
)

foreach ($component in $commonComponents) {
    if (Test-Path $component) {
        $fileName = Split-Path $component -Leaf
        Move-Item $component "src/components/common/$fileName" -Force
        Write-Host "Moved $fileName to common/" -ForegroundColor Cyan
    }
}

# Move form components
Write-Host "Moving form components..." -ForegroundColor Yellow
if (Test-Path "src/components/dashboard/forms") {
    Move-Item "src/components/dashboard/forms" "src/components/" -Force
    Write-Host "Moved forms to src/components/" -ForegroundColor Cyan
}

# Move feature components
Write-Host "Moving feature components..." -ForegroundColor Yellow

# Landing page components
if (Test-Path "src/components/landingPage") {
    Move-Item "src/components/landingPage" "src/components/features/landing" -Force
    Write-Host "Moved landingPage to features/landing" -ForegroundColor Cyan
}

# User management components
if (Test-Path "src/components/select") {
    Move-Item "src/components/select" "src/components/features/user-management" -Force
    Write-Host "Moved select to features/user-management" -ForegroundColor Cyan
}

# Dashboard components
if (Test-Path "src/app/dashboard/components") {
    Move-Item "src/app/dashboard/components" "src/components/features/dashboard" -Force
    Write-Host "Moved dashboard components to features/dashboard" -ForegroundColor Cyan
}

# Spotify components
if (Test-Path "src/components/SpotifyTokenFetcher.tsx") {
    Move-Item "src/components/SpotifyTokenFetcher.tsx" "src/components/features/spotify/" -Force
    Write-Host "Moved SpotifyTokenFetcher to features/spotify" -ForegroundColor Cyan
}

# Rename files for consistency
Write-Host "Renaming files for consistency..." -ForegroundColor Yellow
if (Test-Path "src/components/Search-bar.tsx") {
    Move-Item "src/components/Search-bar.tsx" "src/components/common/SearchBar.tsx" -Force
    Write-Host "Renamed Search-bar.tsx to SearchBar.tsx" -ForegroundColor Cyan
}

# Clean up empty directories
Write-Host "Cleaning up empty directories..." -ForegroundColor Yellow
$emptyDirs = Get-ChildItem -Path "src/components/dashboard" -Directory -Recurse | Where-Object { (Get-ChildItem $_.FullName).Count -eq 0 }
foreach ($dir in $emptyDirs) {
    Remove-Item $dir.FullName -Force
    Write-Host "Removed empty directory: $($dir.FullName)" -ForegroundColor Cyan
}

Write-Host "Migration completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update import statements in all files" -ForegroundColor White
Write-Host "2. Update test file locations" -ForegroundColor White
Write-Host "3. Run tests to ensure everything works" -ForegroundColor White
Write-Host "4. Update documentation" -ForegroundColor White 