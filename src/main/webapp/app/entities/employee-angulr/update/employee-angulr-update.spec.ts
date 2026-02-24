import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IDepartmentAngulr } from 'app/entities/department-angulr/department-angulr.model';
import { DepartmentAngulrService } from 'app/entities/department-angulr/service/department-angulr.service';
import { IEmployeeAngulr } from '../employee-angulr.model';
import { EmployeeAngulrService } from '../service/employee-angulr.service';

import { EmployeeAngulrFormService } from './employee-angulr-form.service';
import { EmployeeAngulrUpdate } from './employee-angulr-update';

describe('EmployeeAngulr Management Update Component', () => {
  let comp: EmployeeAngulrUpdate;
  let fixture: ComponentFixture<EmployeeAngulrUpdate>;
  let activatedRoute: ActivatedRoute;
  let employeeFormService: EmployeeAngulrFormService;
  let employeeService: EmployeeAngulrService;
  let departmentService: DepartmentAngulrService;

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

    fixture = TestBed.createComponent(EmployeeAngulrUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    employeeFormService = TestBed.inject(EmployeeAngulrFormService);
    employeeService = TestBed.inject(EmployeeAngulrService);
    departmentService = TestBed.inject(DepartmentAngulrService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call EmployeeAngulr query and add missing value', () => {
      const employee: IEmployeeAngulr = { id: 1545 };
      const manager: IEmployeeAngulr = { id: 1749 };
      employee.manager = manager;

      const employeeCollection: IEmployeeAngulr[] = [{ id: 1749 }];
      vitest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployeeAngulrs = [manager];
      const expectedCollection: IEmployeeAngulr[] = [...additionalEmployeeAngulrs, ...employeeCollection];
      vitest.spyOn(employeeService, 'addEmployeeAngulrToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeAngulrToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployeeAngulrs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.employeesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call DepartmentAngulr query and add missing value', () => {
      const employee: IEmployeeAngulr = { id: 1545 };
      const department: IDepartmentAngulr = { id: 29518 };
      employee.department = department;

      const departmentCollection: IDepartmentAngulr[] = [{ id: 29518 }];
      vitest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const additionalDepartmentAngulrs = [department];
      const expectedCollection: IDepartmentAngulr[] = [...additionalDepartmentAngulrs, ...departmentCollection];
      vitest.spyOn(departmentService, 'addDepartmentAngulrToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentAngulrToCollectionIfMissing).toHaveBeenCalledWith(
        departmentCollection,
        ...additionalDepartmentAngulrs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.departmentsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const employee: IEmployeeAngulr = { id: 1545 };
      const manager: IEmployeeAngulr = { id: 1749 };
      employee.manager = manager;
      const department: IDepartmentAngulr = { id: 29518 };
      employee.department = department;

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(comp.employeesSharedCollection()).toContainEqual(manager);
      expect(comp.departmentsSharedCollection()).toContainEqual(department);
      expect(comp.employee).toEqual(employee);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployeeAngulr>>();
      const employee = { id: 1749 };
      vitest.spyOn(employeeFormService, 'getEmployeeAngulr').mockReturnValue(employee);
      vitest.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employee }));
      saveSubject.complete();

      // THEN
      expect(employeeFormService.getEmployeeAngulr).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(employeeService.update).toHaveBeenCalledWith(expect.objectContaining(employee));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployeeAngulr>>();
      const employee = { id: 1749 };
      vitest.spyOn(employeeFormService, 'getEmployeeAngulr').mockReturnValue({ id: null });
      vitest.spyOn(employeeService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employee }));
      saveSubject.complete();

      // THEN
      expect(employeeFormService.getEmployeeAngulr).toHaveBeenCalled();
      expect(employeeService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployeeAngulr>>();
      const employee = { id: 1749 };
      vitest.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(employeeService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEmployeeAngulr', () => {
      it('should forward to employeeService', () => {
        const entity = { id: 1749 };
        const entity2 = { id: 1545 };
        vitest.spyOn(employeeService, 'compareEmployeeAngulr');
        comp.compareEmployeeAngulr(entity, entity2);
        expect(employeeService.compareEmployeeAngulr).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDepartmentAngulr', () => {
      it('should forward to departmentService', () => {
        const entity = { id: 29518 };
        const entity2 = { id: 15970 };
        vitest.spyOn(departmentService, 'compareDepartmentAngulr');
        comp.compareDepartmentAngulr(entity, entity2);
        expect(departmentService.compareDepartmentAngulr).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
