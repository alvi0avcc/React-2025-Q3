import type { CountryList, CountryEntry } from '@/types';

interface CountryDetailProps {
  countryKey: string | null;
  data: CountryList;
}

export function CountryDetail({ countryKey, data }: CountryDetailProps) {
  if (!countryKey || !data[countryKey]) {
    return (
      <div>
        <p>Please select a country to view details</p>
      </div>
    );
  }

  const countryEntry: CountryEntry = data[countryKey];

  return (
    <div>
      <h2>{countryKey}</h2>

      {countryEntry.iso_code && (
        <p>
          <strong>ISO Code:</strong> {countryEntry.iso_code}
        </p>
      )}

      <p>
        <strong>Data points:</strong> {countryEntry.data.length}
      </p>

      <h3>Data Preview:</h3>
      {countryEntry.data.length > 0 ? (
        <div className="data-preview">
          <pre>{JSON.stringify(countryEntry.data[0], null, 2)}</pre>
          {countryEntry.data.length > 1 && (
            <p>...and {countryEntry.data.length - 1} more entries</p>
          )}
        </div>
      ) : (
        <p>No data available for this country</p>
      )}
    </div>
  );
}
