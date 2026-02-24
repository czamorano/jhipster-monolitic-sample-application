import { IDepartmentAngulr, NewDepartmentAngulr } from './department-angulr.model';

export const sampleWithRequiredData: IDepartmentAngulr = {
  id: 32001,
  departmentName: 'phew',
};

export const sampleWithPartialData: IDepartmentAngulr = {
  id: 18435,
  departmentName: 'sneak phew daintily',
};

export const sampleWithFullData: IDepartmentAngulr = {
  id: 13276,
  departmentName: 'endow',
};

export const sampleWithNewData: NewDepartmentAngulr = {
  departmentName: 'peaceful if',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
