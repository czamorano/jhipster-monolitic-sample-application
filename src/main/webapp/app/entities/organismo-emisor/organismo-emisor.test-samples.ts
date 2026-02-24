import { IOrganismoEmisor, NewOrganismoEmisor } from './organismo-emisor.model';

export const sampleWithRequiredData: IOrganismoEmisor = {
  id: 18358,
  nombre: 'igloo nicely',
  codigo: 'promise',
};

export const sampleWithPartialData: IOrganismoEmisor = {
  id: 5169,
  nombre: 'impish whirlwind meh',
  codigo: 'out adventurously frank',
};

export const sampleWithFullData: IOrganismoEmisor = {
  id: 27905,
  nombre: 'pfft lest hydrolyse',
  codigo: 'vice',
};

export const sampleWithNewData: NewOrganismoEmisor = {
  nombre: 'meh chairperson',
  codigo: 'celebrate yum',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
