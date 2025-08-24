import { describe, it, expect } from 'vitest';
import {
  isGender,
  isGenderResult,
  isFile,
  isFileResult,
  isString,
} from '@/utils/valid';

describe('Type guard functions', () => {
  describe('isGender', () => {
    it('should return true for valid gender values', () => {
      expect(isGender('male')).toBe(true);
      expect(isGender('female')).toBe(true);
      expect(isGender('other')).toBe(true);
    });

    it('should return false for invalid gender values', () => {
      expect(isGender('invalid')).toBe(false);
      expect(isGender('')).toBe(false);
      expect(isGender(null)).toBe(false);
      expect(isGender(undefined)).toBe(false);
      expect(isGender(123)).toBe(false);
      expect(isGender({})).toBe(false);
      expect(isGender([])).toBe(false);
    });
  });

  describe('isGenderResult', () => {
    it('should return the same value for valid genders', () => {
      expect(isGenderResult('male')).toBe('male');
      expect(isGenderResult('female')).toBe('female');
      expect(isGenderResult('other')).toBe('other');
    });

    it('should return "other" for invalid values', () => {
      expect(isGenderResult('invalid')).toBe('other');
      expect(isGenderResult('')).toBe('other');
      expect(isGenderResult(null)).toBe('other');
      expect(isGenderResult(undefined)).toBe('other');
      expect(isGenderResult(123)).toBe('other');
      expect(isGenderResult({})).toBe('other');
    });
  });

  describe('isFile', () => {
    it('should return true for File objects', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      expect(isFile(file)).toBe(true);
    });

    it('should return false for non-File objects', () => {
      expect(isFile('not a file')).toBe(false);
      expect(isFile({ name: 'test.txt' })).toBe(false);
      expect(isFile(null)).toBe(false);
      expect(isFile(undefined)).toBe(false);
      expect(isFile(123)).toBe(false);
      expect(isFile(new Blob())).toBe(false);
    });
  });

  describe('isFileResult', () => {
    it('should return the same File object for valid files', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      expect(isFileResult(file)).toBe(file);
    });

    it('should return null for non-File objects', () => {
      expect(isFileResult('not a file')).toBe(null);
      expect(isFileResult({ name: 'test.txt' })).toBe(null);
      expect(isFileResult(null)).toBe(null);
      expect(isFileResult(undefined)).toBe(null);
      expect(isFileResult(123)).toBe(null);
    });
  });

  describe('isString', () => {
    it('should return the same string for string values', () => {
      expect(isString('hello')).toBe('hello');
      expect(isString('')).toBe('');
      expect(isString('123')).toBe('123');
    });

    it('should return empty string for non-string values', () => {
      expect(isString(123)).toBe('');
      expect(isString(null)).toBe('');
      expect(isString(undefined)).toBe('');
      expect(isString({})).toBe('');
      expect(isString([])).toBe('');
      expect(isString(true)).toBe('');
    });
  });
});
