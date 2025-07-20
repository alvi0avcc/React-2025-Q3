import { render, screen } from '@testing-library/react';
import { Results } from '@/components/results/results';

const spacecrafts = [
  { uid: '1', name: 'Enterprise' },
  { uid: '2', name: 'Voyager' },
];

describe('Results', () => {
  it('show loader during - isLoading', () => {
    render(<Results spacecrafts={[]} error={null} isLoading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('Show error', () => {
    render(
      <Results
        spacecrafts={[]}
        error={{ name: 'ApiError', message: 'Error API' }}
        isLoading={false}
      />
    );
    expect(screen.getByText(/Error Loading Data/i)).toBeInTheDocument();
  });

  it('List of results', () => {
    render(
      <Results spacecrafts={spacecrafts} error={null} isLoading={false} />
    );
    expect(screen.getByText(/enterprise/i)).toBeInTheDocument();
    expect(screen.getByText(/voyager/i)).toBeInTheDocument();
  });

  it('If list of results is empty', () => {
    render(<Results spacecrafts={[]} error={null} isLoading={false} />);
    expect(screen.getByText(/no spacecrafts found/i)).toBeInTheDocument();
  });
});
