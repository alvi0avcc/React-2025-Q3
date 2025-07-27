import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router';
import { ResultsResponse } from '@/components/results/response/response';
import { vi } from 'vitest';
import { getDisplayValue } from '@/utils/valid';

// Mock the hooks and utility function
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/utils/valid', () => ({
  getDisplayValue: vi.fn(value => value ?? 'hidden'),
}));

const mockSpacecrafts = [
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

describe('ResultsResponse Component', () => {
  const mockNavigate = vi.fn();
  const mockOnSpacecraftSelected = vi.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
    mockOnSpacecraftSelected.mockClear();
  });

  it('should render spacecraft table with correct data', () => {
    render(
      <MemoryRouter>
        <ResultsResponse spacecrafts={mockSpacecrafts} />
      </MemoryRouter>
    );

    expect(screen.getByText('Enterprise')).toBeInTheDocument();
    expect(screen.getByText('Voyager')).toBeInTheDocument();
    expect(screen.getAllByText('Starship')).toHaveLength(2);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Lost')).toBeInTheDocument();
  });

  it('should handle missing optional fields', () => {
    const minimalData = [{ uid: '3', name: 'Defiant' }];
    render(
      <MemoryRouter>
        <ResultsResponse spacecrafts={minimalData} />
      </MemoryRouter>
    );

    expect(screen.getByText('Defiant')).toBeInTheDocument();
    expect(screen.getAllByText('hidden')).toHaveLength(2);
  });

  it('should not navigate when no onSpacecraftSelected callback', () => {
    render(
      <MemoryRouter>
        <ResultsResponse spacecrafts={mockSpacecrafts} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Enterprise'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should render empty table when no spacecrafts', () => {
    render(
      <MemoryRouter>
        <ResultsResponse spacecrafts={[]} />
      </MemoryRouter>
    );

    const rows = screen.getAllByRole('rowgroup')[1].querySelectorAll('tr');
    expect(rows).toHaveLength(0);
  });

  it('should update spacecraft state when selected', () => {
    render(
      <MemoryRouter>
        <ResultsResponse
          spacecrafts={mockSpacecrafts}
          onSpacecraftSelected={mockOnSpacecraftSelected}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Enterprise'));
    expect(mockOnSpacecraftSelected).toHaveBeenCalledWith(0);
  });
});
