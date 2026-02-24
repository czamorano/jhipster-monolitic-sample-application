import dayjs from 'dayjs/esm';

import { IDepartmentAngulr } from 'app/entities/department-angulr/department-angulr.model';
import { IEmployeeAngulr } from 'app/entities/employee-angulr/employee-angulr.model';
import { Language } from 'app/entities/enumerations/language.model';
import { IJobAngulr } from 'app/entities/job-angulr/job-angulr.model';

export interface IJobHistoryAngulr {
  id: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  language?: keyof typeof Language | null;
  job?: IJobAngulr | null;
  department?: IDepartmentAngulr | null;
  employee?: IEmployeeAngulr | null;
}

export type NewJobHistoryAngulr = Omit<IJobHistoryAngulr, 'id'> & { id: null };
