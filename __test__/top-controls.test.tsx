import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopControls } from '@/components/top-controls/top-controls';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';

describe('TopControls', () => {
  it('renders the input field and button', () => {
    render(
      <MemoryRouter>
        {' '}
        {/* Wrap with MemoryRouter */}
        <TopControls onSearchResults={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('onSearchResults', async () => {
    const onSearchResults = vi.fn();
    render(
      <MemoryRouter>
        {' '}
        {/* Wrap with MemoryRouter */}
        <TopControls onSearchResults={onSearchResults} />
      </MemoryRouter>
    );
    await userEvent.type(screen.getByRole('textbox'), 'Enterprise');
    await userEvent.click(screen.getByRole('button'));
    expect(onSearchResults).toHaveBeenCalled();
  });
});
