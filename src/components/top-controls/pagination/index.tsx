import type { PaginationOptions } from '@src/types/types';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Pagination');
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
      <button onClick={handlePrevPage}>{t('prev')}</button>
      <label htmlFor="">
        {t('page')} {pageNumber}
        {totalPages ? ` ${t('of')} ${totalPages}` : ''}
      </label>
      <button onClick={handleNextPage}>{t('next')}</button>
    </section>
  );
};
