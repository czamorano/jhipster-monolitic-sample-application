import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../location-angulr.test-samples';

import { LocationAngulrFormService } from './location-angulr-form.service';

describe('LocationAngulr Form Service', () => {
  let service: LocationAngulrFormService;

  beforeEach(() => {
    service = TestBed.inject(LocationAngulrFormService);
  });

  describe('Service methods', () => {
    describe('createLocationAngulrFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLocationAngulrFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            streetAddress: expect.any(Object),
            postalCode: expect.any(Object),
            city: expect.any(Object),
            stateProvince: expect.any(Object),
            country: expect.any(Object),
          }),
        );
      });

      it('passing ILocationAngulr should create a new form with FormGroup', () => {
        const formGroup = service.createLocationAngulrFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            streetAddress: expect.any(Object),
            postalCode: expect.any(Object),
            city: expect.any(Object),
            stateProvince: expect.any(Object),
            country: expect.any(Object),
          }),
        );
      });
    });

    describe('getLocationAngulr', () => {
      it('should return NewLocationAngulr for default LocationAngulr initial value', () => {
        const formGroup = service.createLocationAngulrFormGroup(sampleWithNewData);

        const location = service.getLocationAngulr(formGroup);

        expect(location).toMatchObject(sampleWithNewData);
      });

      it('should return NewLocationAngulr for empty LocationAngulr initial value', () => {
        const formGroup = service.createLocationAngulrFormGroup();

        const location = service.getLocationAngulr(formGroup);

        expect(location).toMatchObject({});
      });

      it('should return ILocationAngulr', () => {
        const formGroup = service.createLocationAngulrFormGroup(sampleWithRequiredData);

        const location = service.getLocationAngulr(formGroup);

        expect(location).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILocationAngulr should not enable id FormControl', () => {
        const formGroup = service.createLocationAngulrFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLocationAngulr should disable id FormControl', () => {
        const formGroup = service.createLocationAngulrFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
