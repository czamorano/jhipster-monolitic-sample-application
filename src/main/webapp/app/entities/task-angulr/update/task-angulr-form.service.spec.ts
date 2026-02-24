import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../task-angulr.test-samples';

import { TaskAngulrFormService } from './task-angulr-form.service';

describe('TaskAngulr Form Service', () => {
  let service: TaskAngulrFormService;

  beforeEach(() => {
    service = TestBed.inject(TaskAngulrFormService);
  });

  describe('Service methods', () => {
    describe('createTaskAngulrFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTaskAngulrFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            jobs: expect.any(Object),
          }),
        );
      });

      it('passing ITaskAngulr should create a new form with FormGroup', () => {
        const formGroup = service.createTaskAngulrFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            jobs: expect.any(Object),
          }),
        );
      });
    });

    describe('getTaskAngulr', () => {
      it('should return NewTaskAngulr for default TaskAngulr initial value', () => {
        const formGroup = service.createTaskAngulrFormGroup(sampleWithNewData);

        const task = service.getTaskAngulr(formGroup);

        expect(task).toMatchObject(sampleWithNewData);
      });

      it('should return NewTaskAngulr for empty TaskAngulr initial value', () => {
        const formGroup = service.createTaskAngulrFormGroup();

        const task = service.getTaskAngulr(formGroup);

        expect(task).toMatchObject({});
      });

      it('should return ITaskAngulr', () => {
        const formGroup = service.createTaskAngulrFormGroup(sampleWithRequiredData);

        const task = service.getTaskAngulr(formGroup);

        expect(task).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITaskAngulr should not enable id FormControl', () => {
        const formGroup = service.createTaskAngulrFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTaskAngulr should disable id FormControl', () => {
        const formGroup = service.createTaskAngulrFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
