import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../department-angulr.test-samples';

import { DepartmentAngulrFormService } from './department-angulr-form.service';

describe('DepartmentAngulr Form Service', () => {
  let service: DepartmentAngulrFormService;

  beforeEach(() => {
    service = TestBed.inject(DepartmentAngulrFormService);
  });

  describe('Service methods', () => {
    describe('createDepartmentAngulrFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDepartmentAngulrFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            departmentName: expect.any(Object),
            location: expect.any(Object),
          }),
        );
      });

      it('passing IDepartmentAngulr should create a new form with FormGroup', () => {
        const formGroup = service.createDepartmentAngulrFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            departmentName: expect.any(Object),
            location: expect.any(Object),
          }),
        );
      });
    });

    describe('getDepartmentAngulr', () => {
      it('should return NewDepartmentAngulr for default DepartmentAngulr initial value', () => {
        const formGroup = service.createDepartmentAngulrFormGroup(sampleWithNewData);

        const department = service.getDepartmentAngulr(formGroup);

        expect(department).toMatchObject(sampleWithNewData);
      });

      it('should return NewDepartmentAngulr for empty DepartmentAngulr initial value', () => {
        const formGroup = service.createDepartmentAngulrFormGroup();

        const department = service.getDepartmentAngulr(formGroup);

        expect(department).toMatchObject({});
      });

      it('should return IDepartmentAngulr', () => {
        const formGroup = service.createDepartmentAngulrFormGroup(sampleWithRequiredData);

        const department = service.getDepartmentAngulr(formGroup);

        expect(department).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDepartmentAngulr should not enable id FormControl', () => {
        const formGroup = service.createDepartmentAngulrFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDepartmentAngulr should disable id FormControl', () => {
        const formGroup = service.createDepartmentAngulrFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
