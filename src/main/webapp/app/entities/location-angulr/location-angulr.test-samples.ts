import { ILocationAngulr, NewLocationAngulr } from './location-angulr.model';

export const sampleWithRequiredData: ILocationAngulr = {
  id: 12482,
};

export const sampleWithPartialData: ILocationAngulr = {
  id: 30179,
  postalCode: 'wallaby',
  city: 'Amirview',
};

export const sampleWithFullData: ILocationAngulr = {
  id: 22007,
  streetAddress: 'abseil given',
  postalCode: 'underneath emerge excluding',
  city: 'Port Peyton',
  stateProvince: 'sweet cemetery quickly',
};

export const sampleWithNewData: NewLocationAngulr = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
