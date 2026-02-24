import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../job-angulr.test-samples';

import { JobAngulrFormService } from './job-angulr-form.service';

describe('JobAngulr Form Service', () => {
  let service: JobAngulrFormService;

  beforeEach(() => {
    service = TestBed.inject(JobAngulrFormService);
  });

  describe('Service methods', () => {
    describe('createJobAngulrFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJobAngulrFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            jobTitle: expect.any(Object),
            minSalary: expect.any(Object),
            maxSalary: expect.any(Object),
            tasks: expect.any(Object),
            employee: expect.any(Object),
          }),
        );
      });

      it('passing IJobAngulr should create a new form with FormGroup', () => {
        const formGroup = service.createJobAngulrFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            jobTitle: expect.any(Object),
            minSalary: expect.any(Object),
            maxSalary: expect.any(Object),
            tasks: expect.any(Object),
            employee: expect.any(Object),
          }),
        );
      });
    });

    describe('getJobAngulr', () => {
      it('should return NewJobAngulr for default JobAngulr initial value', () => {
        const formGroup = service.createJobAngulrFormGroup(sampleWithNewData);

        const job = service.getJobAngulr(formGroup);

        expect(job).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobAngulr for empty JobAngulr initial value', () => {
        const formGroup = service.createJobAngulrFormGroup();

        const job = service.getJobAngulr(formGroup);

        expect(job).toMatchObject({});
      });

      it('should return IJobAngulr', () => {
        const formGroup = service.createJobAngulrFormGroup(sampleWithRequiredData);

        const job = service.getJobAngulr(formGroup);

        expect(job).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJobAngulr should not enable id FormControl', () => {
        const formGroup = service.createJobAngulrFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJobAngulr should disable id FormControl', () => {
        const formGroup = service.createJobAngulrFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
