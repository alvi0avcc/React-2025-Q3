export type SourceData = 'local' | 'remote';

export type CountryList = Record<string, CountryEntry>;

export type CountryEntry = {
  data: unknown[];
  iso_code?: string;
};

export type FetchResponse = {
  data?: CountryList;
  source: SourceData;
  url: string;
};
