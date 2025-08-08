import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopControls } from '@/components/top-controls/top-controls';
import { vi, type Mock } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { type ApiError } from '@/api/api';
import {
  apiSlice,
  useGetSpacecraftsQuery,
  useLazyGetSpacecraftsQuery,
  useRefreshSpacecraftsMutation,
} from '@/store/slice/apiSlice';
import type { PaginationOptions } from '@/types/types';

const createMockStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

vi.mock('@/utils/valid', () => ({
  isApiError: vi.fn().mockImplementation((error: unknown) => {
    return error instanceof Error && 'status' in error;
  }),
}));

vi.mock('@/store/slice/apiSlice', async importOriginal => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useGetSpacecraftsQuery: vi.fn(),
    useLazyGetSpacecraftsQuery: vi.fn(),
    useRefreshSpacecraftsMutation: vi.fn(),
    apiSlice: {
      ...(actual as any).apiSlice,
      util: {
        resetApiState: vi.fn(),
      },
    },
  };
});

describe('TopControls Component', () => {
  const mockOnSearchResults = vi.fn();
  let store: ReturnType<typeof createMockStore>;
  const mockTriggerSearch = vi.fn();
  const mockRefreshSpacecrafts = vi.fn();
  const mockResetApiState = vi.fn();

  beforeEach(() => {
    store = createMockStore();
    vi.clearAllMocks();

    (useGetSpacecraftsQuery as Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isFetching: false,
      refetch: vi.fn(),
    });

    (useLazyGetSpacecraftsQuery as Mock).mockReturnValue([
      mockTriggerSearch,
      { isFetching: false, data: undefined },
    ]);

    (useRefreshSpacecraftsMutation as Mock).mockReturnValue([
      mockRefreshSpacecrafts,
      { isFetching: false },
    ]);

    (apiSlice.util.resetApiState as unknown as Mock).mockImplementation(
      mockResetApiState
    );
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <TopControls onSearchResults={mockOnSearchResults} {...props} />
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders the input field and search button', () => {
    renderComponent();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByText(/Refresh Current Page/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset All Cache/i)).toBeInTheDocument();
  });

  it('updates search query when typing in the input field', async () => {
    renderComponent();
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Enterprise');
    expect(input).toHaveValue('Enterprise');
  });

  it('handles API error state', async () => {
    const mockError = new Error('API Error') as ApiError;
    mockError.status = 500;

    (useGetSpacecraftsQuery as Mock).mockReturnValueOnce({
      error: mockError,
      isFetching: false,
    });

    renderComponent();

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
        pageNumber: 1,
        pageSize: 10,
      } as PaginationOptions & { totalPages: number; totalElements: number },
    };

    (useGetSpacecraftsQuery as Mock).mockReturnValueOnce({
      data: mockData,
      isFetching: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(mockOnSearchResults).toHaveBeenCalledWith(
        mockData.spacecraft,
        mockData.info,
        null,
        false
      );
    });
  });

  it('triggers manual refresh', async () => {
    renderComponent();
    await userEvent.click(screen.getByText(/Refresh Current Page/i));
    expect(mockRefreshSpacecrafts).toHaveBeenCalled();
  });
});
