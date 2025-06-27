// Simple working test in JavaScript to verify Jest setup
describe('Working Auth Tests', () => {
  test('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should validate email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
  });

  test('should validate password length', () => {
    const validatePassword = (password) => password.length >= 6;
    
    expect(validatePassword('password123')).toBe(true);
    expect(validatePassword('123')).toBe(false);
  });

  test('should create form data', () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');
    
    expect(formData.get('email')).toBe('test@example.com');
    expect(formData.get('password')).toBe('password123');
  });

  test('should handle user roles', () => {
    const user = {
      isStudent: true,
      isTeacher: false,
      isAdmin: false
    };
    
    expect(user.isStudent).toBe(true);
    expect(user.isTeacher).toBe(false);
    expect(user.isAdmin).toBe(false);
  });
}); 