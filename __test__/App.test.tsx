import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import React from 'react';

vi.mock('@/components/wrapper/wrapper', () => ({
  Wrapper: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/error-boundary/error-boundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@/components/header/header', () => ({
  default: () => <header data-testid="header" />,
}));

vi.mock('@/pages/HomePage/HomePage', () => ({
  default: () => <div data-testid="home-page" />,
}));

vi.mock('@/pages/About/About', () => ({
  default: () => <div data-testid="about-page" />,
}));

vi.mock('@/pages/Page404/Page404', () => ({
  default: () => <div data-testid="not-found-page" />,
}));

import App from '@/App';

describe('App', () => {
  it('renders header and home page by default', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders about page when navigating to /about', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('about-page')).toBeInTheDocument();
  });

  it('renders not found page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});
