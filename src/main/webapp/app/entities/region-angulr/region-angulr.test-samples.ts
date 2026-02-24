import { IRegionAngulr, NewRegionAngulr } from './region-angulr.model';

export const sampleWithRequiredData: IRegionAngulr = {
  id: 20776,
};

export const sampleWithPartialData: IRegionAngulr = {
  id: 31967,
  regionName: 'till grade',
};

export const sampleWithFullData: IRegionAngulr = {
  id: 32233,
  regionName: 'a',
};

export const sampleWithNewData: NewRegionAngulr = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
