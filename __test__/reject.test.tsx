import { render, screen } from '@testing-library/react';
import { ResultsReject } from '@/components/results/reject/reject';
import type { ApiError } from '@/api/api';

class TestApiError extends Error implements ApiError {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

describe('ResultsReject', () => {
  it('displays error title and message', () => {
    const error = new TestApiError('Error API');
    render(<ResultsReject error={error} />);

    expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    expect(screen.getByText(/error api/i)).toBeInTheDocument();
  });

  it('displays 404 not found hint', () => {
    const error = new TestApiError('Not found', 404);
    render(<ResultsReject error={error} />);

    expect(
      screen.getByText(/the requested resource was not found/i)
    ).toBeInTheDocument();
  });

  it('displays 405 Method Not Allowed hint', () => {
    const error = new TestApiError('Method Not Allowed', 405);
    render(<ResultsReject error={error} />);

    expect(
      screen.getByText(/This endpoint does not accept the request method/i)
    ).toBeInTheDocument();
  });

  it('displays server error hint for 500+ status', () => {
    const error = new TestApiError('Server error', 500);
    render(<ResultsReject error={error} />);

    expect(
      screen.getByText(/our servers are having issues/i)
    ).toBeInTheDocument();
  });

  it('does not display hint for errors without status', () => {
    const error = new TestApiError('Unknown error');
    render(<ResultsReject error={error} />);

    expect(screen.getByText(/unknown error/i)).toBeInTheDocument();
  });
});
