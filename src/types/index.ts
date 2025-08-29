export type SourceData = 'local' | 'remote';

export type CountryList = Record<string, CountryEntry>;

export type CountryEntry = {
  data: DataEntry[];
  iso_code?: string;
};

export type DataEntry = {
  year?: number;
  population?: number;
  cement_co2?: number;
  cement_co2_per_capita?: number;
  cumulative_cement_co2?: number;
};

export type FetchResponse = {
  data?: CountryList;
  source: SourceData;
  url: string;
};

export type CountryDataProps = {
  data: CountryList;
  countryKey: string;
};

export type CountrySelectProps = {
  data: CountryList;
  onCountryChange: (countryKey: string) => void;
};

export type RegionFilterProps = {
  onRegionChange: (region: string) => void;
};
