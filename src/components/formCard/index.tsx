import type { SubmissionsFormData } from '@/store/formSlice';
import styles from './formCard.module.css';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

interface FormCardProps {
  data: SubmissionsFormData;
  id: number;
}

const FormCard = ({ data, id }: FormCardProps) => {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (id === 0) {
      setIsNew(true);

      const timer = setTimeout(() => {
        setIsNew(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div key={id} className={classNames(styles.card, isNew && styles.newCard)}>
      <h3 className={styles.cardTitle}>{data.type.toUpperCase()} Form</h3>

      <div className={styles.content}>
        {Object.entries(data).map(element => (
          <div key={element[0]} className={styles.row}>
            <span className={styles.label}>{element[0]}:</span>
            <span className={styles.value}>
              {element[0] === 'acceptTerms'
                ? element[1]
                  ? 'Yes'
                  : 'No'
                : element[0] === 'submittedAt'
                  ? new Date(element[1]).toLocaleString()
                  : element[1]}
            </span>
          </div>
        ))}
        ;
        {data.pictureBase64 && (
          <div className={styles.pictureSection}>
            <img
              src={data.pictureBase64}
              alt="Uploaded"
              className={styles.image}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCard;
