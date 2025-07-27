import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ErrorBoundary } from '@/components/error-boundary/error-boundary';

describe('ErrorBoundary', () => {
  it('render if OK', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('render if errror', () => {
    const ProblemChild = () => {
      throw new Error('Test error');
    };

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/test error/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();

    spy.mockRestore();
  });
});
