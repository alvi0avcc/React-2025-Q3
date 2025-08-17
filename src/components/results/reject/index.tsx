import styles from './reject.module.css';
import { isApiError } from '@src/utils/valid';
import type { ApiError } from '@src/api/api';
import { useTranslations } from 'next-intl';

type Props = {
  error: ApiError;
};
export const ResultsReject = ({ error }: Props) => {
  const t = useTranslations('ResultsReject');
  console.log('ResultsReject =', error);

  const errorHint = () => {
    if (!isApiError(error)) return null;

    switch (error.status) {
      case 404: {
        return <p className={styles.hint}>{t('404')}</p>;
      }
      case 405: {
        return <p className={styles.hint}>{t('405')}</p>;
      }
      default: {
        if ((error.status ?? 0) >= 500) {
          return <p className={styles.hint}>{t('5xx')}</p>;
        }

        return <p className={styles.hint}>{error.status}</p>;
      }
    }
  };

  return (
    <div className={styles.reject}>
      <h3 className={styles.title}>{t('error')}</h3>

      <p className={styles.message}>{error.message}</p>

      {errorHint()}
    </div>
  );
};
