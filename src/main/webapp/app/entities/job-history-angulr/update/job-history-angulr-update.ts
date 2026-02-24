import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDepartmentAngulr } from 'app/entities/department-angulr/department-angulr.model';
import { DepartmentAngulrService } from 'app/entities/department-angulr/service/department-angulr.service';
import { IEmployeeAngulr } from 'app/entities/employee-angulr/employee-angulr.model';
import { EmployeeAngulrService } from 'app/entities/employee-angulr/service/employee-angulr.service';
import { Language } from 'app/entities/enumerations/language.model';
import { IJobAngulr } from 'app/entities/job-angulr/job-angulr.model';
import { JobAngulrService } from 'app/entities/job-angulr/service/job-angulr.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IJobHistoryAngulr } from '../job-history-angulr.model';
import { JobHistoryAngulrService } from '../service/job-history-angulr.service';

import { JobHistoryAngulrFormGroup, JobHistoryAngulrFormService } from './job-history-angulr-form.service';

@Component({
  selector: 'jhi-job-history-angulr-update',
  templateUrl: './job-history-angulr-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class JobHistoryAngulrUpdate implements OnInit {
  isSaving = signal(false);
  jobHistory: IJobHistoryAngulr | null = null;
  languageValues = Object.keys(Language);

  jobsCollection = signal<IJobAngulr[]>([]);
  departmentsCollection = signal<IDepartmentAngulr[]>([]);
  employeesCollection = signal<IEmployeeAngulr[]>([]);

  protected jobHistoryService = inject(JobHistoryAngulrService);
  protected jobHistoryFormService = inject(JobHistoryAngulrFormService);
  protected jobService = inject(JobAngulrService);
  protected departmentService = inject(DepartmentAngulrService);
  protected employeeService = inject(EmployeeAngulrService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JobHistoryAngulrFormGroup = this.jobHistoryFormService.createJobHistoryAngulrFormGroup();

  compareJobAngulr = (o1: IJobAngulr | null, o2: IJobAngulr | null): boolean => this.jobService.compareJobAngulr(o1, o2);

  compareDepartmentAngulr = (o1: IDepartmentAngulr | null, o2: IDepartmentAngulr | null): boolean =>
    this.departmentService.compareDepartmentAngulr(o1, o2);

  compareEmployeeAngulr = (o1: IEmployeeAngulr | null, o2: IEmployeeAngulr | null): boolean =>
    this.employeeService.compareEmployeeAngulr(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobHistory }) => {
      this.jobHistory = jobHistory;
      if (jobHistory) {
        this.updateForm(jobHistory);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const jobHistory = this.jobHistoryFormService.getJobHistoryAngulr(this.editForm);
    if (jobHistory.id === null) {
      this.subscribeToSaveResponse(this.jobHistoryService.create(jobHistory));
    } else {
      this.subscribeToSaveResponse(this.jobHistoryService.update(jobHistory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobHistoryAngulr>>): void {
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

  protected updateForm(jobHistory: IJobHistoryAngulr): void {
    this.jobHistory = jobHistory;
    this.jobHistoryFormService.resetForm(this.editForm, jobHistory);

    this.jobsCollection.set(this.jobService.addJobAngulrToCollectionIfMissing<IJobAngulr>(this.jobsCollection(), jobHistory.job));
    this.departmentsCollection.set(
      this.departmentService.addDepartmentAngulrToCollectionIfMissing<IDepartmentAngulr>(
        this.departmentsCollection(),
        jobHistory.department,
      ),
    );
    this.employeesCollection.set(
      this.employeeService.addEmployeeAngulrToCollectionIfMissing<IEmployeeAngulr>(this.employeesCollection(), jobHistory.employee),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.jobService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(map((res: HttpResponse<IJobAngulr[]>) => res.body ?? []))
      .pipe(map((jobs: IJobAngulr[]) => this.jobService.addJobAngulrToCollectionIfMissing<IJobAngulr>(jobs, this.jobHistory?.job)))
      .subscribe((jobs: IJobAngulr[]) => this.jobsCollection.set(jobs));

    this.departmentService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(map((res: HttpResponse<IDepartmentAngulr[]>) => res.body ?? []))
      .pipe(
        map((departments: IDepartmentAngulr[]) =>
          this.departmentService.addDepartmentAngulrToCollectionIfMissing<IDepartmentAngulr>(departments, this.jobHistory?.department),
        ),
      )
      .subscribe((departments: IDepartmentAngulr[]) => this.departmentsCollection.set(departments));

    this.employeeService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(map((res: HttpResponse<IEmployeeAngulr[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployeeAngulr[]) =>
          this.employeeService.addEmployeeAngulrToCollectionIfMissing<IEmployeeAngulr>(employees, this.jobHistory?.employee),
        ),
      )
      .subscribe((employees: IEmployeeAngulr[]) => this.employeesCollection.set(employees));
  }
}
