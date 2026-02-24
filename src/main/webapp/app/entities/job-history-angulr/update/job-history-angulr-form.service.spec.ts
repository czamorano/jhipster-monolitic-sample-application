import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../job-history-angulr.test-samples';

import { JobHistoryAngulrFormService } from './job-history-angulr-form.service';

describe('JobHistoryAngulr Form Service', () => {
  let service: JobHistoryAngulrFormService;

  beforeEach(() => {
    service = TestBed.inject(JobHistoryAngulrFormService);
  });

  describe('Service methods', () => {
    describe('createJobHistoryAngulrFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJobHistoryAngulrFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            language: expect.any(Object),
            job: expect.any(Object),
            department: expect.any(Object),
            employee: expect.any(Object),
          }),
        );
      });

      it('passing IJobHistoryAngulr should create a new form with FormGroup', () => {
        const formGroup = service.createJobHistoryAngulrFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            language: expect.any(Object),
            job: expect.any(Object),
            department: expect.any(Object),
            employee: expect.any(Object),
          }),
        );
      });
    });

    describe('getJobHistoryAngulr', () => {
      it('should return NewJobHistoryAngulr for default JobHistoryAngulr initial value', () => {
        const formGroup = service.createJobHistoryAngulrFormGroup(sampleWithNewData);

        const jobHistory = service.getJobHistoryAngulr(formGroup);

        expect(jobHistory).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobHistoryAngulr for empty JobHistoryAngulr initial value', () => {
        const formGroup = service.createJobHistoryAngulrFormGroup();

        const jobHistory = service.getJobHistoryAngulr(formGroup);

        expect(jobHistory).toMatchObject({});
      });

      it('should return IJobHistoryAngulr', () => {
        const formGroup = service.createJobHistoryAngulrFormGroup(sampleWithRequiredData);

        const jobHistory = service.getJobHistoryAngulr(formGroup);

        expect(jobHistory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJobHistoryAngulr should not enable id FormControl', () => {
        const formGroup = service.createJobHistoryAngulrFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJobHistoryAngulr should disable id FormControl', () => {
        const formGroup = service.createJobHistoryAngulrFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
