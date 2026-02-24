import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ITaskAngulr } from '../task-angulr.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../task-angulr.test-samples';

import { TaskAngulrService } from './task-angulr.service';

const requireRestSample: ITaskAngulr = {
  ...sampleWithRequiredData,
};

describe('TaskAngulr Service', () => {
  let service: TaskAngulrService;
  let httpMock: HttpTestingController;
  let expectedResult: ITaskAngulr | ITaskAngulr[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TaskAngulrService);
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

    it('should create a TaskAngulr', () => {
      const task = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(task).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TaskAngulr', () => {
      const task = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(task).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TaskAngulr', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TaskAngulr', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TaskAngulr', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTaskAngulrToCollectionIfMissing', () => {
      it('should add a TaskAngulr to an empty array', () => {
        const task: ITaskAngulr = sampleWithRequiredData;
        expectedResult = service.addTaskAngulrToCollectionIfMissing([], task);
        expect(expectedResult).toEqual([task]);
      });

      it('should not add a TaskAngulr to an array that contains it', () => {
        const task: ITaskAngulr = sampleWithRequiredData;
        const taskCollection: ITaskAngulr[] = [
          {
            ...task,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTaskAngulrToCollectionIfMissing(taskCollection, task);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TaskAngulr to an array that doesn't contain it", () => {
        const task: ITaskAngulr = sampleWithRequiredData;
        const taskCollection: ITaskAngulr[] = [sampleWithPartialData];
        expectedResult = service.addTaskAngulrToCollectionIfMissing(taskCollection, task);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(task);
      });

      it('should add only unique TaskAngulr to an array', () => {
        const taskArray: ITaskAngulr[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const taskCollection: ITaskAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addTaskAngulrToCollectionIfMissing(taskCollection, ...taskArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const task: ITaskAngulr = sampleWithRequiredData;
        const task2: ITaskAngulr = sampleWithPartialData;
        expectedResult = service.addTaskAngulrToCollectionIfMissing([], task, task2);
        expect(expectedResult).toEqual([task, task2]);
      });

      it('should accept null and undefined values', () => {
        const task: ITaskAngulr = sampleWithRequiredData;
        expectedResult = service.addTaskAngulrToCollectionIfMissing([], null, task, undefined);
        expect(expectedResult).toEqual([task]);
      });

      it('should return initial array if no TaskAngulr is added', () => {
        const taskCollection: ITaskAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addTaskAngulrToCollectionIfMissing(taskCollection, undefined, null);
        expect(expectedResult).toEqual(taskCollection);
      });
    });

    describe('compareTaskAngulr', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTaskAngulr(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 25192 };
        const entity2 = null;

        const compareResult1 = service.compareTaskAngulr(entity1, entity2);
        const compareResult2 = service.compareTaskAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 25192 };
        const entity2 = { id: 22244 };

        const compareResult1 = service.compareTaskAngulr(entity1, entity2);
        const compareResult2 = service.compareTaskAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 25192 };
        const entity2 = { id: 25192 };

        const compareResult1 = service.compareTaskAngulr(entity1, entity2);
        const compareResult2 = service.compareTaskAngulr(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
