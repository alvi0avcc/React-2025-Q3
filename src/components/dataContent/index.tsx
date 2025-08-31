import { fetchData } from '@/utils/dataResource';
import { CountriesList } from '@components/countriesList';

export function DataContent() {
  const result = fetchData();

  return (
    <div>
      <h1>All CO2 Emissions Data</h1>
      <p>
        Source: {result.source} | URL: {result.url}
      </p>

      {result.data ? (
        <CountriesList data={result.data} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}
