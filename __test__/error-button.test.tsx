import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ErrorButton } from '@/components/error-button/error-button';
import { ErrorBoundary } from '@/components/error-boundary/error-boundary';

describe('ErrorButton', () => {
  it('render', () => {
    render(<ErrorButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Error Button/i })
    ).toBeInTheDocument();
  });

  it('activate ErrorBoundary during Errors', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    spy.mockRestore();
  });
});
