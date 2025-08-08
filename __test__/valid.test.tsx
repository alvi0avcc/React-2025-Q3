import { isValidSpacecrafts, isApiError } from '@/utils/valid';
import { ApiError } from '@/api/api';

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
      123,
      { uid: 123, name: 'Defiant' },
      { uid: '3', name: 456 },
      { uid: '4', name: 'Valid', owner: 'invalid' },
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

  it('handles invalid nested objects', () => {
    const data = [
      {
        uid: '1',
        name: 'Enterprise',
        owner: { name: 'Starfleet' },
      },
      {
        uid: '2',
        name: 'Voyager',
        operator: { uid: 123, name: 'Starfleet' },
      },
      {
        uid: '3',
        name: 'Defiant',
        affiliation: { uid: 'a1' },
      },
    ];
    expect(isValidSpacecrafts(data)).toEqual([]);
  });
});

describe('isApiError', () => {
  it('returns true for ApiError instances', () => {
    const apiError1 = new ApiError('Not found');
    const apiError2 = new ApiError('Server error', 500);

    expect(isApiError(apiError1)).toBe(true);
    expect(isApiError(apiError2)).toBe(true);
  });

  it('returns false for non-matching objects', () => {
    expect(isApiError({ status: 500 })).toBe(false);
    expect(isApiError({ message: 'Error' })).toBe(false);

    expect(
      isApiError({
        message: 123,
        status: '500',
        name: 'ApiError',
      })
    ).toBe(false);

    expect(isApiError(new Error('Generic error'))).toBe(false);
  });

  it('returns false for non-object values', () => {
    expect(isApiError('error')).toBe(false);
    expect(isApiError(500)).toBe(false);
    expect(isApiError(null)).toBe(false);
    expect(isApiError(undefined)).toBe(false);
    expect(isApiError(true)).toBe(false);
  });
});
