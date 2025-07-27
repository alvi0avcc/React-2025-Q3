import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation, useOutletContext } from 'react-router';
import { Details } from '@/components/results/details/details';
import type { Spacecraft } from '@/types/types';
import { getDisplayValue } from '@/utils/valid';
import { vi } from 'vitest';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useOutletContext: vi.fn(),
    useLocation: vi.fn(),
  };
});

vi.mock('@/utils/valid', () => ({
  getDisplayValue: vi.fn(value => value ?? 'N/A'),
}));

const mockSpacecraft: Spacecraft = {
  uid: '1',
  name: 'Enterprise',
  registry: 'NCC-1701',
  status: 'Active',
  dateStatus: '2265-2245',
  species: 'Human',
  owner: {
    name: 'Starfleet',
    uid: '',
  },
  operator: {
    name: 'Starfleet Command',
    uid: '',
  },
  affiliation: {
    name: 'United Federation of Planets',
    uid: '',
  },
  spacecraftClass: { name: 'Constitution', uid: 'c1' },
};

describe('Details Component', () => {
  beforeEach(() => {
    (useOutletContext as jest.Mock).mockReturnValue({ spacecraft: null });
    (useLocation as jest.Mock).mockReturnValue({ state: null });
  });

  it('should render nothing when no spacecraft data is available', () => {
    const { container } = render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render spacecraft details from outlet context', () => {
    (useOutletContext as jest.Mock).mockReturnValue({
      spacecraft: mockSpacecraft,
    });

    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
    expect(screen.getByText(/NCC-1701/i)).toBeInTheDocument();
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
  });

  it('should render spacecraft details from location state', () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: { spacecraft: mockSpacecraft },
    });

    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    expect(screen.getByText('Enterprise')).toBeInTheDocument();
    expect(screen.getByText(/NCC-1701/i)).toBeInTheDocument();
  });

  it('should prioritize outlet context over location state', () => {
    const differentShip = { ...mockSpacecraft, name: 'Voyager' };
    (useOutletContext as jest.Mock).mockReturnValue({
      spacecraft: differentShip,
    });
    (useLocation as jest.Mock).mockReturnValue({
      state: { spacecraft: mockSpacecraft },
    });

    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    expect(screen.getByText('Voyager')).toBeInTheDocument();
    expect(screen.queryByText('Enterprise')).not.toBeInTheDocument();
  });

  it('should call getDisplayValue for all displayable fields', () => {
    (useOutletContext as jest.Mock).mockReturnValue({
      spacecraft: mockSpacecraft,
    });

    render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    expect(getDisplayValue).toHaveBeenCalledWith(mockSpacecraft.registry);
    expect(getDisplayValue).toHaveBeenCalledWith(mockSpacecraft.status);
    expect(getDisplayValue).toHaveBeenCalledWith(mockSpacecraft.dateStatus);
    expect(getDisplayValue).toHaveBeenCalledWith(mockSpacecraft.species);
    expect(getDisplayValue).toHaveBeenCalledWith(mockSpacecraft.owner?.name);
    expect(getDisplayValue).toHaveBeenCalledWith(mockSpacecraft.operator?.name);
    expect(getDisplayValue).toHaveBeenCalledWith(
      mockSpacecraft.affiliation?.name
    );
    expect(getDisplayValue).toHaveBeenCalledWith(
      mockSpacecraft.spacecraftClass?.name
    );
  });
});
