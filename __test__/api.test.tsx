import { vi } from 'vitest';
import { spacecraftsGet } from '@/api/api';
import { ApiError } from '@/api/api';

describe('spacecraftsGet', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data on successful request', async () => {
    const mockData = {
      spacecrafts: [
        {
          uid: '1',
          name: 'Enterprise',
          spacecraftClass: { name: 'Starship', uid: 'c1' },
          status: 'Active',
        },
      ],
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem');

    const result = await spacecraftsGet('Enterprise');
    expect(result).toEqual(mockData.spacecrafts);
    expect(setItemSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
  });

  it('ApiError on unsuccessful request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })
    );

    await expect(spacecraftsGet('fail')).rejects.toThrow(ApiError);
    await expect(spacecraftsGet('fail')).rejects.toThrow(
      /HTTP error! status: 500/
    );
  });
});
