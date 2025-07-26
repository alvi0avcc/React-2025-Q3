export interface Spacecraft {
  uid: string;
  name: string;
  registry?: string;
  status?: string;
  dateStatus?: string;
  species?: string;
  owner?: Element;
  operator?: Element;
  affiliation?: Element;
  spacecraftClass?: Element;
}

type Element = {
  uid: string;
  name: string;
};

export interface PaginationOptions {
  pageNumber: number;
  pageSize: number;
  maxItems?: number;
}

export interface SpacecraftsTotalInfo {
  firstPage: boolean;
  lastPage: boolean;
  numberOfElements: number;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
