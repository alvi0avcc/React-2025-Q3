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
