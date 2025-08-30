import { useState } from 'react';
import type { CountryList } from '@/types';
import { CountrySelect } from '@components/countrySelect';
import { CountryDetail } from '@components/countryDetail';

interface CountriesListProps {
  data: CountryList;
}

export const CountriesList = ({ data }: CountriesListProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );

  const handleCountrySelect = (countryKey: string) => {
    setSelectedCountry(countryKey);
  };

  const handleYearChange = (year: number | undefined) => {
    setSelectedYear(year);
  };

  return (
    <div className="countries-list">
      <h2>CO2 Emissions Data by Country</h2>

      <CountrySelect
        data={data}
        onCountrySelect={handleCountrySelect}
        onYearChange={handleYearChange}
      />

      <CountryDetail
        countryKey={selectedCountry}
        data={data}
        selectedYear={selectedYear}
      />
    </div>
  );
};
