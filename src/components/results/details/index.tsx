import type { Spacecraft } from '@src/types/types';
import styles from './details.module.css';
import { getDisplayValue } from '@src/utils/valid';
import { useTranslations } from 'next-intl';

type ContextType = {
  spacecraft: Spacecraft | null;
  onClose: () => void;
};

const Details = ({ context }: { context: ContextType }) => {
  const t = useTranslations('Details');
  const { spacecraft, onClose } = context;

  const ship: Spacecraft | null = spacecraft;

  if (!ship) return;

  return (
    <fieldset className={styles.details}>
      <div className={styles.close} onClick={onClose}>
        ⛒
      </div>

      <legend>{t('details')}</legend>

      <h3>{ship.name}</h3>
      <p>
        {t('uid')}: {ship.uid}
      </p>
      <p>
        {t('registry')}: {getDisplayValue(ship.registry)}
      </p>
      <p>
        {t('status')}: {getDisplayValue(ship.status)}
      </p>
      <p>
        {t('dateStatus')}: {getDisplayValue(ship.dateStatus)}
      </p>
      <p>
        {t('species')}: {getDisplayValue(ship.species)}
      </p>
      <p>
        {t('owner')}: {getDisplayValue(ship.owner?.name)}
      </p>
      <p>
        {t('operator')}: {getDisplayValue(ship.operator?.name)}
      </p>
      <p>
        {t('affiliation')}: {getDisplayValue(ship.affiliation?.name)}
      </p>
      <p>
        {t('class')}: {getDisplayValue(ship.spacecraftClass?.name)}
      </p>
    </fieldset>
  );
};

export default Details;
