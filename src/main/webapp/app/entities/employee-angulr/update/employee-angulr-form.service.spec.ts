import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../employee-angulr.test-samples';

import { EmployeeAngulrFormService } from './employee-angulr-form.service';

describe('EmployeeAngulr Form Service', () => {
  let service: EmployeeAngulrFormService;

  beforeEach(() => {
    service = TestBed.inject(EmployeeAngulrFormService);
  });

  describe('Service methods', () => {
    describe('createEmployeeAngulrFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmployeeAngulrFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            hireDate: expect.any(Object),
            salary: expect.any(Object),
            commissionPct: expect.any(Object),
            manager: expect.any(Object),
            department: expect.any(Object),
          }),
        );
      });

      it('passing IEmployeeAngulr should create a new form with FormGroup', () => {
        const formGroup = service.createEmployeeAngulrFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            hireDate: expect.any(Object),
            salary: expect.any(Object),
            commissionPct: expect.any(Object),
            manager: expect.any(Object),
            department: expect.any(Object),
          }),
        );
      });
    });

    describe('getEmployeeAngulr', () => {
      it('should return NewEmployeeAngulr for default EmployeeAngulr initial value', () => {
        const formGroup = service.createEmployeeAngulrFormGroup(sampleWithNewData);

        const employee = service.getEmployeeAngulr(formGroup);

        expect(employee).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmployeeAngulr for empty EmployeeAngulr initial value', () => {
        const formGroup = service.createEmployeeAngulrFormGroup();

        const employee = service.getEmployeeAngulr(formGroup);

        expect(employee).toMatchObject({});
      });

      it('should return IEmployeeAngulr', () => {
        const formGroup = service.createEmployeeAngulrFormGroup(sampleWithRequiredData);

        const employee = service.getEmployeeAngulr(formGroup);

        expect(employee).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmployeeAngulr should not enable id FormControl', () => {
        const formGroup = service.createEmployeeAngulrFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmployeeAngulr should disable id FormControl', () => {
        const formGroup = service.createEmployeeAngulrFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
