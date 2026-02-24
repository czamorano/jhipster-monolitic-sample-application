import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IDepartmentAngulr, NewDepartmentAngulr } from '../department-angulr.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDepartmentAngulr for edit and NewDepartmentAngulrFormGroupInput for create.
 */
type DepartmentAngulrFormGroupInput = IDepartmentAngulr | PartialWithRequiredKeyOf<NewDepartmentAngulr>;

type DepartmentAngulrFormDefaults = Pick<NewDepartmentAngulr, 'id'>;

type DepartmentAngulrFormGroupContent = {
  id: FormControl<IDepartmentAngulr['id'] | NewDepartmentAngulr['id']>;
  departmentName: FormControl<IDepartmentAngulr['departmentName']>;
  location: FormControl<IDepartmentAngulr['location']>;
};

export type DepartmentAngulrFormGroup = FormGroup<DepartmentAngulrFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DepartmentAngulrFormService {
  createDepartmentAngulrFormGroup(department?: DepartmentAngulrFormGroupInput): DepartmentAngulrFormGroup {
    const departmentRawValue = {
      ...this.getFormDefaults(),
      ...(department ?? { id: null }),
    };
    return new FormGroup<DepartmentAngulrFormGroupContent>({
      id: new FormControl(
        { value: departmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      departmentName: new FormControl(departmentRawValue.departmentName, {
        validators: [Validators.required],
      }),
      location: new FormControl(departmentRawValue.location),
    });
  }

  getDepartmentAngulr(form: DepartmentAngulrFormGroup): IDepartmentAngulr | NewDepartmentAngulr {
    return form.getRawValue() as IDepartmentAngulr | NewDepartmentAngulr;
  }

  resetForm(form: DepartmentAngulrFormGroup, department: DepartmentAngulrFormGroupInput): void {
    const departmentRawValue = { ...this.getFormDefaults(), ...department };
    form.reset({
      ...departmentRawValue,
      id: { value: departmentRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): DepartmentAngulrFormDefaults {
    return {
      id: null,
    };
  }
}
