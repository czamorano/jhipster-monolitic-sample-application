import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IRegionAngulr } from '../region-angulr.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../region-angulr.test-samples';

import { RegionAngulrService } from './region-angulr.service';

const requireRestSample: IRegionAngulr = {
  ...sampleWithRequiredData,
};

describe('RegionAngulr Service', () => {
  let service: RegionAngulrService;
  let httpMock: HttpTestingController;
  let expectedResult: IRegionAngulr | IRegionAngulr[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(RegionAngulrService);
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

    it('should create a RegionAngulr', () => {
      const region = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(region).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RegionAngulr', () => {
      const region = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(region).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RegionAngulr', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RegionAngulr', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RegionAngulr', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRegionAngulrToCollectionIfMissing', () => {
      it('should add a RegionAngulr to an empty array', () => {
        const region: IRegionAngulr = sampleWithRequiredData;
        expectedResult = service.addRegionAngulrToCollectionIfMissing([], region);
        expect(expectedResult).toEqual([region]);
      });

      it('should not add a RegionAngulr to an array that contains it', () => {
        const region: IRegionAngulr = sampleWithRequiredData;
        const regionCollection: IRegionAngulr[] = [
          {
            ...region,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRegionAngulrToCollectionIfMissing(regionCollection, region);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RegionAngulr to an array that doesn't contain it", () => {
        const region: IRegionAngulr = sampleWithRequiredData;
        const regionCollection: IRegionAngulr[] = [sampleWithPartialData];
        expectedResult = service.addRegionAngulrToCollectionIfMissing(regionCollection, region);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(region);
      });

      it('should add only unique RegionAngulr to an array', () => {
        const regionArray: IRegionAngulr[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const regionCollection: IRegionAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addRegionAngulrToCollectionIfMissing(regionCollection, ...regionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const region: IRegionAngulr = sampleWithRequiredData;
        const region2: IRegionAngulr = sampleWithPartialData;
        expectedResult = service.addRegionAngulrToCollectionIfMissing([], region, region2);
        expect(expectedResult).toEqual([region, region2]);
      });

      it('should accept null and undefined values', () => {
        const region: IRegionAngulr = sampleWithRequiredData;
        expectedResult = service.addRegionAngulrToCollectionIfMissing([], null, region, undefined);
        expect(expectedResult).toEqual([region]);
      });

      it('should return initial array if no RegionAngulr is added', () => {
        const regionCollection: IRegionAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addRegionAngulrToCollectionIfMissing(regionCollection, undefined, null);
        expect(expectedResult).toEqual(regionCollection);
      });
    });

    describe('compareRegionAngulr', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRegionAngulr(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 3454 };
        const entity2 = null;

        const compareResult1 = service.compareRegionAngulr(entity1, entity2);
        const compareResult2 = service.compareRegionAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 3454 };
        const entity2 = { id: 30405 };

        const compareResult1 = service.compareRegionAngulr(entity1, entity2);
        const compareResult2 = service.compareRegionAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 3454 };
        const entity2 = { id: 3454 };

        const compareResult1 = service.compareRegionAngulr(entity1, entity2);
        const compareResult2 = service.compareRegionAngulr(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
