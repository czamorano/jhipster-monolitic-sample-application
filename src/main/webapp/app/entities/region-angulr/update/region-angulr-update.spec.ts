import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IRegionAngulr } from '../region-angulr.model';
import { RegionAngulrService } from '../service/region-angulr.service';

import { RegionAngulrFormService } from './region-angulr-form.service';
import { RegionAngulrUpdate } from './region-angulr-update';

describe('RegionAngulr Management Update Component', () => {
  let comp: RegionAngulrUpdate;
  let fixture: ComponentFixture<RegionAngulrUpdate>;
  let activatedRoute: ActivatedRoute;
  let regionFormService: RegionAngulrFormService;
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

    fixture = TestBed.createComponent(RegionAngulrUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    regionFormService = TestBed.inject(RegionAngulrFormService);
    regionService = TestBed.inject(RegionAngulrService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const region: IRegionAngulr = { id: 30405 };

      activatedRoute.data = of({ region });
      comp.ngOnInit();

      expect(comp.region).toEqual(region);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegionAngulr>>();
      const region = { id: 3454 };
      vitest.spyOn(regionFormService, 'getRegionAngulr').mockReturnValue(region);
      vitest.spyOn(regionService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ region });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: region }));
      saveSubject.complete();

      // THEN
      expect(regionFormService.getRegionAngulr).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(regionService.update).toHaveBeenCalledWith(expect.objectContaining(region));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegionAngulr>>();
      const region = { id: 3454 };
      vitest.spyOn(regionFormService, 'getRegionAngulr').mockReturnValue({ id: null });
      vitest.spyOn(regionService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ region: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: region }));
      saveSubject.complete();

      // THEN
      expect(regionFormService.getRegionAngulr).toHaveBeenCalled();
      expect(regionService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegionAngulr>>();
      const region = { id: 3454 };
      vitest.spyOn(regionService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ region });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(regionService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
