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

  it('not valid data', () => {
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

  it('owner, operator, affiliation', () => {
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
});

class MyApiError extends Error {
  public status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

describe('isApiError', () => {
  it('recognizes ApiError only if there is a status field', () => {
    expect(isApiError(new MyApiError('fail', 500))).toBe(true);
    expect(isApiError(new Error('fail'))).toBe(false);
  });

  it('returns false or throws an error for invalid objects', () => {
    expect(isApiError(new Error('Unknown error'))).toBe(false);
    expect(isApiError(new Error('fail'))).toBe(false);
  });
});
