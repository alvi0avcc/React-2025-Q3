import type { Spacecraft } from '@src/types/types';
import styles from './details.module.css';
import { getDisplayValue } from '@src/utils/valid';

type ContextType = {
  spacecraft: Spacecraft | null;
  onClose: () => void;
};

const Details = ({ context }: { context: ContextType }) => {
  const { spacecraft, onClose } = context;

  const ship: Spacecraft | null = spacecraft;

  if (!ship) return;

  return (
    <fieldset className={styles.details}>
      <div className={styles.close} onClick={onClose}>
        ⛒
      </div>

      <legend>Details</legend>

      <h3>{ship.name}</h3>
      <p>uid: {ship.uid}</p>
      <p>registry: {getDisplayValue(ship.registry)}</p>
      <p>Status: {getDisplayValue(ship.status)}</p>
      <p>dateStatus: {getDisplayValue(ship.dateStatus)}</p>
      <p>species: {getDisplayValue(ship.species)}</p>
      <p>owner: {getDisplayValue(ship.owner?.name)}</p>
      <p>operator: {getDisplayValue(ship.operator?.name)}</p>
      <p>affiliation: {getDisplayValue(ship.affiliation?.name)}</p>
      <p>Class: {getDisplayValue(ship.spacecraftClass?.name)}</p>
    </fieldset>
  );
};

export default Details;
