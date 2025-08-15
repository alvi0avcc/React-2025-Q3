import type { PaginationOptions } from '@src/types/types';

interface Props {
  pagination: PaginationOptions;
  onPaginationChange: (newPagination: PaginationOptions) => void;
  totalPages: number;
}

export const Pagination = ({
  pagination,
  onPaginationChange,
  totalPages,
}: Props) => {
  const { pageNumber, pageSize, maxItems } = pagination;

  const handlePrevPage = () => {
    if (pageNumber - 1 < 1) return;
    onPaginationChange({
      pageNumber: pageNumber - 1,
      pageSize,
      maxItems,
    });
  };

  const handleNextPage = () => {
    if (pageNumber + 1 > totalPages) return;
    onPaginationChange({
      pageNumber: pageNumber + 1,
      pageSize,
      maxItems,
    });
  };

  if (totalPages === 0) return <></>;

  return (
    <section>
      <button onClick={handlePrevPage}>Prev</button>
      <label htmlFor="">
        Page {pageNumber}
        {totalPages ? ` of ${totalPages}` : ''}
      </label>
      <button onClick={handleNextPage}>Next</button>
    </section>
  );
};
