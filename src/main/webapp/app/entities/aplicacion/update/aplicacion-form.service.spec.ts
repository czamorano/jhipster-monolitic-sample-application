import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../aplicacion.test-samples';

import { AplicacionFormService } from './aplicacion-form.service';

describe('Aplicacion Form Service', () => {
  let service: AplicacionFormService;

  beforeEach(() => {
    service = TestBed.inject(AplicacionFormService);
  });

  describe('Service methods', () => {
    describe('createAplicacionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAplicacionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
          }),
        );
      });

      it('passing IAplicacion should create a new form with FormGroup', () => {
        const formGroup = service.createAplicacionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
          }),
        );
      });
    });

    describe('getAplicacion', () => {
      it('should return NewAplicacion for default Aplicacion initial value', () => {
        const formGroup = service.createAplicacionFormGroup(sampleWithNewData);

        const aplicacion = service.getAplicacion(formGroup);

        expect(aplicacion).toMatchObject(sampleWithNewData);
      });

      it('should return NewAplicacion for empty Aplicacion initial value', () => {
        const formGroup = service.createAplicacionFormGroup();

        const aplicacion = service.getAplicacion(formGroup);

        expect(aplicacion).toMatchObject({});
      });

      it('should return IAplicacion', () => {
        const formGroup = service.createAplicacionFormGroup(sampleWithRequiredData);

        const aplicacion = service.getAplicacion(formGroup);

        expect(aplicacion).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAplicacion should not enable id FormControl', () => {
        const formGroup = service.createAplicacionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAplicacion should disable id FormControl', () => {
        const formGroup = service.createAplicacionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
