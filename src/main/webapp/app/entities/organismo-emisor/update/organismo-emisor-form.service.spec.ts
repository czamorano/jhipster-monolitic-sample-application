import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../organismo-emisor.test-samples';

import { OrganismoEmisorFormService } from './organismo-emisor-form.service';

describe('OrganismoEmisor Form Service', () => {
  let service: OrganismoEmisorFormService;

  beforeEach(() => {
    service = TestBed.inject(OrganismoEmisorFormService);
  });

  describe('Service methods', () => {
    describe('createOrganismoEmisorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrganismoEmisorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            codigo: expect.any(Object),
          }),
        );
      });

      it('passing IOrganismoEmisor should create a new form with FormGroup', () => {
        const formGroup = service.createOrganismoEmisorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            codigo: expect.any(Object),
          }),
        );
      });
    });

    describe('getOrganismoEmisor', () => {
      it('should return NewOrganismoEmisor for default OrganismoEmisor initial value', () => {
        const formGroup = service.createOrganismoEmisorFormGroup(sampleWithNewData);

        const organismoEmisor = service.getOrganismoEmisor(formGroup);

        expect(organismoEmisor).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrganismoEmisor for empty OrganismoEmisor initial value', () => {
        const formGroup = service.createOrganismoEmisorFormGroup();

        const organismoEmisor = service.getOrganismoEmisor(formGroup);

        expect(organismoEmisor).toMatchObject({});
      });

      it('should return IOrganismoEmisor', () => {
        const formGroup = service.createOrganismoEmisorFormGroup(sampleWithRequiredData);

        const organismoEmisor = service.getOrganismoEmisor(formGroup);

        expect(organismoEmisor).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOrganismoEmisor should not enable id FormControl', () => {
        const formGroup = service.createOrganismoEmisorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrganismoEmisor should disable id FormControl', () => {
        const formGroup = service.createOrganismoEmisorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
