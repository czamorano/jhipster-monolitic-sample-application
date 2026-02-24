import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IEmployeeAngulr } from 'app/entities/employee-angulr/employee-angulr.model';
import { EmployeeAngulrService } from 'app/entities/employee-angulr/service/employee-angulr.service';
import { TaskAngulrService } from 'app/entities/task-angulr/service/task-angulr.service';
import { ITaskAngulr } from 'app/entities/task-angulr/task-angulr.model';
import { IJobAngulr } from '../job-angulr.model';
import { JobAngulrService } from '../service/job-angulr.service';

import { JobAngulrFormService } from './job-angulr-form.service';
import { JobAngulrUpdate } from './job-angulr-update';

describe('JobAngulr Management Update Component', () => {
  let comp: JobAngulrUpdate;
  let fixture: ComponentFixture<JobAngulrUpdate>;
  let activatedRoute: ActivatedRoute;
  let jobFormService: JobAngulrFormService;
  let jobService: JobAngulrService;
  let taskService: TaskAngulrService;
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

    fixture = TestBed.createComponent(JobAngulrUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobFormService = TestBed.inject(JobAngulrFormService);
    jobService = TestBed.inject(JobAngulrService);
    taskService = TestBed.inject(TaskAngulrService);
    employeeService = TestBed.inject(EmployeeAngulrService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call TaskAngulr query and add missing value', () => {
      const job: IJobAngulr = { id: 29383 };
      const tasks: ITaskAngulr[] = [{ id: 25192 }];
      job.tasks = tasks;

      const taskCollection: ITaskAngulr[] = [{ id: 25192 }];
      vitest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
      const additionalTaskAngulrs = [...tasks];
      const expectedCollection: ITaskAngulr[] = [...additionalTaskAngulrs, ...taskCollection];
      vitest.spyOn(taskService, 'addTaskAngulrToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(taskService.query).toHaveBeenCalled();
      expect(taskService.addTaskAngulrToCollectionIfMissing).toHaveBeenCalledWith(
        taskCollection,
        ...additionalTaskAngulrs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.tasksSharedCollection()).toEqual(expectedCollection);
    });

    it('should call EmployeeAngulr query and add missing value', () => {
      const job: IJobAngulr = { id: 29383 };
      const employee: IEmployeeAngulr = { id: 1749 };
      job.employee = employee;

      const employeeCollection: IEmployeeAngulr[] = [{ id: 1749 }];
      vitest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployeeAngulrs = [employee];
      const expectedCollection: IEmployeeAngulr[] = [...additionalEmployeeAngulrs, ...employeeCollection];
      vitest.spyOn(employeeService, 'addEmployeeAngulrToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeAngulrToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployeeAngulrs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.employeesSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const job: IJobAngulr = { id: 29383 };
      const task: ITaskAngulr = { id: 25192 };
      job.tasks = [task];
      const employee: IEmployeeAngulr = { id: 1749 };
      job.employee = employee;

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(comp.tasksSharedCollection()).toContainEqual(task);
      expect(comp.employeesSharedCollection()).toContainEqual(employee);
      expect(comp.job).toEqual(job);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobAngulr>>();
      const job = { id: 30796 };
      vitest.spyOn(jobFormService, 'getJobAngulr').mockReturnValue(job);
      vitest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: job }));
      saveSubject.complete();

      // THEN
      expect(jobFormService.getJobAngulr).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobService.update).toHaveBeenCalledWith(expect.objectContaining(job));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobAngulr>>();
      const job = { id: 30796 };
      vitest.spyOn(jobFormService, 'getJobAngulr').mockReturnValue({ id: null });
      vitest.spyOn(jobService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: job }));
      saveSubject.complete();

      // THEN
      expect(jobFormService.getJobAngulr).toHaveBeenCalled();
      expect(jobService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobAngulr>>();
      const job = { id: 30796 };
      vitest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTaskAngulr', () => {
      it('should forward to taskService', () => {
        const entity = { id: 25192 };
        const entity2 = { id: 22244 };
        vitest.spyOn(taskService, 'compareTaskAngulr');
        comp.compareTaskAngulr(entity, entity2);
        expect(taskService.compareTaskAngulr).toHaveBeenCalledWith(entity, entity2);
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
