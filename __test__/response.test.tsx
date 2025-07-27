import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ResultsResponse } from '@/components/results/response/response';

const spacecrafts = [
  {
    uid: '1',
    name: 'Enterprise',
    spacecraftClass: { name: 'Starship', uid: 'c1' },
    status: 'Active',
  },
  {
    uid: '2',
    name: 'Voyager',
    spacecraftClass: { name: 'Starship', uid: 'c2' },
    status: 'Lost',
  },
];

describe('ResultsResponse', () => {
  it('should display list of spacecrafts', () => {
    render(
      <MemoryRouter>
        <ResultsResponse spacecrafts={spacecrafts} />
      </MemoryRouter>
    );
    expect(screen.getByText(/enterprise/i)).toBeInTheDocument();
    expect(screen.getByText(/voyager/i)).toBeInTheDocument();
  });

  it('should display spacecraft class type', () => {
    render(
      <MemoryRouter>
        <ResultsResponse spacecrafts={spacecrafts} />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/starship/i).length).toBe(2);
  });

  it('should display spacecraft status', () => {
    render(
      <MemoryRouter>
        <ResultsResponse spacecrafts={spacecrafts} />
      </MemoryRouter>
    );
    expect(screen.getByText(/active/i)).toBeInTheDocument();
    expect(screen.getByText(/lost/i)).toBeInTheDocument();
  });

  it('should show "hidden" for missing class or status', () => {
    const data = [{ uid: '3', name: 'Defiant' }];
    render(
      <MemoryRouter>
        <ResultsResponse spacecrafts={data} />
      </MemoryRouter>
    );
    expect(screen.getByText(/defiant/i)).toBeInTheDocument();
    expect(screen.getAllByText(/hidden/i).length).toBe(2);
  });

  it('should display empty table when no spacecrafts', () => {
    render(
      <MemoryRouter>
        <ResultsResponse spacecrafts={[]} />
      </MemoryRouter>
    );
    const rowgroups = screen.getAllByRole('rowgroup');
    const tbody = rowgroups[1];
    expect(tbody.children.length).toBe(0);
  });
});
