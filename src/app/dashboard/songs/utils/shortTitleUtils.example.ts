import { generateShortTitle, generateShortTitleWithMaxLength, isValidShortTitle } from './shortTitleUtils';

// Example usage of the short title utilities
console.log('=== Short Title Utility Examples ===');

// Basic conversion
console.log('"Hello World" ->', generateShortTitle('Hello World')); // "hello-world"
console.log('"The Beatles - Hey Jude" ->', generateShortTitle('The Beatles - Hey Jude')); // "the-beatles-hey-jude"

// Handling special characters
console.log('"Song Title (Remix)" ->', generateShortTitle('Song Title (Remix)')); // "song-title-remix"
console.log('"Artist & The Band" ->', generateShortTitle('Artist & The Band')); // "artist-the-band"

// With max length
console.log('"Very Long Song Title That Should Be Truncated" ->', 
  generateShortTitleWithMaxLength('Very Long Song Title That Should Be Truncated', 20)); // truncated version

// Validation examples
console.log('"hello-world" is valid:', isValidShortTitle('hello-world')); // true
console.log('"Hello World" is valid:', isValidShortTitle('Hello World')); // false (uppercase)
console.log('"hello world" is valid:', isValidShortTitle('hello world')); // false (spaces)
console.log('"hello_world" is valid:', isValidShortTitle('hello_world')); // false (underscores) 