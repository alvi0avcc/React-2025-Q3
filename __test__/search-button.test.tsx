import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { SearchButton } from '@/components/top-controls/search-button/search-button';
import { defaultPagination } from '@/const/const';

vi.mock('@/api/api', () => ({
  buildSearchParams: vi.fn().mockImplementation((query, pagination) => ({
    query,
    ...pagination,
  })),
  spacecraftsGet: vi.fn(),
}));

describe('SearchButton', () => {
  it('Render button', () => {
    render(
      <SearchButton
        searchQuery=""
        onSearch={() => {}}
        pagination={defaultPagination}
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('onClick', async () => {
    const onSearch = vi.fn();
    render(
      <SearchButton
        searchQuery="Enterprise"
        onSearch={onSearch}
        pagination={defaultPagination}
      />
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onSearch).toHaveBeenCalled();
  });

  it('onSearch during loading', async () => {
    const onSearch = vi.fn();
    render(
      <SearchButton
        searchQuery="Enterprise"
        onSearch={onSearch}
        pagination={defaultPagination}
      />
    );

    expect(onSearch).toHaveBeenCalledWith([], undefined, null, true);
  });

  it('onSearch with results', async () => {
    const onSearch = vi.fn();
    const mockResult = {
      spacecraft: [{ uid: '1', name: 'Enterprise' }],
      info: undefined,
    };

    const { spacecraftsGet } = await import('@/api/api');
    (spacecraftsGet as jest.Mock).mockResolvedValueOnce(mockResult);

    render(
      <SearchButton
        searchQuery="Enterprise"
        onSearch={onSearch}
        pagination={defaultPagination}
      />
    );

    await screen.findByRole('button');

    expect(onSearch).toHaveBeenCalledWith(
      mockResult.spacecraft,
      mockResult.info,
      null,
      false
    );
  });

  it('onSearch with error', async () => {
    const onSearch = vi.fn();
    const error = new Error('API fail');

    const { spacecraftsGet } = await import('@/api/api');
    (spacecraftsGet as jest.Mock).mockRejectedValueOnce(error);

    render(
      <SearchButton
        searchQuery="fail"
        onSearch={onSearch}
        pagination={defaultPagination}
      />
    );

    await screen.findByRole('button');

    expect(onSearch).toHaveBeenCalledWith([], undefined, error, false);
  });

  it('onSearch after click', async () => {
    const onSearch = vi.fn();
    render(
      <SearchButton
        searchQuery="Enterprise"
        onSearch={onSearch}
        pagination={defaultPagination}
      />
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onSearch).toHaveBeenCalled();
  });
});
