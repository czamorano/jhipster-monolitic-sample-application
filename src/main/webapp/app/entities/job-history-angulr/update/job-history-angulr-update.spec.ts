import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IDepartmentAngulr } from 'app/entities/department-angulr/department-angulr.model';
import { DepartmentAngulrService } from 'app/entities/department-angulr/service/department-angulr.service';
import { IEmployeeAngulr } from 'app/entities/employee-angulr/employee-angulr.model';
import { EmployeeAngulrService } from 'app/entities/employee-angulr/service/employee-angulr.service';
import { IJobAngulr } from 'app/entities/job-angulr/job-angulr.model';
import { JobAngulrService } from 'app/entities/job-angulr/service/job-angulr.service';
import { IJobHistoryAngulr } from '../job-history-angulr.model';
import { JobHistoryAngulrService } from '../service/job-history-angulr.service';

import { JobHistoryAngulrFormService } from './job-history-angulr-form.service';
import { JobHistoryAngulrUpdate } from './job-history-angulr-update';

describe('JobHistoryAngulr Management Update Component', () => {
  let comp: JobHistoryAngulrUpdate;
  let fixture: ComponentFixture<JobHistoryAngulrUpdate>;
  let activatedRoute: ActivatedRoute;
  let jobHistoryFormService: JobHistoryAngulrFormService;
  let jobHistoryService: JobHistoryAngulrService;
  let jobService: JobAngulrService;
  let departmentService: DepartmentAngulrService;
  let employeeService: EmployeeAngulrService;

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

    fixture = TestBed.createComponent(JobHistoryAngulrUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobHistoryFormService = TestBed.inject(JobHistoryAngulrFormService);
    jobHistoryService = TestBed.inject(JobHistoryAngulrService);
    jobService = TestBed.inject(JobAngulrService);
    departmentService = TestBed.inject(DepartmentAngulrService);
    employeeService = TestBed.inject(EmployeeAngulrService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call job query and add missing value', () => {
      const jobHistory: IJobHistoryAngulr = { id: 27293 };
      const job: IJobAngulr = { id: 30796 };
      jobHistory.job = job;

      const jobCollection: IJobAngulr[] = [{ id: 30796 }];
      vitest.spyOn(jobService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCollection })));
      const expectedCollection: IJobAngulr[] = [job, ...jobCollection];
      vitest.spyOn(jobService, 'addJobAngulrToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(jobService.query).toHaveBeenCalled();
      expect(jobService.addJobAngulrToCollectionIfMissing).toHaveBeenCalledWith(jobCollection, job);
      expect(comp.jobsCollection()).toEqual(expectedCollection);
    });

    it('should call department query and add missing value', () => {
      const jobHistory: IJobHistoryAngulr = { id: 27293 };
      const department: IDepartmentAngulr = { id: 29518 };
      jobHistory.department = department;

      const departmentCollection: IDepartmentAngulr[] = [{ id: 29518 }];
      vitest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const expectedCollection: IDepartmentAngulr[] = [department, ...departmentCollection];
      vitest.spyOn(departmentService, 'addDepartmentAngulrToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentAngulrToCollectionIfMissing).toHaveBeenCalledWith(departmentCollection, department);
      expect(comp.departmentsCollection()).toEqual(expectedCollection);
    });

    it('should call employee query and add missing value', () => {
      const jobHistory: IJobHistoryAngulr = { id: 27293 };
      const employee: IEmployeeAngulr = { id: 1749 };
      jobHistory.employee = employee;

      const employeeCollection: IEmployeeAngulr[] = [{ id: 1749 }];
      vitest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const expectedCollection: IEmployeeAngulr[] = [employee, ...employeeCollection];
      vitest.spyOn(employeeService, 'addEmployeeAngulrToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeAngulrToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, employee);
      expect(comp.employeesCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const jobHistory: IJobHistoryAngulr = { id: 27293 };
      const job: IJobAngulr = { id: 30796 };
      jobHistory.job = job;
      const department: IDepartmentAngulr = { id: 29518 };
      jobHistory.department = department;
      const employee: IEmployeeAngulr = { id: 1749 };
      jobHistory.employee = employee;

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(comp.jobsCollection()).toContainEqual(job);
      expect(comp.departmentsCollection()).toContainEqual(department);
      expect(comp.employeesCollection()).toContainEqual(employee);
      expect(comp.jobHistory).toEqual(jobHistory);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobHistoryAngulr>>();
      const jobHistory = { id: 18667 };
      vitest.spyOn(jobHistoryFormService, 'getJobHistoryAngulr').mockReturnValue(jobHistory);
      vitest.spyOn(jobHistoryService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobHistory }));
      saveSubject.complete();

      // THEN
      expect(jobHistoryFormService.getJobHistoryAngulr).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobHistoryService.update).toHaveBeenCalledWith(expect.objectContaining(jobHistory));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobHistoryAngulr>>();
      const jobHistory = { id: 18667 };
      vitest.spyOn(jobHistoryFormService, 'getJobHistoryAngulr').mockReturnValue({ id: null });
      vitest.spyOn(jobHistoryService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobHistory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobHistory }));
      saveSubject.complete();

      // THEN
      expect(jobHistoryFormService.getJobHistoryAngulr).toHaveBeenCalled();
      expect(jobHistoryService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobHistoryAngulr>>();
      const jobHistory = { id: 18667 };
      vitest.spyOn(jobHistoryService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobHistoryService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareJobAngulr', () => {
      it('should forward to jobService', () => {
        const entity = { id: 30796 };
        const entity2 = { id: 29383 };
        vitest.spyOn(jobService, 'compareJobAngulr');
        comp.compareJobAngulr(entity, entity2);
        expect(jobService.compareJobAngulr).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareEmployeeAngulr', () => {
      it('should forward to employeeService', () => {
        const entity = { id: 1749 };
        const entity2 = { id: 1545 };
        vitest.spyOn(employeeService, 'compareEmployeeAngulr');
        comp.compareEmployeeAngulr(entity, entity2);
        expect(employeeService.compareEmployeeAngulr).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
