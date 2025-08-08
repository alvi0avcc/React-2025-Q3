import { render, screen } from '@testing-library/react';
import { ResultsReject } from '@/components/results/reject/reject';
import type { ApiError } from '@/api/api';
import { vi } from 'vitest';

vi.mock('@/utils/valid', () => ({
  isApiError: vi.fn().mockImplementation((error: unknown) => {
    return typeof error === 'object' && error !== null && 'status' in error;
  }),
}));

const createMockApiError = (message: string, status?: number): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
};

describe('ResultsReject Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the error title and message', () => {
    const error = createMockApiError('Test error message');
    render(<ResultsReject error={error} />);

    expect(
      screen.getByRole('heading', { name: /error loading data/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/test error message/i)).toBeInTheDocument();
  });

  it('shows 404 specific hint when status is 404', () => {
    const error = createMockApiError('Not found', 404);
    render(<ResultsReject error={error} />);

    expect(
      screen.getByText(/the requested resource was not found/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/please check your search query/i)
    ).toBeInTheDocument();
  });

  it('shows 405 specific hint when status is 405', () => {
    const error = createMockApiError('Method not allowed', 405);
    render(<ResultsReject error={error} />);

    expect(
      screen.getByText(/this endpoint does not accept the request method/i)
    ).toBeInTheDocument();
  });

  it('shows server error hint for 500+ status', () => {
    const error = createMockApiError('Server error', 500);
    render(<ResultsReject error={error} />);

    expect(
      screen.getByText(/our servers are having issues/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/please try again later/i)).toBeInTheDocument();
  });

  it('does not show hint for errors without status', () => {
    const error = new Error('Unknown error');
    render(<ResultsReject error={error} />);

    expect(
      screen.queryByText(/the requested resource was not found/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/our servers are having issues/i)
    ).not.toBeInTheDocument();
  });
});
