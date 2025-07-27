import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Header from '@/components/header/header';

describe('Header Component', () => {
  it('should render logo with link to home page', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoLink = screen.getByRole('link', { name: /logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should render about link with correct attributes', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('should display logo image', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoImage = screen.getByRole('img', { name: /logo/i });
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', './react.svg');
  });
});
