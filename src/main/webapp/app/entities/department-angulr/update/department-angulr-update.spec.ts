import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { ILocationAngulr } from 'app/entities/location-angulr/location-angulr.model';
import { LocationAngulrService } from 'app/entities/location-angulr/service/location-angulr.service';
import { IDepartmentAngulr } from '../department-angulr.model';
import { DepartmentAngulrService } from '../service/department-angulr.service';

import { DepartmentAngulrFormService } from './department-angulr-form.service';
import { DepartmentAngulrUpdate } from './department-angulr-update';

describe('DepartmentAngulr Management Update Component', () => {
  let comp: DepartmentAngulrUpdate;
  let fixture: ComponentFixture<DepartmentAngulrUpdate>;
  let activatedRoute: ActivatedRoute;
  let departmentFormService: DepartmentAngulrFormService;
  let departmentService: DepartmentAngulrService;
  let locationService: LocationAngulrService;

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

    fixture = TestBed.createComponent(DepartmentAngulrUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    departmentFormService = TestBed.inject(DepartmentAngulrFormService);
    departmentService = TestBed.inject(DepartmentAngulrService);
    locationService = TestBed.inject(LocationAngulrService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call location query and add missing value', () => {
      const department: IDepartmentAngulr = { id: 15970 };
      const location: ILocationAngulr = { id: 8454 };
      department.location = location;

      const locationCollection: ILocationAngulr[] = [{ id: 8454 }];
      vitest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const expectedCollection: ILocationAngulr[] = [location, ...locationCollection];
      vitest.spyOn(locationService, 'addLocationAngulrToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ department });
      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationAngulrToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
      expect(comp.locationsCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const department: IDepartmentAngulr = { id: 15970 };
      const location: ILocationAngulr = { id: 8454 };
      department.location = location;

      activatedRoute.data = of({ department });
      comp.ngOnInit();

      expect(comp.locationsCollection()).toContainEqual(location);
      expect(comp.department).toEqual(department);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartmentAngulr>>();
      const department = { id: 29518 };
      vitest.spyOn(departmentFormService, 'getDepartmentAngulr').mockReturnValue(department);
      vitest.spyOn(departmentService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: department }));
      saveSubject.complete();

      // THEN
      expect(departmentFormService.getDepartmentAngulr).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(departmentService.update).toHaveBeenCalledWith(expect.objectContaining(department));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartmentAngulr>>();
      const department = { id: 29518 };
      vitest.spyOn(departmentFormService, 'getDepartmentAngulr').mockReturnValue({ id: null });
      vitest.spyOn(departmentService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: department }));
      saveSubject.complete();

      // THEN
      expect(departmentFormService.getDepartmentAngulr).toHaveBeenCalled();
      expect(departmentService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartmentAngulr>>();
      const department = { id: 29518 };
      vitest.spyOn(departmentService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(departmentService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLocationAngulr', () => {
      it('should forward to locationService', () => {
        const entity = { id: 8454 };
        const entity2 = { id: 13013 };
        vitest.spyOn(locationService, 'compareLocationAngulr');
        comp.compareLocationAngulr(entity, entity2);
        expect(locationService.compareLocationAngulr).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
