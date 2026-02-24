import dayjs from 'dayjs/esm';

import { IEnvioMasivo, NewEnvioMasivo } from './envio-masivo.model';

export const sampleWithRequiredData: IEnvioMasivo = {
  id: 16169,
  identificador: 'tapioca while scarily',
  tipo: 'REMESA_INSS',
  estado: 'PAUSADO',
};

export const sampleWithPartialData: IEnvioMasivo = {
  id: 23957,
  identificador: 'uncork impostor structure',
  tipo: 'CARTAS_RENOVACION',
  estado: 'INICIADO',
  comienzo: dayjs('2026-02-24T16:56'),
  fin: dayjs('2026-02-23T20:24'),
};

export const sampleWithFullData: IEnvioMasivo = {
  id: 19470,
  identificador: 'hotfoot briskly',
  tipo: 'CARTAS_RENOVACION',
  estado: 'REANUDADO',
  comienzo: dayjs('2026-02-24T10:01'),
  fin: dayjs('2026-02-24T17:23'),
};

export const sampleWithNewData: NewEnvioMasivo = {
  identificador: 'fog',
  tipo: 'CARTAS_RENOVACION',
  estado: 'INICIADO',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
