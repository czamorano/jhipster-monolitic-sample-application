import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ILocationAngulr } from '../location-angulr.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../location-angulr.test-samples';

import { LocationAngulrService } from './location-angulr.service';

const requireRestSample: ILocationAngulr = {
  ...sampleWithRequiredData,
};

describe('LocationAngulr Service', () => {
  let service: LocationAngulrService;
  let httpMock: HttpTestingController;
  let expectedResult: ILocationAngulr | ILocationAngulr[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(LocationAngulrService);
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

    it('should create a LocationAngulr', () => {
      const location = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(location).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LocationAngulr', () => {
      const location = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(location).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LocationAngulr', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LocationAngulr', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LocationAngulr', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLocationAngulrToCollectionIfMissing', () => {
      it('should add a LocationAngulr to an empty array', () => {
        const location: ILocationAngulr = sampleWithRequiredData;
        expectedResult = service.addLocationAngulrToCollectionIfMissing([], location);
        expect(expectedResult).toEqual([location]);
      });

      it('should not add a LocationAngulr to an array that contains it', () => {
        const location: ILocationAngulr = sampleWithRequiredData;
        const locationCollection: ILocationAngulr[] = [
          {
            ...location,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLocationAngulrToCollectionIfMissing(locationCollection, location);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LocationAngulr to an array that doesn't contain it", () => {
        const location: ILocationAngulr = sampleWithRequiredData;
        const locationCollection: ILocationAngulr[] = [sampleWithPartialData];
        expectedResult = service.addLocationAngulrToCollectionIfMissing(locationCollection, location);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(location);
      });

      it('should add only unique LocationAngulr to an array', () => {
        const locationArray: ILocationAngulr[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const locationCollection: ILocationAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addLocationAngulrToCollectionIfMissing(locationCollection, ...locationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const location: ILocationAngulr = sampleWithRequiredData;
        const location2: ILocationAngulr = sampleWithPartialData;
        expectedResult = service.addLocationAngulrToCollectionIfMissing([], location, location2);
        expect(expectedResult).toEqual([location, location2]);
      });

      it('should accept null and undefined values', () => {
        const location: ILocationAngulr = sampleWithRequiredData;
        expectedResult = service.addLocationAngulrToCollectionIfMissing([], null, location, undefined);
        expect(expectedResult).toEqual([location]);
      });

      it('should return initial array if no LocationAngulr is added', () => {
        const locationCollection: ILocationAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addLocationAngulrToCollectionIfMissing(locationCollection, undefined, null);
        expect(expectedResult).toEqual(locationCollection);
      });
    });

    describe('compareLocationAngulr', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLocationAngulr(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 8454 };
        const entity2 = null;

        const compareResult1 = service.compareLocationAngulr(entity1, entity2);
        const compareResult2 = service.compareLocationAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 8454 };
        const entity2 = { id: 13013 };

        const compareResult1 = service.compareLocationAngulr(entity1, entity2);
        const compareResult2 = service.compareLocationAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 8454 };
        const entity2 = { id: 8454 };

        const compareResult1 = service.compareLocationAngulr(entity1, entity2);
        const compareResult2 = service.compareLocationAngulr(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
