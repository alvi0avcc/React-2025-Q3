import { isValidSpacecrafts, isApiError } from '@/utils/valid';

describe('isValidSpacecrafts', () => {
  it('returns an array of Spacecraft if the data is valid', () => {
    const data = [
      {
        uid: '1',
        name: 'Enterprise',
        spacecraftClass: { name: 'Starship', uid: 'c1' },
        status: 'Active',
      },
    ];
    expect(isValidSpacecrafts(data)).toEqual(data);
  });

  it('filters out invalid spacecraft data', () => {
    const data = [
      { uid: '1', name: 'Enterprise' },
      { name: 'Voyager' },
      { uid: '2' },
      null,
      'not an object',
      { uid: 123, name: 'Defiant' },
      { uid: '3', name: 456 },
    ];
    expect(isValidSpacecrafts(data)).toEqual([
      { uid: '1', name: 'Enterprise' },
    ]);
  });

  it('handles nested objects (owner, operator, affiliation)', () => {
    const data = [
      {
        uid: '1',
        name: 'Enterprise',
        owner: { uid: 'o1', name: 'Starfleet' },
        operator: { uid: 'op1', name: 'Starfleet Command' },
        affiliation: { uid: 'a1', name: 'Federation' },
      },
    ];
    expect(isValidSpacecrafts(data)).toEqual(data);
  });

  it('handles optional fields being null or missing', () => {
    const data = [
      {
        uid: '1',
        name: 'Enterprise',
        registry: null,
        status: null,
        dateStatus: null,
        species: null,
        owner: null,
        operator: null,
        affiliation: null,
        spacecraftClass: null,
      },
    ];
    expect(isValidSpacecrafts(data)).toEqual(data);
  });
});

describe('isApiError', () => {
  it('returns true for Error instances', () => {
    expect(isApiError(new Error('fail'))).toBe(true);
    expect(isApiError(new Error('Unknown error'))).toBe(true);
  });

  it('returns false for non-Error values', () => {
    expect(isApiError('error')).toBe(false);
    expect(isApiError(500)).toBe(false);
    expect(isApiError(null)).toBe(false);
    expect(isApiError(undefined)).toBe(false);
    expect(isApiError({})).toBe(false);
  });
});
