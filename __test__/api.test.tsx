import { vi } from 'vitest';
import { spacecraftsGet, buildSearchParams } from '@/api/api';
import { ApiError } from '@/api/api';
import { defaultPagination, localStorageKey } from '@/const/const';

describe('spacecraftsGet', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns spacecraft data and info on successful request', async () => {
    const mockResponse = {
      spacecrafts: [
        {
          uid: '1',
          name: 'Enterprise',
          registry: 'NCC-1701',
          status: 'ACTIVE',
          dateStatus: '2265-2245',
          spacecraftClass: {
            uid: 'c1',
            name: 'Constitution',
          },
          owner: {
            uid: 'o1',
            name: 'United Federation of Planets',
          },
        },
      ],
      page: {
        pageNumber: 1,
        pageSize: 25,
        totalPages: 5,
        totalItems: 125,
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const params = buildSearchParams('Enterprise');
    const promise = spacecraftsGet(params);

    vi.advanceTimersByTime(50);
    const result = await promise;

    expect(result).toEqual({
      spacecraft: mockResponse.spacecrafts,
    });
    expect(localStorage.getItem(localStorageKey)).toBe('Enterprise');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://stapi.co/api/v2/rest/spacecraft/search'),
      expect.any(Object)
    );
  });

  it('throws ApiError on unsuccessful request', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const params = buildSearchParams('fail');
    const promise = spacecraftsGet(params);
    vi.advanceTimersByTime(50);

    await expect(promise).rejects.toThrow(ApiError);
    await expect(promise).rejects.toThrow('HTTP error! status: 500');
  });

  it('throws ApiError for invalid response format', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ invalid: 'format' }),
    });

    const params = buildSearchParams('invalid');
    const promise = spacecraftsGet(params);
    vi.advanceTimersByTime(50);

    await expect(promise).rejects.toThrow(ApiError);
    await expect(promise).rejects.toThrow('Invalid response format');
  });
});

describe('buildSearchParams', () => {
  it('builds URLSearchParams with default pagination', () => {
    const params = buildSearchParams('test');
    expect(params.get('name')).toBe('test');
    expect(params.get('pageNumber')).toBe(
      defaultPagination.pageNumber.toString()
    );
    expect(params.get('pageSize')).toBe(defaultPagination.pageSize.toString());
  });

  it('uses custom pagination options when provided', () => {
    const customOptions = {
      pageNumber: 2,
      pageSize: 50,
    };
    const params = buildSearchParams('test', customOptions);
    expect(params.get('pageNumber')).toBe('2');
    expect(params.get('pageSize')).toBe('50');
  });

  it('falls back to defaults for invalid values', () => {
    const invalidOptions = {
      pageNumber: -1,
      pageSize: 0,
    };
    const params = buildSearchParams('test', invalidOptions);
    expect(params.get('pageNumber')).toBe('-1');
    expect(params.get('pageSize')).toBe(`${defaultPagination.pageSize}`);
  });

  it('trims the search query', () => {
    const params = buildSearchParams('  test  ');
    expect(params.get('name')).toBe('test');
  });
});
