import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/components/top-controls/pagination/pagination';
import type { PaginationOptions } from '@/types/types';
import { vi } from 'vitest';

describe('Pagination Component', () => {
  const mockPagination: PaginationOptions = {
    pageNumber: 2,
    pageSize: 10,
    maxItems: 100,
  };

  const mockOnPaginationChange = vi.fn();

  beforeEach(() => {
    mockOnPaginationChange.mockClear();
  });

  it('should render pagination controls', () => {
    render(
      <Pagination
        pagination={mockPagination}
        onPaginationChange={mockOnPaginationChange}
        totalPages={5}
      />
    );

    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  it('should not render when totalPages is 0', () => {
    const { container } = render(
      <Pagination
        pagination={mockPagination}
        onPaginationChange={mockOnPaginationChange}
        totalPages={0}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should call onPaginationChange with next page when Next is clicked', () => {
    render(
      <Pagination
        pagination={mockPagination}
        onPaginationChange={mockOnPaginationChange}
        totalPages={5}
      />
    );

    fireEvent.click(screen.getByText('Next'));
    expect(mockOnPaginationChange).toHaveBeenCalledWith({
      pageNumber: 3,
      pageSize: 10,
      maxItems: 100,
    });
  });

  it('should call onPaginationChange with previous page when Prev is clicked', () => {
    render(
      <Pagination
        pagination={mockPagination}
        onPaginationChange={mockOnPaginationChange}
        totalPages={5}
      />
    );

    fireEvent.click(screen.getByText('Prev'));
    expect(mockOnPaginationChange).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 10,
      maxItems: 100,
    });
  });

  it('should not go to next page when on last page', () => {
    render(
      <Pagination
        pagination={{ ...mockPagination, pageNumber: 5 }}
        onPaginationChange={mockOnPaginationChange}
        totalPages={5}
      />
    );

    fireEvent.click(screen.getByText('Next'));
    expect(mockOnPaginationChange).not.toHaveBeenCalled();
  });

  it('should not go to previous page when on first page', () => {
    render(
      <Pagination
        pagination={{ ...mockPagination, pageNumber: 1 }}
        onPaginationChange={mockOnPaginationChange}
        totalPages={5}
      />
    );

    fireEvent.click(screen.getByText('Prev'));
    expect(mockOnPaginationChange).not.toHaveBeenCalled();
  });
});
