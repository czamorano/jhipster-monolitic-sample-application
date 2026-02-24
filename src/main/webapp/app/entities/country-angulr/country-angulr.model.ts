import { IRegionAngulr } from 'app/entities/region-angulr/region-angulr.model';

export interface ICountryAngulr {
  id: number;
  countryName?: string | null;
  region?: IRegionAngulr | null;
}

export type NewCountryAngulr = Omit<ICountryAngulr, 'id'> & { id: null };
