import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IJobAngulr } from 'app/entities/job-angulr/job-angulr.model';
import { JobAngulrService } from 'app/entities/job-angulr/service/job-angulr.service';
import { TaskAngulrService } from '../service/task-angulr.service';
import { ITaskAngulr } from '../task-angulr.model';

import { TaskAngulrFormService } from './task-angulr-form.service';
import { TaskAngulrUpdate } from './task-angulr-update';

describe('TaskAngulr Management Update Component', () => {
  let comp: TaskAngulrUpdate;
  let fixture: ComponentFixture<TaskAngulrUpdate>;
  let activatedRoute: ActivatedRoute;
  let taskFormService: TaskAngulrFormService;
  let taskService: TaskAngulrService;
  let jobService: JobAngulrService;

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

    fixture = TestBed.createComponent(TaskAngulrUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskFormService = TestBed.inject(TaskAngulrFormService);
    taskService = TestBed.inject(TaskAngulrService);
    jobService = TestBed.inject(JobAngulrService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call JobAngulr query and add missing value', () => {
      const task: ITaskAngulr = { id: 22244 };
      const jobs: IJobAngulr[] = [{ id: 30796 }];
      task.jobs = jobs;

      const jobCollection: IJobAngulr[] = [{ id: 30796 }];
      vitest.spyOn(jobService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCollection })));
      const additionalJobAngulrs = [...jobs];
      const expectedCollection: IJobAngulr[] = [...additionalJobAngulrs, ...jobCollection];
      vitest.spyOn(jobService, 'addJobAngulrToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(jobService.query).toHaveBeenCalled();
      expect(jobService.addJobAngulrToCollectionIfMissing).toHaveBeenCalledWith(
        jobCollection,
        ...additionalJobAngulrs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.jobsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const task: ITaskAngulr = { id: 22244 };
      const job: IJobAngulr = { id: 30796 };
      task.jobs = [job];

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(comp.jobsSharedCollection()).toContainEqual(job);
      expect(comp.task).toEqual(task);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskAngulr>>();
      const task = { id: 25192 };
      vitest.spyOn(taskFormService, 'getTaskAngulr').mockReturnValue(task);
      vitest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTaskAngulr).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskService.update).toHaveBeenCalledWith(expect.objectContaining(task));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskAngulr>>();
      const task = { id: 25192 };
      vitest.spyOn(taskFormService, 'getTaskAngulr').mockReturnValue({ id: null });
      vitest.spyOn(taskService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTaskAngulr).toHaveBeenCalled();
      expect(taskService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskAngulr>>();
      const task = { id: 25192 };
      vitest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskService.update).toHaveBeenCalled();
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
  });
});
