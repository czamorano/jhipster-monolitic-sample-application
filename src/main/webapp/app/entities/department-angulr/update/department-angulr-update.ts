import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILocationAngulr } from 'app/entities/location-angulr/location-angulr.model';
import { LocationAngulrService } from 'app/entities/location-angulr/service/location-angulr.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IDepartmentAngulr } from '../department-angulr.model';
import { DepartmentAngulrService } from '../service/department-angulr.service';

import { DepartmentAngulrFormGroup, DepartmentAngulrFormService } from './department-angulr-form.service';

@Component({
  selector: 'jhi-department-angulr-update',
  templateUrl: './department-angulr-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class DepartmentAngulrUpdate implements OnInit {
  isSaving = signal(false);
  department: IDepartmentAngulr | null = null;

  locationsCollection = signal<ILocationAngulr[]>([]);

  protected departmentService = inject(DepartmentAngulrService);
  protected departmentFormService = inject(DepartmentAngulrFormService);
  protected locationService = inject(LocationAngulrService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: DepartmentAngulrFormGroup = this.departmentFormService.createDepartmentAngulrFormGroup();

  compareLocationAngulr = (o1: ILocationAngulr | null, o2: ILocationAngulr | null): boolean =>
    this.locationService.compareLocationAngulr(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ department }) => {
      this.department = department;
      if (department) {
        this.updateForm(department);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const department = this.departmentFormService.getDepartmentAngulr(this.editForm);
    if (department.id === null) {
      this.subscribeToSaveResponse(this.departmentService.create(department));
    } else {
      this.subscribeToSaveResponse(this.departmentService.update(department));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepartmentAngulr>>): void {
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

  protected updateForm(department: IDepartmentAngulr): void {
    this.department = department;
    this.departmentFormService.resetForm(this.editForm, department);

    this.locationsCollection.set(
      this.locationService.addLocationAngulrToCollectionIfMissing<ILocationAngulr>(this.locationsCollection(), department.location),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query({ filter: 'department-is-null' })
      .pipe(map((res: HttpResponse<ILocationAngulr[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocationAngulr[]) =>
          this.locationService.addLocationAngulrToCollectionIfMissing<ILocationAngulr>(locations, this.department?.location),
        ),
      )
      .subscribe((locations: ILocationAngulr[]) => this.locationsCollection.set(locations));
  }
}
