import { ICountryAngulr, NewCountryAngulr } from './country-angulr.model';

export const sampleWithRequiredData: ICountryAngulr = {
  id: 30729,
};

export const sampleWithPartialData: ICountryAngulr = {
  id: 20425,
  countryName: 'and extra-large towards',
};

export const sampleWithFullData: ICountryAngulr = {
  id: 28151,
  countryName: 'fooey fooey coil',
};

export const sampleWithNewData: NewCountryAngulr = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
