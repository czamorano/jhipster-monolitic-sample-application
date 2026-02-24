import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IEmployeeAngulr } from '../employee-angulr.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../employee-angulr.test-samples';

import { EmployeeAngulrService, RestEmployeeAngulr } from './employee-angulr.service';

const requireRestSample: RestEmployeeAngulr = {
  ...sampleWithRequiredData,
  hireDate: sampleWithRequiredData.hireDate?.toJSON(),
};

describe('EmployeeAngulr Service', () => {
  let service: EmployeeAngulrService;
  let httpMock: HttpTestingController;
  let expectedResult: IEmployeeAngulr | IEmployeeAngulr[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EmployeeAngulrService);
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

    it('should create a EmployeeAngulr', () => {
      const employee = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(employee).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EmployeeAngulr', () => {
      const employee = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(employee).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EmployeeAngulr', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EmployeeAngulr', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EmployeeAngulr', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEmployeeAngulrToCollectionIfMissing', () => {
      it('should add a EmployeeAngulr to an empty array', () => {
        const employee: IEmployeeAngulr = sampleWithRequiredData;
        expectedResult = service.addEmployeeAngulrToCollectionIfMissing([], employee);
        expect(expectedResult).toEqual([employee]);
      });

      it('should not add a EmployeeAngulr to an array that contains it', () => {
        const employee: IEmployeeAngulr = sampleWithRequiredData;
        const employeeCollection: IEmployeeAngulr[] = [
          {
            ...employee,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEmployeeAngulrToCollectionIfMissing(employeeCollection, employee);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EmployeeAngulr to an array that doesn't contain it", () => {
        const employee: IEmployeeAngulr = sampleWithRequiredData;
        const employeeCollection: IEmployeeAngulr[] = [sampleWithPartialData];
        expectedResult = service.addEmployeeAngulrToCollectionIfMissing(employeeCollection, employee);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(employee);
      });

      it('should add only unique EmployeeAngulr to an array', () => {
        const employeeArray: IEmployeeAngulr[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const employeeCollection: IEmployeeAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addEmployeeAngulrToCollectionIfMissing(employeeCollection, ...employeeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const employee: IEmployeeAngulr = sampleWithRequiredData;
        const employee2: IEmployeeAngulr = sampleWithPartialData;
        expectedResult = service.addEmployeeAngulrToCollectionIfMissing([], employee, employee2);
        expect(expectedResult).toEqual([employee, employee2]);
      });

      it('should accept null and undefined values', () => {
        const employee: IEmployeeAngulr = sampleWithRequiredData;
        expectedResult = service.addEmployeeAngulrToCollectionIfMissing([], null, employee, undefined);
        expect(expectedResult).toEqual([employee]);
      });

      it('should return initial array if no EmployeeAngulr is added', () => {
        const employeeCollection: IEmployeeAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addEmployeeAngulrToCollectionIfMissing(employeeCollection, undefined, null);
        expect(expectedResult).toEqual(employeeCollection);
      });
    });

    describe('compareEmployeeAngulr', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEmployeeAngulr(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 1749 };
        const entity2 = null;

        const compareResult1 = service.compareEmployeeAngulr(entity1, entity2);
        const compareResult2 = service.compareEmployeeAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 1749 };
        const entity2 = { id: 1545 };

        const compareResult1 = service.compareEmployeeAngulr(entity1, entity2);
        const compareResult2 = service.compareEmployeeAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 1749 };
        const entity2 = { id: 1749 };

        const compareResult1 = service.compareEmployeeAngulr(entity1, entity2);
        const compareResult2 = service.compareEmployeeAngulr(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
