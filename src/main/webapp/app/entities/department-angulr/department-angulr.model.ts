import { ILocationAngulr } from 'app/entities/location-angulr/location-angulr.model';

export interface IDepartmentAngulr {
  id: number;
  departmentName?: string | null;
  location?: ILocationAngulr | null;
}

export type NewDepartmentAngulr = Omit<IDepartmentAngulr, 'id'> & { id: null };
