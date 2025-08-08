import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopControls } from '@/components/top-controls/top-controls';
import { vi, type Mock } from 'vitest';
import { MemoryRouter } from 'react-router';
import { useGetSpacecraftsQuery } from '@/store/slice/apiSlice';

vi.mock('@/store/slice/apiSlice', () => ({
  useGetSpacecraftsQuery: vi.fn().mockReturnValue({
    data: undefined,
    error: undefined,
    isFetching: false,
  }),
}));

describe('TopControls', () => {
  const mockOnSearchResults = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetSpacecraftsQuery as Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isFetching: false,
    });
  });

  it('renders the input field and search button', () => {
    render(
      <MemoryRouter>
        <TopControls onSearchResults={mockOnSearchResults} />
      </MemoryRouter>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('updates search query when typing in the input field', async () => {
    render(
      <MemoryRouter>
        <TopControls onSearchResults={mockOnSearchResults} />
      </MemoryRouter>
    );

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Enterprise');

    expect(input).toHaveValue('Enterprise');
  });

  it('triggers search when clicking the search button', async () => {
    render(
      <MemoryRouter>
        <TopControls onSearchResults={mockOnSearchResults} />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByRole('textbox'), 'Enterprise');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mockOnSearchResults).toHaveBeenCalled();
  });

  it('handles API error state', async () => {
    const mockError = new Error('API Error');
    (useGetSpacecraftsQuery as Mock).mockReturnValueOnce({
      error: mockError,
      isFetching: false,
    });

    render(
      <MemoryRouter>
        <TopControls onSearchResults={mockOnSearchResults} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockOnSearchResults).toHaveBeenCalledWith(
        [],
        undefined,
        mockError,
        false
      );
    });
  });

  it('updates when data is received', async () => {
    const mockData = {
      spacecraft: [{ uid: '1', name: 'Enterprise' }],
      info: {
        totalPages: 5,
        totalElements: 50,
      },
    };

    (useGetSpacecraftsQuery as Mock).mockReturnValueOnce({
      data: mockData,
      isFetching: false,
    });

    render(
      <MemoryRouter>
        <TopControls onSearchResults={mockOnSearchResults} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockOnSearchResults).toHaveBeenCalledWith(
        mockData.spacecraft,
        mockData.info,
        null,
        false
      );
    });
  });
});
