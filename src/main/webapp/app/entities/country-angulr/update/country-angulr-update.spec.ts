import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IRegionAngulr } from 'app/entities/region-angulr/region-angulr.model';
import { RegionAngulrService } from 'app/entities/region-angulr/service/region-angulr.service';
import { ICountryAngulr } from '../country-angulr.model';
import { CountryAngulrService } from '../service/country-angulr.service';

import { CountryAngulrFormService } from './country-angulr-form.service';
import { CountryAngulrUpdate } from './country-angulr-update';

describe('CountryAngulr Management Update Component', () => {
  let comp: CountryAngulrUpdate;
  let fixture: ComponentFixture<CountryAngulrUpdate>;
  let activatedRoute: ActivatedRoute;
  let countryFormService: CountryAngulrFormService;
  let countryService: CountryAngulrService;
  let regionService: RegionAngulrService;

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

    fixture = TestBed.createComponent(CountryAngulrUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    countryFormService = TestBed.inject(CountryAngulrFormService);
    countryService = TestBed.inject(CountryAngulrService);
    regionService = TestBed.inject(RegionAngulrService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call region query and add missing value', () => {
      const country: ICountryAngulr = { id: 2258 };
      const region: IRegionAngulr = { id: 3454 };
      country.region = region;

      const regionCollection: IRegionAngulr[] = [{ id: 3454 }];
      vitest.spyOn(regionService, 'query').mockReturnValue(of(new HttpResponse({ body: regionCollection })));
      const expectedCollection: IRegionAngulr[] = [region, ...regionCollection];
      vitest.spyOn(regionService, 'addRegionAngulrToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ country });
      comp.ngOnInit();

      expect(regionService.query).toHaveBeenCalled();
      expect(regionService.addRegionAngulrToCollectionIfMissing).toHaveBeenCalledWith(regionCollection, region);
      expect(comp.regionsCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const country: ICountryAngulr = { id: 2258 };
      const region: IRegionAngulr = { id: 3454 };
      country.region = region;

      activatedRoute.data = of({ country });
      comp.ngOnInit();

      expect(comp.regionsCollection()).toContainEqual(region);
      expect(comp.country).toEqual(country);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICountryAngulr>>();
      const country = { id: 21165 };
      vitest.spyOn(countryFormService, 'getCountryAngulr').mockReturnValue(country);
      vitest.spyOn(countryService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: country }));
      saveSubject.complete();

      // THEN
      expect(countryFormService.getCountryAngulr).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(countryService.update).toHaveBeenCalledWith(expect.objectContaining(country));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICountryAngulr>>();
      const country = { id: 21165 };
      vitest.spyOn(countryFormService, 'getCountryAngulr').mockReturnValue({ id: null });
      vitest.spyOn(countryService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: country }));
      saveSubject.complete();

      // THEN
      expect(countryFormService.getCountryAngulr).toHaveBeenCalled();
      expect(countryService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICountryAngulr>>();
      const country = { id: 21165 };
      vitest.spyOn(countryService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(countryService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRegionAngulr', () => {
      it('should forward to regionService', () => {
        const entity = { id: 3454 };
        const entity2 = { id: 30405 };
        vitest.spyOn(regionService, 'compareRegionAngulr');
        comp.compareRegionAngulr(entity, entity2);
        expect(regionService.compareRegionAngulr).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
