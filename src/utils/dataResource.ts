import type { FetchResponse } from '@/types';
import { fetchCo2Data } from './dataFetch';

let dataCache: FetchResponse | null = null;
let promise: Promise<FetchResponse> | null = null;

export function fetchData() {
  if (dataCache) {
    return dataCache;
  }

  if (promise) {
    throw promise;
  }

  promise = fetchCo2Data()
    .then(data => {
      dataCache = data;
      promise = null;
      return data;
    })
    .catch(error => {
      promise = null;
      throw error;
    });

  throw promise;
}

export function invalidateDataCache() {
  dataCache = null;
  promise = null;
}
