// Simple test to verify Jest setup
describe('Auth Testing Setup', () => {
  it('should have Jest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should be able to import test utilities', () => {
    // This test will help verify that the module resolution is working
    expect(typeof describe).toBe('function');
    expect(typeof it).toBe('function');
    expect(typeof expect).toBe('function');
  });

  it('should have environment variables set', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
}); 