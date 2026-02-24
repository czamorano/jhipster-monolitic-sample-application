import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { ICountryAngulr } from 'app/entities/country-angulr/country-angulr.model';
import { CountryAngulrService } from 'app/entities/country-angulr/service/country-angulr.service';
import { ILocationAngulr } from '../location-angulr.model';
import { LocationAngulrService } from '../service/location-angulr.service';

import { LocationAngulrFormService } from './location-angulr-form.service';
import { LocationAngulrUpdate } from './location-angulr-update';

describe('LocationAngulr Management Update Component', () => {
  let comp: LocationAngulrUpdate;
  let fixture: ComponentFixture<LocationAngulrUpdate>;
  let activatedRoute: ActivatedRoute;
  let locationFormService: LocationAngulrFormService;
  let locationService: LocationAngulrService;
  let countryService: CountryAngulrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(LocationAngulrUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    locationFormService = TestBed.inject(LocationAngulrFormService);
    locationService = TestBed.inject(LocationAngulrService);
    countryService = TestBed.inject(CountryAngulrService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call country query and add missing value', () => {
      const location: ILocationAngulr = { id: 13013 };
      const country: ICountryAngulr = { id: 21165 };
      location.country = country;

      const countryCollection: ICountryAngulr[] = [{ id: 21165 }];
      vitest.spyOn(countryService, 'query').mockReturnValue(of(new HttpResponse({ body: countryCollection })));
      const expectedCollection: ICountryAngulr[] = [country, ...countryCollection];
      vitest.spyOn(countryService, 'addCountryAngulrToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ location });
      comp.ngOnInit();

      expect(countryService.query).toHaveBeenCalled();
      expect(countryService.addCountryAngulrToCollectionIfMissing).toHaveBeenCalledWith(countryCollection, country);
      expect(comp.countriesCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const location: ILocationAngulr = { id: 13013 };
      const country: ICountryAngulr = { id: 21165 };
      location.country = country;

      activatedRoute.data = of({ location });
      comp.ngOnInit();

      expect(comp.countriesCollection()).toContainEqual(country);
      expect(comp.location).toEqual(location);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocationAngulr>>();
      const location = { id: 8454 };
      vitest.spyOn(locationFormService, 'getLocationAngulr').mockReturnValue(location);
      vitest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      // THEN
      expect(locationFormService.getLocationAngulr).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(locationService.update).toHaveBeenCalledWith(expect.objectContaining(location));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocationAngulr>>();
      const location = { id: 8454 };
      vitest.spyOn(locationFormService, 'getLocationAngulr').mockReturnValue({ id: null });
      vitest.spyOn(locationService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: location }));
      saveSubject.complete();

      // THEN
      expect(locationFormService.getLocationAngulr).toHaveBeenCalled();
      expect(locationService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocationAngulr>>();
      const location = { id: 8454 };
      vitest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ location });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(locationService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCountryAngulr', () => {
      it('should forward to countryService', () => {
        const entity = { id: 21165 };
        const entity2 = { id: 2258 };
        vitest.spyOn(countryService, 'compareCountryAngulr');
        comp.compareCountryAngulr(entity, entity2);
        expect(countryService.compareCountryAngulr).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
