#!/bin/bash

# Component Migration Script
# This script reorganizes the component structure according to the new standards

set -e

echo "Starting component migration..."

# Create new directory structure
echo "Creating new directory structure..."

mkdir -p src/components/layout
mkdir -p src/components/common
mkdir -p src/components/forms
mkdir -p src/components/features/auth
mkdir -p src/components/features/dashboard
mkdir -p src/components/features/songs
mkdir -p src/components/features/lessons
mkdir -p src/components/features/assignments
mkdir -p src/components/features/spotify
mkdir -p src/components/features/user-management
mkdir -p src/components/features/landing

# Move layout components
echo "Moving layout components..."
if [ -d "src/components/dashboard/NavBar" ]; then
    mv src/components/dashboard/NavBar src/components/layout/
fi

# Move common components
echo "Moving common components..."
if [ -f "src/components/dashboard/LoadingComponent.tsx" ]; then
    mv src/components/dashboard/LoadingComponent.tsx src/components/common/
fi

if [ -f "src/components/dashboard/ErrorComponent.tsx" ]; then
    mv src/components/dashboard/ErrorComponent.tsx src/components/common/
fi

if [ -f "src/components/dashboard/NoSongsFound.tsx" ]; then
    mv src/components/dashboard/NoSongsFound.tsx src/components/common/
fi

# Move form components
echo "Moving form components..."
if [ -d "src/components/dashboard/forms" ]; then
    mv src/components/dashboard/forms src/components/
fi

# Move feature components
echo "Moving feature components..."

# Landing page components
if [ -d "src/components/landingPage" ]; then
    mv src/components/landingPage src/components/features/landing
fi

# User management components
if [ -d "src/components/select" ]; then
    mv src/components/select src/components/features/user-management
fi

# Dashboard components
if [ -d "src/app/dashboard/components" ]; then
    mv src/app/dashboard/components src/components/features/dashboard
fi

# Spotify components
if [ -f "src/components/SpotifyTokenFetcher.tsx" ]; then
    mv src/components/SpotifyTokenFetcher.tsx src/components/features/spotify/
fi

# Rename files for consistency
echo "Renaming files for consistency..."
if [ -f "src/components/Search-bar.tsx" ]; then
    mv src/components/Search-bar.tsx src/components/common/SearchBar.tsx
fi

# Clean up empty directories
echo "Cleaning up empty directories..."
find src/components/dashboard -type d -empty -delete 2>/dev/null || true

echo "Migration completed!"
echo ""
echo "Next steps:"
echo "1. Update import statements in all files"
echo "2. Update test file locations"
echo "3. Run tests to ensure everything works"
echo "4. Update documentation" 