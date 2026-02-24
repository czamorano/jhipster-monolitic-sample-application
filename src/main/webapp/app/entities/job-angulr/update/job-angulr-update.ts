import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEmployeeAngulr } from 'app/entities/employee-angulr/employee-angulr.model';
import { EmployeeAngulrService } from 'app/entities/employee-angulr/service/employee-angulr.service';
import { TaskAngulrService } from 'app/entities/task-angulr/service/task-angulr.service';
import { ITaskAngulr } from 'app/entities/task-angulr/task-angulr.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IJobAngulr } from '../job-angulr.model';
import { JobAngulrService } from '../service/job-angulr.service';

import { JobAngulrFormGroup, JobAngulrFormService } from './job-angulr-form.service';

@Component({
  selector: 'jhi-job-angulr-update',
  templateUrl: './job-angulr-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class JobAngulrUpdate implements OnInit {
  isSaving = signal(false);
  job: IJobAngulr | null = null;

  tasksSharedCollection = signal<ITaskAngulr[]>([]);
  employeesSharedCollection = signal<IEmployeeAngulr[]>([]);

  protected jobService = inject(JobAngulrService);
  protected jobFormService = inject(JobAngulrFormService);
  protected taskService = inject(TaskAngulrService);
  protected employeeService = inject(EmployeeAngulrService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JobAngulrFormGroup = this.jobFormService.createJobAngulrFormGroup();

  compareTaskAngulr = (o1: ITaskAngulr | null, o2: ITaskAngulr | null): boolean => this.taskService.compareTaskAngulr(o1, o2);

  compareEmployeeAngulr = (o1: IEmployeeAngulr | null, o2: IEmployeeAngulr | null): boolean =>
    this.employeeService.compareEmployeeAngulr(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => {
      this.job = job;
      if (job) {
        this.updateForm(job);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const job = this.jobFormService.getJobAngulr(this.editForm);
    if (job.id === null) {
      this.subscribeToSaveResponse(this.jobService.create(job));
    } else {
      this.subscribeToSaveResponse(this.jobService.update(job));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobAngulr>>): void {
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

  protected updateForm(job: IJobAngulr): void {
    this.job = job;
    this.jobFormService.resetForm(this.editForm, job);

    this.tasksSharedCollection.set(
      this.taskService.addTaskAngulrToCollectionIfMissing<ITaskAngulr>(this.tasksSharedCollection(), ...(job.tasks ?? [])),
    );
    this.employeesSharedCollection.set(
      this.employeeService.addEmployeeAngulrToCollectionIfMissing<IEmployeeAngulr>(this.employeesSharedCollection(), job.employee),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITaskAngulr[]>) => res.body ?? []))
      .pipe(
        map((tasks: ITaskAngulr[]) => this.taskService.addTaskAngulrToCollectionIfMissing<ITaskAngulr>(tasks, ...(this.job?.tasks ?? []))),
      )
      .subscribe((tasks: ITaskAngulr[]) => this.tasksSharedCollection.set(tasks));

    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployeeAngulr[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployeeAngulr[]) =>
          this.employeeService.addEmployeeAngulrToCollectionIfMissing<IEmployeeAngulr>(employees, this.job?.employee),
        ),
      )
      .subscribe((employees: IEmployeeAngulr[]) => this.employeesSharedCollection.set(employees));
  }
}
