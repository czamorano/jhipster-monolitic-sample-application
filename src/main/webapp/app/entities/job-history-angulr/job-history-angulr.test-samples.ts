import dayjs from 'dayjs/esm';

import { IJobHistoryAngulr, NewJobHistoryAngulr } from './job-history-angulr.model';

export const sampleWithRequiredData: IJobHistoryAngulr = {
  id: 16459,
};

export const sampleWithPartialData: IJobHistoryAngulr = {
  id: 31185,
  language: 'SPANISH',
};

export const sampleWithFullData: IJobHistoryAngulr = {
  id: 26932,
  startDate: dayjs('2026-02-24T11:42'),
  endDate: dayjs('2026-02-24T16:11'),
  language: 'ENGLISH',
};

export const sampleWithNewData: NewJobHistoryAngulr = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
