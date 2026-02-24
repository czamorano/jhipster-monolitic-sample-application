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
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IEmployeeAngulr } from '../employee-angulr.model';
import { EmployeeAngulrService } from '../service/employee-angulr.service';

import { EmployeeAngulrFormGroup, EmployeeAngulrFormService } from './employee-angulr-form.service';

@Component({
  selector: 'jhi-employee-angulr-update',
  templateUrl: './employee-angulr-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class EmployeeAngulrUpdate implements OnInit {
  isSaving = signal(false);
  employee: IEmployeeAngulr | null = null;

  employeesSharedCollection = signal<IEmployeeAngulr[]>([]);
  departmentsSharedCollection = signal<IDepartmentAngulr[]>([]);

  protected employeeService = inject(EmployeeAngulrService);
  protected employeeFormService = inject(EmployeeAngulrFormService);
  protected departmentService = inject(DepartmentAngulrService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EmployeeAngulrFormGroup = this.employeeFormService.createEmployeeAngulrFormGroup();

  compareEmployeeAngulr = (o1: IEmployeeAngulr | null, o2: IEmployeeAngulr | null): boolean =>
    this.employeeService.compareEmployeeAngulr(o1, o2);

  compareDepartmentAngulr = (o1: IDepartmentAngulr | null, o2: IDepartmentAngulr | null): boolean =>
    this.departmentService.compareDepartmentAngulr(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employee }) => {
      this.employee = employee;
      if (employee) {
        this.updateForm(employee);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const employee = this.employeeFormService.getEmployeeAngulr(this.editForm);
    if (employee.id === null) {
      this.subscribeToSaveResponse(this.employeeService.create(employee));
    } else {
      this.subscribeToSaveResponse(this.employeeService.update(employee));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployeeAngulr>>): void {
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

  protected updateForm(employee: IEmployeeAngulr): void {
    this.employee = employee;
    this.employeeFormService.resetForm(this.editForm, employee);

    this.employeesSharedCollection.set(
      this.employeeService.addEmployeeAngulrToCollectionIfMissing<IEmployeeAngulr>(this.employeesSharedCollection(), employee.manager),
    );
    this.departmentsSharedCollection.set(
      this.departmentService.addDepartmentAngulrToCollectionIfMissing<IDepartmentAngulr>(
        this.departmentsSharedCollection(),
        employee.department,
      ),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployeeAngulr[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployeeAngulr[]) =>
          this.employeeService.addEmployeeAngulrToCollectionIfMissing<IEmployeeAngulr>(employees, this.employee?.manager),
        ),
      )
      .subscribe((employees: IEmployeeAngulr[]) => this.employeesSharedCollection.set(employees));

    this.departmentService
      .query()
      .pipe(map((res: HttpResponse<IDepartmentAngulr[]>) => res.body ?? []))
      .pipe(
        map((departments: IDepartmentAngulr[]) =>
          this.departmentService.addDepartmentAngulrToCollectionIfMissing<IDepartmentAngulr>(departments, this.employee?.department),
        ),
      )
      .subscribe((departments: IDepartmentAngulr[]) => this.departmentsSharedCollection.set(departments));
  }
}
