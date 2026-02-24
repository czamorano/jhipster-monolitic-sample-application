import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IJobHistoryAngulr } from '../job-history-angulr.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../job-history-angulr.test-samples';

import { JobHistoryAngulrService, RestJobHistoryAngulr } from './job-history-angulr.service';

const requireRestSample: RestJobHistoryAngulr = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  endDate: sampleWithRequiredData.endDate?.toJSON(),
};

describe('JobHistoryAngulr Service', () => {
  let service: JobHistoryAngulrService;
  let httpMock: HttpTestingController;
  let expectedResult: IJobHistoryAngulr | IJobHistoryAngulr[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(JobHistoryAngulrService);
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

    it('should create a JobHistoryAngulr', () => {
      const jobHistory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jobHistory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JobHistoryAngulr', () => {
      const jobHistory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jobHistory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JobHistoryAngulr', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JobHistoryAngulr', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JobHistoryAngulr', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJobHistoryAngulrToCollectionIfMissing', () => {
      it('should add a JobHistoryAngulr to an empty array', () => {
        const jobHistory: IJobHistoryAngulr = sampleWithRequiredData;
        expectedResult = service.addJobHistoryAngulrToCollectionIfMissing([], jobHistory);
        expect(expectedResult).toEqual([jobHistory]);
      });

      it('should not add a JobHistoryAngulr to an array that contains it', () => {
        const jobHistory: IJobHistoryAngulr = sampleWithRequiredData;
        const jobHistoryCollection: IJobHistoryAngulr[] = [
          {
            ...jobHistory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJobHistoryAngulrToCollectionIfMissing(jobHistoryCollection, jobHistory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JobHistoryAngulr to an array that doesn't contain it", () => {
        const jobHistory: IJobHistoryAngulr = sampleWithRequiredData;
        const jobHistoryCollection: IJobHistoryAngulr[] = [sampleWithPartialData];
        expectedResult = service.addJobHistoryAngulrToCollectionIfMissing(jobHistoryCollection, jobHistory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobHistory);
      });

      it('should add only unique JobHistoryAngulr to an array', () => {
        const jobHistoryArray: IJobHistoryAngulr[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jobHistoryCollection: IJobHistoryAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addJobHistoryAngulrToCollectionIfMissing(jobHistoryCollection, ...jobHistoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jobHistory: IJobHistoryAngulr = sampleWithRequiredData;
        const jobHistory2: IJobHistoryAngulr = sampleWithPartialData;
        expectedResult = service.addJobHistoryAngulrToCollectionIfMissing([], jobHistory, jobHistory2);
        expect(expectedResult).toEqual([jobHistory, jobHistory2]);
      });

      it('should accept null and undefined values', () => {
        const jobHistory: IJobHistoryAngulr = sampleWithRequiredData;
        expectedResult = service.addJobHistoryAngulrToCollectionIfMissing([], null, jobHistory, undefined);
        expect(expectedResult).toEqual([jobHistory]);
      });

      it('should return initial array if no JobHistoryAngulr is added', () => {
        const jobHistoryCollection: IJobHistoryAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addJobHistoryAngulrToCollectionIfMissing(jobHistoryCollection, undefined, null);
        expect(expectedResult).toEqual(jobHistoryCollection);
      });
    });

    describe('compareJobHistoryAngulr', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJobHistoryAngulr(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 18667 };
        const entity2 = null;

        const compareResult1 = service.compareJobHistoryAngulr(entity1, entity2);
        const compareResult2 = service.compareJobHistoryAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 18667 };
        const entity2 = { id: 27293 };

        const compareResult1 = service.compareJobHistoryAngulr(entity1, entity2);
        const compareResult2 = service.compareJobHistoryAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 18667 };
        const entity2 = { id: 18667 };

        const compareResult1 = service.compareJobHistoryAngulr(entity1, entity2);
        const compareResult2 = service.compareJobHistoryAngulr(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
