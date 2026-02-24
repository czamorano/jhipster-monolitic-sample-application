import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IJobAngulr } from '../job-angulr.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../job-angulr.test-samples';

import { JobAngulrService } from './job-angulr.service';

const requireRestSample: IJobAngulr = {
  ...sampleWithRequiredData,
};

describe('JobAngulr Service', () => {
  let service: JobAngulrService;
  let httpMock: HttpTestingController;
  let expectedResult: IJobAngulr | IJobAngulr[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(JobAngulrService);
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

    it('should create a JobAngulr', () => {
      const job = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(job).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JobAngulr', () => {
      const job = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(job).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JobAngulr', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JobAngulr', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JobAngulr', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJobAngulrToCollectionIfMissing', () => {
      it('should add a JobAngulr to an empty array', () => {
        const job: IJobAngulr = sampleWithRequiredData;
        expectedResult = service.addJobAngulrToCollectionIfMissing([], job);
        expect(expectedResult).toEqual([job]);
      });

      it('should not add a JobAngulr to an array that contains it', () => {
        const job: IJobAngulr = sampleWithRequiredData;
        const jobCollection: IJobAngulr[] = [
          {
            ...job,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJobAngulrToCollectionIfMissing(jobCollection, job);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JobAngulr to an array that doesn't contain it", () => {
        const job: IJobAngulr = sampleWithRequiredData;
        const jobCollection: IJobAngulr[] = [sampleWithPartialData];
        expectedResult = service.addJobAngulrToCollectionIfMissing(jobCollection, job);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(job);
      });

      it('should add only unique JobAngulr to an array', () => {
        const jobArray: IJobAngulr[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jobCollection: IJobAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addJobAngulrToCollectionIfMissing(jobCollection, ...jobArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const job: IJobAngulr = sampleWithRequiredData;
        const job2: IJobAngulr = sampleWithPartialData;
        expectedResult = service.addJobAngulrToCollectionIfMissing([], job, job2);
        expect(expectedResult).toEqual([job, job2]);
      });

      it('should accept null and undefined values', () => {
        const job: IJobAngulr = sampleWithRequiredData;
        expectedResult = service.addJobAngulrToCollectionIfMissing([], null, job, undefined);
        expect(expectedResult).toEqual([job]);
      });

      it('should return initial array if no JobAngulr is added', () => {
        const jobCollection: IJobAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addJobAngulrToCollectionIfMissing(jobCollection, undefined, null);
        expect(expectedResult).toEqual(jobCollection);
      });
    });

    describe('compareJobAngulr', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJobAngulr(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 30796 };
        const entity2 = null;

        const compareResult1 = service.compareJobAngulr(entity1, entity2);
        const compareResult2 = service.compareJobAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 30796 };
        const entity2 = { id: 29383 };

        const compareResult1 = service.compareJobAngulr(entity1, entity2);
        const compareResult2 = service.compareJobAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 30796 };
        const entity2 = { id: 30796 };

        const compareResult1 = service.compareJobAngulr(entity1, entity2);
        const compareResult2 = service.compareJobAngulr(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
