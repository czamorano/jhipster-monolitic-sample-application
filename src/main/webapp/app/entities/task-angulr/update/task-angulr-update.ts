import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IJobAngulr } from 'app/entities/job-angulr/job-angulr.model';
import { JobAngulrService } from 'app/entities/job-angulr/service/job-angulr.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { TaskAngulrService } from '../service/task-angulr.service';
import { ITaskAngulr } from '../task-angulr.model';

import { TaskAngulrFormGroup, TaskAngulrFormService } from './task-angulr-form.service';

@Component({
  selector: 'jhi-task-angulr-update',
  templateUrl: './task-angulr-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class TaskAngulrUpdate implements OnInit {
  isSaving = signal(false);
  task: ITaskAngulr | null = null;

  jobsSharedCollection = signal<IJobAngulr[]>([]);

  protected taskService = inject(TaskAngulrService);
  protected taskFormService = inject(TaskAngulrFormService);
  protected jobService = inject(JobAngulrService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TaskAngulrFormGroup = this.taskFormService.createTaskAngulrFormGroup();

  compareJobAngulr = (o1: IJobAngulr | null, o2: IJobAngulr | null): boolean => this.jobService.compareJobAngulr(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.task = task;
      if (task) {
        this.updateForm(task);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const task = this.taskFormService.getTaskAngulr(this.editForm);
    if (task.id === null) {
      this.subscribeToSaveResponse(this.taskService.create(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.update(task));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITaskAngulr>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(task: ITaskAngulr): void {
    this.task = task;
    this.taskFormService.resetForm(this.editForm, task);

    this.jobsSharedCollection.set(
      this.jobService.addJobAngulrToCollectionIfMissing<IJobAngulr>(this.jobsSharedCollection(), ...(task.jobs ?? [])),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.jobService
      .query()
      .pipe(map((res: HttpResponse<IJobAngulr[]>) => res.body ?? []))
      .pipe(map((jobs: IJobAngulr[]) => this.jobService.addJobAngulrToCollectionIfMissing<IJobAngulr>(jobs, ...(this.task?.jobs ?? []))))
      .subscribe((jobs: IJobAngulr[]) => this.jobsSharedCollection.set(jobs));
  }
}
