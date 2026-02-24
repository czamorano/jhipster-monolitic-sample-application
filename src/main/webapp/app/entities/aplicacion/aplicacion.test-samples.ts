import { IAplicacion, NewAplicacion } from './aplicacion.model';

export const sampleWithRequiredData: IAplicacion = {
  id: 9743,
  nombre: 'of anenst',
};

export const sampleWithPartialData: IAplicacion = {
  id: 14638,
  nombre: 'gloat',
};

export const sampleWithFullData: IAplicacion = {
  id: 17596,
  nombre: 'dense',
};

export const sampleWithNewData: NewAplicacion = {
  nombre: 'apricot',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
