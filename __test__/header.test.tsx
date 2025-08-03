import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '@/context/themeProvider';
import Header from '@/components/header/header';

vi.mock('@/assets/react.svg', () => ({
  default: 'test-react-logo.svg',
}));

vi.mock('@/assets/moon.svg', () => ({
  default: 'test-moon-icon.svg',
}));

vi.mock('@/assets/sun.svg', () => ({
  default: 'test-sun-icon.svg',
}));

describe('Header Component', () => {
  const renderHeader = () => {
    return render(
      <MemoryRouter>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  it('renders logo with correct link and image', () => {
    renderHeader();

    const logoLink = screen.getByRole('link', { name: /logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');

    const logoImage = screen.getByRole('img', { name: /logo/i });
    expect(logoImage).toHaveAttribute('src', 'test-react-logo.svg');
  });

  it('renders about link with correct attributes', () => {
    renderHeader();

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });
});
