import { IJobAngulr, NewJobAngulr } from './job-angulr.model';

export const sampleWithRequiredData: IJobAngulr = {
  id: 7159,
};

export const sampleWithPartialData: IJobAngulr = {
  id: 14001,
  jobTitle: 'Central Marketing Director',
  maxSalary: 5010,
};

export const sampleWithFullData: IJobAngulr = {
  id: 8575,
  jobTitle: 'Internal Metrics Assistant',
  minSalary: 27956,
  maxSalary: 12551,
};

export const sampleWithNewData: NewJobAngulr = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
