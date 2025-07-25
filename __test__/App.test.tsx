import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';

type Spacecraft = { uid: string; name: string };
type ApiError = { message: string };
type TopControlsProps = {
  onSearchResults: (
    spacecrafts: Spacecraft[],
    error: ApiError | null,
    isLoading: boolean
  ) => void;
};

vi.mock('@/components/top-controls/top-controls', () => ({
  TopControls: ({ onSearchResults }: TopControlsProps) => (
    <div data-testid="top-controls">
      <button
        onClick={() =>
          onSearchResults([{ uid: '1', name: 'Enterprise' }], null, false)
        }
      >
        Search
      </button>
    </div>
  ),
}));
vi.mock('@/components/error-boundary/error-boundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const mockResultsProps: {
  spacecrafts: Spacecraft[];
  error: ApiError | null;
  isLoading: boolean;
}[] = [];
vi.mock('@/components/results/results', () => ({
  Results: (props: {
    spacecrafts: Spacecraft[];
    error: ApiError | null;
    isLoading: boolean;
  }) => {
    mockResultsProps.push(props);
    return <div data-testid="results" />;
  },
}));

import App from '@/App';

describe('App', () => {
  beforeEach(() => {
    mockResultsProps.length = 0;
  });

  it('render', () => {
    render(<App />);
    expect(screen.getByText(/Star Trek API/i)).toBeInTheDocument();
    expect(screen.getByTestId('top-controls')).toBeInTheDocument();
    expect(screen.getByTestId('results')).toBeInTheDocument();
  });

  it('search results', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Search'));
    const { spacecrafts = undefined } = mockResultsProps.at(-1) || {};
    expect(spacecrafts).toEqual([{ uid: '1', name: 'Enterprise' }]);
    expect(screen.getByTestId('results')).toBeInTheDocument();
  });
});
