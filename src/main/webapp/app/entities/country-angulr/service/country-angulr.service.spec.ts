import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ICountryAngulr } from '../country-angulr.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../country-angulr.test-samples';

import { CountryAngulrService } from './country-angulr.service';

const requireRestSample: ICountryAngulr = {
  ...sampleWithRequiredData,
};

describe('CountryAngulr Service', () => {
  let service: CountryAngulrService;
  let httpMock: HttpTestingController;
  let expectedResult: ICountryAngulr | ICountryAngulr[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CountryAngulrService);
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

    it('should create a CountryAngulr', () => {
      const country = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(country).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CountryAngulr', () => {
      const country = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(country).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CountryAngulr', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CountryAngulr', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CountryAngulr', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCountryAngulrToCollectionIfMissing', () => {
      it('should add a CountryAngulr to an empty array', () => {
        const country: ICountryAngulr = sampleWithRequiredData;
        expectedResult = service.addCountryAngulrToCollectionIfMissing([], country);
        expect(expectedResult).toEqual([country]);
      });

      it('should not add a CountryAngulr to an array that contains it', () => {
        const country: ICountryAngulr = sampleWithRequiredData;
        const countryCollection: ICountryAngulr[] = [
          {
            ...country,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCountryAngulrToCollectionIfMissing(countryCollection, country);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CountryAngulr to an array that doesn't contain it", () => {
        const country: ICountryAngulr = sampleWithRequiredData;
        const countryCollection: ICountryAngulr[] = [sampleWithPartialData];
        expectedResult = service.addCountryAngulrToCollectionIfMissing(countryCollection, country);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(country);
      });

      it('should add only unique CountryAngulr to an array', () => {
        const countryArray: ICountryAngulr[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const countryCollection: ICountryAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addCountryAngulrToCollectionIfMissing(countryCollection, ...countryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const country: ICountryAngulr = sampleWithRequiredData;
        const country2: ICountryAngulr = sampleWithPartialData;
        expectedResult = service.addCountryAngulrToCollectionIfMissing([], country, country2);
        expect(expectedResult).toEqual([country, country2]);
      });

      it('should accept null and undefined values', () => {
        const country: ICountryAngulr = sampleWithRequiredData;
        expectedResult = service.addCountryAngulrToCollectionIfMissing([], null, country, undefined);
        expect(expectedResult).toEqual([country]);
      });

      it('should return initial array if no CountryAngulr is added', () => {
        const countryCollection: ICountryAngulr[] = [sampleWithRequiredData];
        expectedResult = service.addCountryAngulrToCollectionIfMissing(countryCollection, undefined, null);
        expect(expectedResult).toEqual(countryCollection);
      });
    });

    describe('compareCountryAngulr', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCountryAngulr(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 21165 };
        const entity2 = null;

        const compareResult1 = service.compareCountryAngulr(entity1, entity2);
        const compareResult2 = service.compareCountryAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 21165 };
        const entity2 = { id: 2258 };

        const compareResult1 = service.compareCountryAngulr(entity1, entity2);
        const compareResult2 = service.compareCountryAngulr(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 21165 };
        const entity2 = { id: 21165 };

        const compareResult1 = service.compareCountryAngulr(entity1, entity2);
        const compareResult2 = service.compareCountryAngulr(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
