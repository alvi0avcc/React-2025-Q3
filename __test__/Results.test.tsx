import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Results } from '@/components/results/results';
import type { Spacecraft } from '@/types/types';
import selectedSpacecraftReducer from '@/store/slice/selectedSpacecraftSlice';

const mockStore = configureStore({
  reducer: {
    selectedSpacecraft: selectedSpacecraftReducer,
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

const mockSpacecrafts: Spacecraft[] = [
  { uid: '1', name: 'Enterprise' },
  { uid: '2', name: 'Voyager' },
];

describe('Results', () => {
  it('should show loader when isLoading is true', () => {
    renderWithProviders(
      <Results spacecrafts={[]} error={null} isLoading={true} />
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should show error when error exists', () => {
    renderWithProviders(
      <Results
        spacecrafts={[]}
        error={{ name: 'ApiError', message: 'Error API' }}
        isLoading={false}
      />
    );
    expect(screen.getByText(/Error Loading Data/i)).toBeInTheDocument();
  });

  it('should display list of results when data is available', () => {
    renderWithProviders(
      <Results spacecrafts={mockSpacecrafts} error={null} isLoading={false} />
    );
    expect(screen.getByText(/enterprise/i)).toBeInTheDocument();
    expect(screen.getByText(/voyager/i)).toBeInTheDocument();
  });

  it('should show empty state when no results found', () => {
    renderWithProviders(
      <Results spacecrafts={[]} error={null} isLoading={false} />
    );
    expect(screen.getByText(/no spacecrafts found/i)).toBeInTheDocument();
  });
});
