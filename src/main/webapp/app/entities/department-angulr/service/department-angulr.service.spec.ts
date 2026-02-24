import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IDepartmentAngulr } from '../department-angulr.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../department-angulr.test-samples';

import { DepartmentAngulrService } from './department-angulr.service';

const requireRestSample: IDepartmentAngulr = {
  ...sampleWithRequiredData,
};

describe('DepartmentAngulr Service', () => {
  let service: DepartmentAngulrService;
  let httpMock: HttpTestingController;
  let expectedResult: IDepartmentAngulr | IDepartmentAngulr[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DepartmentAngulrService);
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

    it('should create a DepartmentAngulr', () => {
      const department = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(department).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DepartmentAngulr', () => {
      const department = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(department).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DepartmentAngulr', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DepartmentAngulr', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DepartmentAngulr', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDepartmentAngulrToCollectionIfMissing', () => {
      it('should add a DepartmentAngulr to an empty array', () => {
        const department: IDepartmentAngulr = sampleWithRequiredData;
        expectedResult = service.addDepartmentAngulrToCollectionIfMissing([], department);
        expect(expectedResult).toEqual([department]);
      });

      it('should not add a DepartmentAngulr to an array that contains it', () => {
        const department: IDepartmentAngulr = sampleWithRequiredData;
        const departmentCollection: IDepartmentAngulr[] = [
          {
            ...department,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDepartmentAngulrToCollectionIfMissing(departmentCollection, department);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DepartmentAngulr to an array that doesn't contain it", () => {
        const department: IDepartmentAngulr = sampleWithRequiredData;
        const departmentCollection: IDepartmentAngulr[] = [sampleWithPartialData];
        expectedResult = service.addDepartmentAngulrToCollectionIfMissing(departmentCollection, department);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(department);
      });

      it('should add only unique DepartmentAngulr to an array', () => {
        const departmentArray: IDepartmentAngulr[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const departmentCollection: IDepartmentAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addDepartmentAngulrToCollectionIfMissing(departmentCollection, ...departmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const department: IDepartmentAngulr = sampleWithRequiredData;
        const department2: IDepartmentAngulr = sampleWithPartialData;
        expectedResult = service.addDepartmentAngulrToCollectionIfMissing([], department, department2);
        expect(expectedResult).toEqual([department, department2]);
      });

      it('should accept null and undefined values', () => {
        const department: IDepartmentAngulr = sampleWithRequiredData;
        expectedResult = service.addDepartmentAngulrToCollectionIfMissing([], null, department, undefined);
        expect(expectedResult).toEqual([department]);
      });

      it('should return initial array if no DepartmentAngulr is added', () => {
        const departmentCollection: IDepartmentAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addDepartmentAngulrToCollectionIfMissing(departmentCollection, undefined, null);
        expect(expectedResult).toEqual(departmentCollection);
      });
    });

    describe('compareDepartmentAngulr', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDepartmentAngulr(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 29518 };
        const entity2 = null;

        const compareResult1 = service.compareDepartmentAngulr(entity1, entity2);
        const compareResult2 = service.compareDepartmentAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 29518 };
        const entity2 = { id: 15970 };

        const compareResult1 = service.compareDepartmentAngulr(entity1, entity2);
        const compareResult2 = service.compareDepartmentAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 29518 };
        const entity2 = { id: 29518 };

        const compareResult1 = service.compareDepartmentAngulr(entity1, entity2);
        const compareResult2 = service.compareDepartmentAngulr(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
