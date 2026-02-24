import dayjs from 'dayjs/esm';

import { IDepartmentAngulr } from 'app/entities/department-angulr/department-angulr.model';

export interface IEmployeeAngulr {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  hireDate?: dayjs.Dayjs | null;
  salary?: number | null;
  commissionPct?: number | null;
  manager?: IEmployeeAngulr | null;
  department?: IDepartmentAngulr | null;
}

export type NewEmployeeAngulr = Omit<IEmployeeAngulr, 'id'> & { id: null };
