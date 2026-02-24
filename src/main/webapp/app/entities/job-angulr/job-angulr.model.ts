import { IEmployeeAngulr } from 'app/entities/employee-angulr/employee-angulr.model';
import { ITaskAngulr } from 'app/entities/task-angulr/task-angulr.model';

export interface IJobAngulr {
  id: number;
  jobTitle?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  tasks?: ITaskAngulr[] | null;
  employee?: IEmployeeAngulr | null;
}

export type NewJobAngulr = Omit<IJobAngulr, 'id'> & { id: null };
