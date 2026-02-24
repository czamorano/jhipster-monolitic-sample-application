import { ICountryAngulr } from 'app/entities/country-angulr/country-angulr.model';

export interface ILocationAngulr {
  id: number;
  streetAddress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  country?: ICountryAngulr | null;
}

export type NewLocationAngulr = Omit<ILocationAngulr, 'id'> & { id: null };
