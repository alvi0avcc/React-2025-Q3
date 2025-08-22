import type { Gender } from '@/types/types';

export const isGender = (value: unknown): value is Gender => {
  return (
    typeof value === 'string' && ['male', 'female', 'other'].includes(value)
  );
};

export const isGenderResult = (value: unknown): Gender => {
  if (isGender(value)) return value;
  return 'other';
};

export const isFile = (value: unknown): value is File => {
  return value instanceof File;
};

export const isFileResult = (value: unknown): File | null => {
  if (isFile(value)) return value;
  return null;
};

export const isString = (value: unknown): string => {
  if (typeof value === 'string') return value;
  return '';
};
