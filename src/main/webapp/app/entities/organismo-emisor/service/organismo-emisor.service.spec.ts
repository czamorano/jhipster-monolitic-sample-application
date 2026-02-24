import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IOrganismoEmisor } from '../organismo-emisor.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../organismo-emisor.test-samples';

import { OrganismoEmisorService } from './organismo-emisor.service';

const requireRestSample: IOrganismoEmisor = {
  ...sampleWithRequiredData,
};

describe('OrganismoEmisor Service', () => {
  let service: OrganismoEmisorService;
  let httpMock: HttpTestingController;
  let expectedResult: IOrganismoEmisor | IOrganismoEmisor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(OrganismoEmisorService);
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

    it('should create a OrganismoEmisor', () => {
      const organismoEmisor = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(organismoEmisor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrganismoEmisor', () => {
      const organismoEmisor = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(organismoEmisor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OrganismoEmisor', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OrganismoEmisor', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OrganismoEmisor', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOrganismoEmisorToCollectionIfMissing', () => {
      it('should add a OrganismoEmisor to an empty array', () => {
        const organismoEmisor: IOrganismoEmisor = sampleWithRequiredData;
        expectedResult = service.addOrganismoEmisorToCollectionIfMissing([], organismoEmisor);
        expect(expectedResult).toEqual([organismoEmisor]);
      });

      it('should not add a OrganismoEmisor to an array that contains it', () => {
        const organismoEmisor: IOrganismoEmisor = sampleWithRequiredData;
        const organismoEmisorCollection: IOrganismoEmisor[] = [
          {
            ...organismoEmisor,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOrganismoEmisorToCollectionIfMissing(organismoEmisorCollection, organismoEmisor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrganismoEmisor to an array that doesn't contain it", () => {
        const organismoEmisor: IOrganismoEmisor = sampleWithRequiredData;
        const organismoEmisorCollection: IOrganismoEmisor[] = [sampleWithPartialData];
        expectedResult = service.addOrganismoEmisorToCollectionIfMissing(organismoEmisorCollection, organismoEmisor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organismoEmisor);
      });

      it('should add only unique OrganismoEmisor to an array', () => {
        const organismoEmisorArray: IOrganismoEmisor[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const organismoEmisorCollection: IOrganismoEmisor[] = [sampleWithRequiredData];
        expectedResult = service.addOrganismoEmisorToCollectionIfMissing(organismoEmisorCollection, ...organismoEmisorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const organismoEmisor: IOrganismoEmisor = sampleWithRequiredData;
        const organismoEmisor2: IOrganismoEmisor = sampleWithPartialData;
        expectedResult = service.addOrganismoEmisorToCollectionIfMissing([], organismoEmisor, organismoEmisor2);
        expect(expectedResult).toEqual([organismoEmisor, organismoEmisor2]);
      });

      it('should accept null and undefined values', () => {
        const organismoEmisor: IOrganismoEmisor = sampleWithRequiredData;
        expectedResult = service.addOrganismoEmisorToCollectionIfMissing([], null, organismoEmisor, undefined);
        expect(expectedResult).toEqual([organismoEmisor]);
      });

      it('should return initial array if no OrganismoEmisor is added', () => {
        const organismoEmisorCollection: IOrganismoEmisor[] = [sampleWithRequiredData];
        expectedResult = service.addOrganismoEmisorToCollectionIfMissing(organismoEmisorCollection, undefined, null);
        expect(expectedResult).toEqual(organismoEmisorCollection);
      });
    });

    describe('compareOrganismoEmisor', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOrganismoEmisor(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 10004 };
        const entity2 = null;

        const compareResult1 = service.compareOrganismoEmisor(entity1, entity2);
        const compareResult2 = service.compareOrganismoEmisor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 10004 };
        const entity2 = { id: 27700 };

        const compareResult1 = service.compareOrganismoEmisor(entity1, entity2);
        const compareResult2 = service.compareOrganismoEmisor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 10004 };
        const entity2 = { id: 10004 };

        const compareResult1 = service.compareOrganismoEmisor(entity1, entity2);
        const compareResult2 = service.compareOrganismoEmisor(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
