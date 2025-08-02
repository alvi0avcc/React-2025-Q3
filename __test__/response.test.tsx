import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router';
import { ResultsResponse } from '@/components/results/response/response';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import selectedSpacecraftReducer from '@/store/slice/selectedSpacecraftSlice';
import type { SelectedSpacecraftState } from '@/store/slice/selectedSpacecraftSlice';
import type { Spacecraft } from '@/types/types';
import styles from '@/components/results/response/response.module.css';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/utils/valid', () => ({
  getDisplayValue: vi.fn(value => value ?? 'hidden'),
}));

const mockSpacecrafts: Spacecraft[] = [
  {
    uid: '1',
    name: 'Enterprise',
    spacecraftClass: { name: 'Starship', uid: 'c1' },
    status: 'Active',
  },
  {
    uid: '2',
    name: 'Voyager',
    spacecraftClass: { name: 'Starship', uid: 'c2' },
    status: 'Lost',
  },
];

interface RenderOptions {
  preloadedState?: Partial<{ selectedSpacecraft: SelectedSpacecraftState }>;
  store?: EnhancedStore<{ selectedSpacecraft: SelectedSpacecraftState }>;
}

describe('ResultsResponse Component', () => {
  const mockNavigate = vi.fn();
  const mockOnSpacecraftSelected = vi.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
    mockOnSpacecraftSelected.mockClear();
  });

  const createMockStore = (
    preloadedState?: Partial<{ selectedSpacecraft: SelectedSpacecraftState }>
  ) => {
    return configureStore({
      reducer: {
        selectedSpacecraft: selectedSpacecraftReducer,
      },
      preloadedState: preloadedState
        ? {
            selectedSpacecraft: {
              selectedItems: [],
              selectedIds: [],
              ...preloadedState.selectedSpacecraft,
            },
          }
        : undefined,
    });
  };

  const renderWithProviders = (
    ui: React.ReactElement,
    { preloadedState, store }: RenderOptions = {}
  ) => {
    const testStore = store || createMockStore(preloadedState);
    return render(
      <Provider store={testStore}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );
  };

  it('should render spacecraft table with correct data', () => {
    renderWithProviders(<ResultsResponse spacecrafts={mockSpacecrafts} />);

    expect(screen.getByText('Enterprise')).toBeInTheDocument();
    expect(screen.getByText('Voyager')).toBeInTheDocument();
    expect(screen.getAllByText('Starship')).toHaveLength(2);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Lost')).toBeInTheDocument();
  });

  it('should handle missing optional fields', () => {
    const minimalData: Spacecraft[] = [{ uid: '3', name: 'Defiant' }];
    renderWithProviders(<ResultsResponse spacecrafts={minimalData} />);

    expect(screen.getByText('Defiant')).toBeInTheDocument();
    expect(screen.getAllByText('hidden')).toHaveLength(2);
  });

  it('should not navigate when no onSpacecraftSelected callback', () => {
    renderWithProviders(<ResultsResponse spacecrafts={mockSpacecrafts} />);

    fireEvent.click(screen.getByText('Enterprise'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should render empty table when no spacecrafts', () => {
    renderWithProviders(<ResultsResponse spacecrafts={[]} />);

    const rows = screen.getAllByRole('rowgroup')[1].querySelectorAll('tr');
    expect(rows).toHaveLength(0);
  });

  it('should update spacecraft state when selected', () => {
    renderWithProviders(
      <ResultsResponse
        spacecrafts={mockSpacecrafts}
        onSpacecraftSelected={mockOnSpacecraftSelected}
      />
    );

    fireEvent.click(screen.getByText('Enterprise'));
    expect(mockOnSpacecraftSelected).toHaveBeenCalledWith(0);
  });

  it('should show spacecraft as selected if it exists in Redux store', () => {
    const preloadedState = {
      selectedSpacecraft: {
        selectedItems: [mockSpacecrafts[0]],
        selectedIds: [mockSpacecrafts[0].uid],
      },
    };

    renderWithProviders(<ResultsResponse spacecrafts={mockSpacecrafts} />, {
      preloadedState,
    });

    const enterpriseRow = screen.getByText('Enterprise').closest('tr');
    expect(enterpriseRow).toHaveClass(styles.selected);
  });
});
