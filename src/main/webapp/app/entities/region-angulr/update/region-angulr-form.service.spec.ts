import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../region-angulr.test-samples';

import { RegionAngulrFormService } from './region-angulr-form.service';

describe('RegionAngulr Form Service', () => {
  let service: RegionAngulrFormService;

  beforeEach(() => {
    service = TestBed.inject(RegionAngulrFormService);
  });

  describe('Service methods', () => {
    describe('createRegionAngulrFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRegionAngulrFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            regionName: expect.any(Object),
          }),
        );
      });

      it('passing IRegionAngulr should create a new form with FormGroup', () => {
        const formGroup = service.createRegionAngulrFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            regionName: expect.any(Object),
          }),
        );
      });
    });

    describe('getRegionAngulr', () => {
      it('should return NewRegionAngulr for default RegionAngulr initial value', () => {
        const formGroup = service.createRegionAngulrFormGroup(sampleWithNewData);

        const region = service.getRegionAngulr(formGroup);

        expect(region).toMatchObject(sampleWithNewData);
      });

      it('should return NewRegionAngulr for empty RegionAngulr initial value', () => {
        const formGroup = service.createRegionAngulrFormGroup();

        const region = service.getRegionAngulr(formGroup);

        expect(region).toMatchObject({});
      });

      it('should return IRegionAngulr', () => {
        const formGroup = service.createRegionAngulrFormGroup(sampleWithRequiredData);

        const region = service.getRegionAngulr(formGroup);

        expect(region).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRegionAngulr should not enable id FormControl', () => {
        const formGroup = service.createRegionAngulrFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRegionAngulr should disable id FormControl', () => {
        const formGroup = service.createRegionAngulrFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
