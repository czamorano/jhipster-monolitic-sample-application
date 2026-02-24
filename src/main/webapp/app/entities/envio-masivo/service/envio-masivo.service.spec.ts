import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IEnvioMasivo } from '../envio-masivo.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../envio-masivo.test-samples';

import { EnvioMasivoService, RestEnvioMasivo } from './envio-masivo.service';

const requireRestSample: RestEnvioMasivo = {
  ...sampleWithRequiredData,
  comienzo: sampleWithRequiredData.comienzo?.toJSON(),
  fin: sampleWithRequiredData.fin?.toJSON(),
};

describe('EnvioMasivo Service', () => {
  let service: EnvioMasivoService;
  let httpMock: HttpTestingController;
  let expectedResult: IEnvioMasivo | IEnvioMasivo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EnvioMasivoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a EnvioMasivo', () => {
      const envioMasivo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(envioMasivo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EnvioMasivo', () => {
      const envioMasivo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(envioMasivo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EnvioMasivo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EnvioMasivo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EnvioMasivo', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEnvioMasivoToCollectionIfMissing', () => {
      it('should add a EnvioMasivo to an empty array', () => {
        const envioMasivo: IEnvioMasivo = sampleWithRequiredData;
        expectedResult = service.addEnvioMasivoToCollectionIfMissing([], envioMasivo);
        expect(expectedResult).toEqual([envioMasivo]);
      });

      it('should not add a EnvioMasivo to an array that contains it', () => {
        const envioMasivo: IEnvioMasivo = sampleWithRequiredData;
        const envioMasivoCollection: IEnvioMasivo[] = [
          {
            ...envioMasivo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEnvioMasivoToCollectionIfMissing(envioMasivoCollection, envioMasivo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EnvioMasivo to an array that doesn't contain it", () => {
        const envioMasivo: IEnvioMasivo = sampleWithRequiredData;
        const envioMasivoCollection: IEnvioMasivo[] = [sampleWithPartialData];
        expectedResult = service.addEnvioMasivoToCollectionIfMissing(envioMasivoCollection, envioMasivo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(envioMasivo);
      });

      it('should add only unique EnvioMasivo to an array', () => {
        const envioMasivoArray: IEnvioMasivo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const envioMasivoCollection: IEnvioMasivo[] = [sampleWithRequiredData];
        expectedResult = service.addEnvioMasivoToCollectionIfMissing(envioMasivoCollection, ...envioMasivoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const envioMasivo: IEnvioMasivo = sampleWithRequiredData;
        const envioMasivo2: IEnvioMasivo = sampleWithPartialData;
        expectedResult = service.addEnvioMasivoToCollectionIfMissing([], envioMasivo, envioMasivo2);
        expect(expectedResult).toEqual([envioMasivo, envioMasivo2]);
      });

      it('should accept null and undefined values', () => {
        const envioMasivo: IEnvioMasivo = sampleWithRequiredData;
        expectedResult = service.addEnvioMasivoToCollectionIfMissing([], null, envioMasivo, undefined);
        expect(expectedResult).toEqual([envioMasivo]);
      });

      it('should return initial array if no EnvioMasivo is added', () => {
        const envioMasivoCollection: IEnvioMasivo[] = [sampleWithRequiredData];
        expectedResult = service.addEnvioMasivoToCollectionIfMissing(envioMasivoCollection, undefined, null);
        expect(expectedResult).toEqual(envioMasivoCollection);
      });
    });

    describe('compareEnvioMasivo', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEnvioMasivo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 27737 };
        const entity2 = null;

        const compareResult1 = service.compareEnvioMasivo(entity1, entity2);
        const compareResult2 = service.compareEnvioMasivo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 27737 };
        const entity2 = { id: 7434 };

        const compareResult1 = service.compareEnvioMasivo(entity1, entity2);
        const compareResult2 = service.compareEnvioMasivo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 27737 };
        const entity2 = { id: 27737 };

        const compareResult1 = service.compareEnvioMasivo(entity1, entity2);
        const compareResult2 = service.compareEnvioMasivo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
