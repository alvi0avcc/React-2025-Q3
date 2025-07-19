import { render, screen } from '@testing-library/react';
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
  it('List of spacecrafts', () => {
    render(<ResultsResponse spacecrafts={spacecrafts} />);
    expect(screen.getByText(/enterprise/i)).toBeInTheDocument();
    expect(screen.getByText(/voyager/i)).toBeInTheDocument();
  });

  it('Type of spacecraft', () => {
    render(<ResultsResponse spacecrafts={spacecrafts} />);
    expect(screen.getAllByText(/starship/i).length).toBe(2);
  });

  it('Status of spacecrafts', () => {
    render(<ResultsResponse spacecrafts={spacecrafts} />);
    expect(screen.getByText(/active/i)).toBeInTheDocument();
    expect(screen.getByText(/lost/i)).toBeInTheDocument();
  });

  it('Hidden if no class or status', () => {
    const data = [{ uid: '3', name: 'Defiant' }];
    render(<ResultsResponse spacecrafts={data} />);
    expect(screen.getByText(/defiant/i)).toBeInTheDocument();
    expect(screen.getAllByText(/hidden/i).length).toBe(2);
  });

  it('Empty table if no spacecrafts', () => {
    render(<ResultsResponse spacecrafts={[]} />);
    const rowgroups = screen.getAllByRole('rowgroup');
    const tbody = rowgroups[1];
    expect(tbody.children.length).toBe(0);
  });
});
