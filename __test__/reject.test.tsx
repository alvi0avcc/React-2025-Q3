import { render, screen } from '@testing-library/react';
import { ResultsReject } from '@/components/results/reject/reject';

describe('ResultsReject', () => {
  it('error message', () => {
    render(
      <ResultsReject error={{ name: 'ApiError', message: 'Error API' }} />
    );
    expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    expect(screen.getByText(/error api/i)).toBeInTheDocument();
  });

  it('displays 404 not found message', () => {
    render(
      <ResultsReject
        error={{ name: 'ApiError', message: 'Not found', status: 404 }}
      />
    );
    expect(
      screen.getByText(/the requested resource was not found/i)
    ).toBeInTheDocument();
  });

  it('displays 405 Method Not Allowed', () => {
    render(
      <ResultsReject
        error={{ name: 'ApiError', message: 'Method Not Allowed', status: 405 }}
      />
    );
    expect(
      screen.getByText(
        (content, element) =>
          element?.tagName.toLowerCase() === 'p' &&
          content.startsWith('Method Not Allowed:')
      )
    ).toBeInTheDocument();
  });

  it('>=500', () => {
    render(
      <ResultsReject
        error={{ name: 'ApiError', message: 'Server error', status: 500 }}
      />
    );
    expect(
      screen.getByText(/our servers are having issues/i)
    ).toBeInTheDocument();
  });
});
