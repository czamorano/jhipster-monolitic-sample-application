import { ITaskAngulr, NewTaskAngulr } from './task-angulr.model';

export const sampleWithRequiredData: ITaskAngulr = {
  id: 9181,
};

export const sampleWithPartialData: ITaskAngulr = {
  id: 24321,
  title: 'ride whenever',
};

export const sampleWithFullData: ITaskAngulr = {
  id: 13396,
  title: 'where wherever',
  description: 'but than',
};

export const sampleWithNewData: NewTaskAngulr = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
