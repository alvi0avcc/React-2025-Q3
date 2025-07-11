export interface Spacecraft {
  uid: string;
  name: string;
  registry?: string;
  status?: string;
  dateStatus?: string;
  species?: string;
  owner?: string;
  operator?: string;
  affiliation?: string;
  spacecraftClass?: {
    uid: string;
    name: string;
  };
}
