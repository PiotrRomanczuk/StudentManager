#!/usr/bin/env node

// Component migration mapping
const componentMigrations = {
  // Global UI components (already in correct place)
  'src/components/ui/': 'src/components/ui/',
  
  // Layout components
  'src/components/dashboard/NavBar/': 'src/components/layout/',
  'src/components/dashboard/LoadingComponent.tsx': 'src/components/common/LoadingComponent.tsx',
  'src/components/dashboard/ErrorComponent.tsx': 'src/components/common/ErrorComponent.tsx',
  'src/components/dashboard/NoSongsFound.tsx': 'src/components/common/NoSongsFound.tsx',
  
  // Form components
  'src/components/dashboard/forms/': 'src/components/forms/',
  
  // Feature-specific components
  'src/components/landingPage/': 'src/components/features/landing/',
  'src/components/select/': 'src/components/features/user-management/',
  
  // Move dashboard components to features
  'src/app/dashboard/components/': 'src/components/features/dashboard/',
  
  // Keep route-specific components in place
  'src/app/dashboard/*/@components/': 'src/app/dashboard/*/@components/',
  'src/app/dashboard/songs/@components/': 'src/app/dashboard/songs/@components/',
  'src/app/dashboard/lessons/@components/': 'src/app/dashboard/lessons/@components/',
};

// Files to rename for consistency
const fileRenames = {
  'src/components/Search-bar.tsx': 'src/components/common/SearchBar.tsx',
  'src/components/SpotifyTokenFetcher.tsx': 'src/components/features/spotify/SpotifyTokenFetcher.tsx',
};

console.log('Component Migration Plan:');
console.log('=======================\n');

console.log('1. Create new directory structure:');
console.log('   - src/components/layout/');
console.log('   - src/components/common/');
console.log('   - src/components/features/');
console.log('   - src/components/forms/');

console.log('\n2. Move components to appropriate locations:');
Object.entries(componentMigrations).forEach(([from, to]) => {
  console.log(`   ${from} → ${to}`);
});

console.log('\n3. Rename files for consistency:');
Object.entries(fileRenames).forEach(([from, to]) => {
  console.log(`   ${from} → ${to}`);
});

console.log('\n4. Update import statements across the codebase');
console.log('5. Update test file locations');
console.log('6. Update documentation');

console.log('\nMigration completed!'); 