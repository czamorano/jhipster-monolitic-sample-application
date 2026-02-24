import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../envio-masivo.test-samples';

import { EnvioMasivoFormService } from './envio-masivo-form.service';

describe('EnvioMasivo Form Service', () => {
  let service: EnvioMasivoFormService;

  beforeEach(() => {
    service = TestBed.inject(EnvioMasivoFormService);
  });

  describe('Service methods', () => {
    describe('createEnvioMasivoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEnvioMasivoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            identificador: expect.any(Object),
            tipo: expect.any(Object),
            estado: expect.any(Object),
            comienzo: expect.any(Object),
            fin: expect.any(Object),
            aplicacion: expect.any(Object),
            organismoEmisor: expect.any(Object),
          }),
        );
      });

      it('passing IEnvioMasivo should create a new form with FormGroup', () => {
        const formGroup = service.createEnvioMasivoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            identificador: expect.any(Object),
            tipo: expect.any(Object),
            estado: expect.any(Object),
            comienzo: expect.any(Object),
            fin: expect.any(Object),
            aplicacion: expect.any(Object),
            organismoEmisor: expect.any(Object),
          }),
        );
      });
    });

    describe('getEnvioMasivo', () => {
      it('should return NewEnvioMasivo for default EnvioMasivo initial value', () => {
        const formGroup = service.createEnvioMasivoFormGroup(sampleWithNewData);

        const envioMasivo = service.getEnvioMasivo(formGroup);

        expect(envioMasivo).toMatchObject(sampleWithNewData);
      });

      it('should return NewEnvioMasivo for empty EnvioMasivo initial value', () => {
        const formGroup = service.createEnvioMasivoFormGroup();

        const envioMasivo = service.getEnvioMasivo(formGroup);

        expect(envioMasivo).toMatchObject({});
      });

      it('should return IEnvioMasivo', () => {
        const formGroup = service.createEnvioMasivoFormGroup(sampleWithRequiredData);

        const envioMasivo = service.getEnvioMasivo(formGroup);

        expect(envioMasivo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEnvioMasivo should not enable id FormControl', () => {
        const formGroup = service.createEnvioMasivoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEnvioMasivo should disable id FormControl', () => {
        const formGroup = service.createEnvioMasivoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
