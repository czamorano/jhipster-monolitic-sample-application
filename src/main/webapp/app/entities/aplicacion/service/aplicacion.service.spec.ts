import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IAplicacion } from '../aplicacion.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../aplicacion.test-samples';

import { AplicacionService } from './aplicacion.service';

const requireRestSample: IAplicacion = {
  ...sampleWithRequiredData,
};

describe('Aplicacion Service', () => {
  let service: AplicacionService;
  let httpMock: HttpTestingController;
  let expectedResult: IAplicacion | IAplicacion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AplicacionService);
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

    it('should create a Aplicacion', () => {
      const aplicacion = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(aplicacion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Aplicacion', () => {
      const aplicacion = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(aplicacion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Aplicacion', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Aplicacion', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Aplicacion', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAplicacionToCollectionIfMissing', () => {
      it('should add a Aplicacion to an empty array', () => {
        const aplicacion: IAplicacion = sampleWithRequiredData;
        expectedResult = service.addAplicacionToCollectionIfMissing([], aplicacion);
        expect(expectedResult).toEqual([aplicacion]);
      });

      it('should not add a Aplicacion to an array that contains it', () => {
        const aplicacion: IAplicacion = sampleWithRequiredData;
        const aplicacionCollection: IAplicacion[] = [
          {
            ...aplicacion,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAplicacionToCollectionIfMissing(aplicacionCollection, aplicacion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Aplicacion to an array that doesn't contain it", () => {
        const aplicacion: IAplicacion = sampleWithRequiredData;
        const aplicacionCollection: IAplicacion[] = [sampleWithPartialData];
        expectedResult = service.addAplicacionToCollectionIfMissing(aplicacionCollection, aplicacion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(aplicacion);
      });

      it('should add only unique Aplicacion to an array', () => {
        const aplicacionArray: IAplicacion[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const aplicacionCollection: IAplicacion[] = [sampleWithRequiredData];
        expectedResult = service.addAplicacionToCollectionIfMissing(aplicacionCollection, ...aplicacionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const aplicacion: IAplicacion = sampleWithRequiredData;
        const aplicacion2: IAplicacion = sampleWithPartialData;
        expectedResult = service.addAplicacionToCollectionIfMissing([], aplicacion, aplicacion2);
        expect(expectedResult).toEqual([aplicacion, aplicacion2]);
      });

      it('should accept null and undefined values', () => {
        const aplicacion: IAplicacion = sampleWithRequiredData;
        expectedResult = service.addAplicacionToCollectionIfMissing([], null, aplicacion, undefined);
        expect(expectedResult).toEqual([aplicacion]);
      });

      it('should return initial array if no Aplicacion is added', () => {
        const aplicacionCollection: IAplicacion[] = [sampleWithRequiredData];
        expectedResult = service.addAplicacionToCollectionIfMissing(aplicacionCollection, undefined, null);
        expect(expectedResult).toEqual(aplicacionCollection);
      });
    });

    describe('compareAplicacion', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAplicacion(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 7402 };
        const entity2 = null;

        const compareResult1 = service.compareAplicacion(entity1, entity2);
        const compareResult2 = service.compareAplicacion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 7402 };
        const entity2 = { id: 30796 };

        const compareResult1 = service.compareAplicacion(entity1, entity2);
        const compareResult2 = service.compareAplicacion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 7402 };
        const entity2 = { id: 7402 };

        const compareResult1 = service.compareAplicacion(entity1, entity2);
        const compareResult2 = service.compareAplicacion(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
