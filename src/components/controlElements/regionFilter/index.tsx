import styles from './regionFilter.module.css';
import type { RegionFilterProps } from '@/types';
import { getAllRegions } from '@/utils/countryRegions';
import { memo, useCallback, useMemo, useState, type ChangeEvent } from 'react';

export const RegionFilter = memo(({ onRegionChange }: RegionFilterProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const handleRegionChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const newRegion = event.target.value;
      setSelectedRegion(newRegion);
      onRegionChange(newRegion);
    },
    [onRegionChange]
  );

  const regions = useMemo(() => getAllRegions(), []);

  return (
    <div>
      <label htmlFor="region-filter">Filter by region:</label>
      <select
        id="region-filter"
        className={styles.filterSelect}
        value={selectedRegion}
        onChange={handleRegionChange}
      >
        {regions.map(region => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
});

RegionFilter.displayName = 'RegionFilter';
