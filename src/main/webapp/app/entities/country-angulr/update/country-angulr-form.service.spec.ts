import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../country-angulr.test-samples';

import { CountryAngulrFormService } from './country-angulr-form.service';

describe('CountryAngulr Form Service', () => {
  let service: CountryAngulrFormService;

  beforeEach(() => {
    service = TestBed.inject(CountryAngulrFormService);
  });

  describe('Service methods', () => {
    describe('createCountryAngulrFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCountryAngulrFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            countryName: expect.any(Object),
            region: expect.any(Object),
          }),
        );
      });

      it('passing ICountryAngulr should create a new form with FormGroup', () => {
        const formGroup = service.createCountryAngulrFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            countryName: expect.any(Object),
            region: expect.any(Object),
          }),
        );
      });
    });

    describe('getCountryAngulr', () => {
      it('should return NewCountryAngulr for default CountryAngulr initial value', () => {
        const formGroup = service.createCountryAngulrFormGroup(sampleWithNewData);

        const country = service.getCountryAngulr(formGroup);

        expect(country).toMatchObject(sampleWithNewData);
      });

      it('should return NewCountryAngulr for empty CountryAngulr initial value', () => {
        const formGroup = service.createCountryAngulrFormGroup();

        const country = service.getCountryAngulr(formGroup);

        expect(country).toMatchObject({});
      });

      it('should return ICountryAngulr', () => {
        const formGroup = service.createCountryAngulrFormGroup(sampleWithRequiredData);

        const country = service.getCountryAngulr(formGroup);

        expect(country).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICountryAngulr should not enable id FormControl', () => {
        const formGroup = service.createCountryAngulrFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCountryAngulr should disable id FormControl', () => {
        const formGroup = service.createCountryAngulrFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
