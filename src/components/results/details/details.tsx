import type { Spacecraft } from '@/types/types';
import styles from './details.module.css';
import { useOutletContext, useLocation } from 'react-router';
import { getDisplayValue } from '@/utils/valid';

type ContextType = { spacecraft: Spacecraft | null };

export const Details = () => {
  const { spacecraft } = useOutletContext<ContextType>();

  const location = useLocation();
  const spacecraftFromState = location.state?.spacecraft;
  const ship: Spacecraft = spacecraft || spacecraftFromState;

  if (!ship) return;

  return (
    <div className={styles.details}>
      <p>Details</p>

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
    </div>
  );
};
