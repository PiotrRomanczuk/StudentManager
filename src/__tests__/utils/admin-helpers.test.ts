import { describe, it, expect } from '@jest/globals';
import { validateUserId } from '@/utils/admin-helpers';

describe('Admin Helpers - validateUserId', () => {
  describe('validateUserId', () => {
    it('should validate correct UUID format', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      expect(validateUserId(validUuid)).toBe(true);
    });

    it('should validate uppercase UUID format', () => {
      const validUuid = '123E4567-E89B-12D3-A456-426614174000';
      expect(validateUserId(validUuid)).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      const invalidUuid = 'invalid-uuid';
      expect(validateUserId(invalidUuid)).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateUserId('')).toBe(false);
    });

    it('should reject null/undefined', () => {
      expect(validateUserId(null as any)).toBe(false);
      expect(validateUserId(undefined as any)).toBe(false);
    });

    it('should reject malformed UUIDs', () => {
      const malformedUuids = [
        '123e4567-e89b-12d3-a456-42661417400', // too short
        '123e4567-e89b-12d3-a456-4266141740000', // too long
        '123e4567-e89b-12d3-a456-42661417400g', // invalid character
        '123e4567-e89b-12d3-a456', // missing parts
      ];
      
      malformedUuids.forEach(uuid => {
        expect(validateUserId(uuid)).toBe(false);
      });
    });
  });
}); 