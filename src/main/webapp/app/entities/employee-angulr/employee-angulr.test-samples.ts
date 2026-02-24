import dayjs from 'dayjs/esm';

import { IEmployeeAngulr, NewEmployeeAngulr } from './employee-angulr.model';

export const sampleWithRequiredData: IEmployeeAngulr = {
  id: 8899,
};

export const sampleWithPartialData: IEmployeeAngulr = {
  id: 29906,
  firstName: 'Jade',
  lastName: 'Rogahn',
  email: 'Ayla_Ullrich@gmail.com',
  phoneNumber: 'furthermore joyous ah',
  salary: 9334,
};

export const sampleWithFullData: IEmployeeAngulr = {
  id: 19019,
  firstName: 'Osborne',
  lastName: 'Luettgen',
  email: 'Lavern.Bartoletti-Reinger@yahoo.com',
  phoneNumber: 'vein pear short',
  hireDate: dayjs('2026-02-24T10:44'),
  salary: 21951,
  commissionPct: 30084,
};

export const sampleWithNewData: NewEmployeeAngulr = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
