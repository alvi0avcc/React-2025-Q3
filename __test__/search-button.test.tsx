import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('@/api/api', () => ({
  spacecraftsGet: vi.fn().mockResolvedValue([]),
}));

import { SearchButton } from '@/components/top-controls/search-button/search-button';

describe('SearchButton', () => {
  it('Render button', () => {
    render(<SearchButton searchQuery="" onSearch={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('onClick', async () => {
    const onSearch = vi.fn();
    render(<SearchButton searchQuery="Enterprise" onSearch={onSearch} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onSearch).toHaveBeenCalled();
  });

  it('onSearch during loading', () => {
    const onSearch = vi.fn();
    render(<SearchButton searchQuery="Enterprise" onSearch={onSearch} />);
    expect(onSearch).toHaveBeenCalledWith([], null, true);
  });

  it('onSearch with results', async () => {
    const onSearch = vi.fn();
    const mockResult = [{ uid: '1', name: 'Enterprise' }];
    const { spacecraftsGet } = await import('@/api/api');
    const mockSpacecraftsGet = spacecraftsGet as unknown as ReturnType<
      typeof vi.fn
    >;
    mockSpacecraftsGet.mockResolvedValueOnce(mockResult);

    render(<SearchButton searchQuery="Enterprise" onSearch={onSearch} />);
    await screen.findByRole('button');
    expect(onSearch).toHaveBeenCalledWith(mockResult, null, false);
  });

  it('onSearch with error', async () => {
    const onSearch = vi.fn();
    const error = new Error('API fail');
    const { spacecraftsGet } = await import('@/api/api');
    const mockSpacecraftsGet = spacecraftsGet as unknown as ReturnType<
      typeof vi.fn
    >;
    mockSpacecraftsGet.mockRejectedValueOnce(error);

    render(<SearchButton searchQuery="fail" onSearch={onSearch} />);
    await screen.findByRole('button');
    expect(onSearch).toHaveBeenCalledWith([], error, false);
  });

  it('onSearch after click', async () => {
    const onSearch = vi.fn();
    render(<SearchButton searchQuery="Enterprise" onSearch={onSearch} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onSearch).toHaveBeenCalled();
  });
});
