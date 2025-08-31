import { baseUrlLocal, baseUrlRemote } from '@/const';
import { checkLocalFileExists } from './fileCheck';
import type { FetchResponse, SourceData } from '@/types';
import { isCountryList } from './valid';

export async function fetchCo2Data(): Promise<FetchResponse> {
  let url = baseUrlRemote;
  let source: SourceData = 'remote';
  const result: FetchResponse = { data: undefined, source, url };

  try {
    const localFileExists = await checkLocalFileExists(baseUrlLocal);

    if (localFileExists) {
      url = baseUrlLocal;
      source = 'local';
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (isCountryList(data)) {
      result.data = data;
      result.source = source;
      result.url = url;
    } else {
      throw new Error('Invalid data format received');
    }

    return result;
  } catch (error) {
    console.error(`Failed to fetch data from ${source}:`, error);
    result.data = undefined;
    return result;
  }
}
