import { IJobAngulr } from 'app/entities/job-angulr/job-angulr.model';

export interface ITaskAngulr {
  id: number;
  title?: string | null;
  description?: string | null;
  jobs?: IJobAngulr[] | null;
}

export type NewTaskAngulr = Omit<ITaskAngulr, 'id'> & { id: null };
