import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Results } from '@/components/results/results';
import type { Spacecraft } from '@/types/types';

const mockSpacecrafts: Spacecraft[] = [
  { uid: '1', name: 'Enterprise' },
  { uid: '2', name: 'Voyager' },
];

describe('Results', () => {
  it('should show loader when isLoading is true', () => {
    render(
      <MemoryRouter>
        <Results spacecrafts={[]} error={null} isLoading={true} />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should show error when error exists', () => {
    render(
      <MemoryRouter>
        <Results
          spacecrafts={[]}
          error={{ name: 'ApiError', message: 'Error API' }}
          isLoading={false}
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/Error Loading Data/i)).toBeInTheDocument();
  });

  it('should display list of results when data is available', () => {
    render(
      <MemoryRouter>
        <Results spacecrafts={mockSpacecrafts} error={null} isLoading={false} />
      </MemoryRouter>
    );
    expect(screen.getByText(/enterprise/i)).toBeInTheDocument();
    expect(screen.getByText(/voyager/i)).toBeInTheDocument();
  });

  it('should show empty state when no results found', () => {
    render(
      <MemoryRouter>
        <Results spacecrafts={[]} error={null} isLoading={false} />
      </MemoryRouter>
    );
    expect(screen.getByText(/no spacecrafts found/i)).toBeInTheDocument();
  });
});
