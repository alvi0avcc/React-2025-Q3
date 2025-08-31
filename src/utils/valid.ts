import type { CountryEntry, CountryList } from '@/types';

export const isRecord = (obj: unknown): obj is Record<string, unknown> => {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
};

export const isCountryEntry = (value: unknown): value is CountryEntry => {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.data);
};

export const isCountryList = (value: unknown): value is CountryList => {
  if (!isRecord(value)) return false;

  for (const key of Object.keys(value)) {
    if (!(key in value)) return false;
    if (!isCountryEntry(value[key])) return false;
  }

  return true;
};
