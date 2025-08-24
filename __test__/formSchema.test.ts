import { describe, it, expect } from 'vitest';
import { validateFormData, validateFile } from '../src/schemas/formSchema';

describe('Form Schema Validation', () => {
  it('should validate correct form data', () => {
    const validData = {
      name: 'John',
      age: 25,
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      gender: 'male' as const,
      acceptTerms: true,
      country: 'USA',
    };

    const result = validateFormData(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid name', () => {
    const invalidData = {
      name: 'john',
      age: 25,
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      gender: 'male' as const,
      acceptTerms: true,
      country: 'USA',
    };

    const result = validateFormData(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Name must start with capital letter'
      );
    }
  });

  it('should reject password mismatch', () => {
    const invalidData = {
      name: 'John',
      age: 25,
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'differentpassword',
      gender: 'male' as const,
      acceptTerms: true,
      country: 'USA',
    };

    const result = validateFormData(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Passwords don't match");
    }
  });

  it('should reject invalid email', () => {
    const invalidData = {
      name: 'John',
      age: 25,
      email: 'invalid-email',
      password: 'password123',
      confirmPassword: 'password123',
      gender: 'male' as const,
      acceptTerms: true,
      country: 'USA',
    };

    const result = validateFormData(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address');
    }
  });
});

describe('File Validation', () => {
  it('should validate correct image file', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const result = validateFile(file);
    expect(result.success).toBe(true);
  });

  it('should reject invalid file type', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const result = validateFile(file);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Only PNG and JPEG files are allowed'
      );
    }
  });
});
