import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { SearchButton } from '@/components/top-controls/search-button/search-button';

describe('SearchButton', () => {
  it('renders button with "Search" text when not loading', () => {
    render(<SearchButton isFetching={false} onSearch={() => {}} />);

    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders button with "Searching..." text when loading', () => {
    render(<SearchButton isFetching={true} onSearch={() => {}} />);

    const button = screen.getByRole('button', { name: /searching/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('calls onSearch when clicked', async () => {
    const onSearch = vi.fn();
    render(<SearchButton isFetching={false} onSearch={onSearch} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('does not call onSearch when clicked while loading', async () => {
    const onSearch = vi.fn();
    render(<SearchButton isFetching={true} onSearch={onSearch} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onSearch).not.toHaveBeenCalled();
  });
});
