import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Page404 from '@/pages/Page404/Page404';
import userEvent from '@testing-library/user-event';

describe('Page404 Component', () => {
  it('should render the Back to Home link with correct attributes', () => {
    render(
      <MemoryRouter>
        <Page404 />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /Back to Home Page/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should navigate to home when link is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Page404 />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /Back to Home Page/i });
    await user.click(homeLink);
  });
});
