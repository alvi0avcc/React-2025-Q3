import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import About from '@/pages/About/About';
import userEvent from '@testing-library/user-event';

describe('About Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
  });

  it('should render the main heading', () => {
    expect(
      screen.getByRole('heading', { level: 2, name: /about/i })
    ).toBeInTheDocument();
  });

  it('should render the description paragraph', () => {
    expect(
      screen.getByText(
        /The application was developed according to an educational assignment./i
      )
    ).toBeInTheDocument();
  });

  it('should render the task link with correct attributes', () => {
    const taskLink = screen.getByRole('link', {
      name: /Task «React: Routing and Hooks»/i,
    });
    expect(taskLink).toBeInTheDocument();
    expect(taskLink).toHaveAttribute(
      'href',
      'https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/functional-routing.md'
    );
    expect(taskLink).toHaveAttribute('target', 'blank');
  });

  it('should render the author link with correct attributes', () => {
    const authorLink = screen.getByRole('link', { name: /Aleksandr/i });
    expect(authorLink).toBeInTheDocument();
    expect(authorLink).toHaveAttribute('href', 'https://github.com/alvi0avcc');
    expect(authorLink).toHaveAttribute('target', 'blank');
  });

  it('should render the RS School link with correct attributes', () => {
    const rsLink = screen.getByRole('link', {
      name: /The Rolling Scopes 2025 - React Course/i,
    });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(rsLink).toHaveAttribute('target', 'blank');
  });

  it('should render the "Back to Home" NavLink with correct attributes', () => {
    const homeLink = screen.getByRole('link', { name: /Back to Home Page/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should navigate to home when "Back to Home" is clicked', async () => {
    const user = userEvent.setup();
    const homeLink = screen.getByRole('link', { name: /Back to Home Page/i });
    await user.click(homeLink);
  });

  it('should render the "With respect to you" text', () => {
    expect(screen.getByText(/With respect to you/i)).toBeInTheDocument();
  });
});
