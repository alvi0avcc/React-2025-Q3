export const formatColumnName = (column: string): string => {
  const nameMap: Record<string, string> = {
    co2: 'CO₂',
    co2_per_capita: 'CO₂ per Capita',
    methane: 'Methane',
    oil_co2: 'Oil CO₂',
    temperature_change_from_co2: 'Temp Change from CO₂',
  };

  return (
    nameMap[column] ||
    column
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
};
