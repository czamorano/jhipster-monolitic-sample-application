export interface IRegionAngulr {
  id: number;
  regionName?: string | null;
}

export type NewRegionAngulr = Omit<IRegionAngulr, 'id'> & { id: null };
