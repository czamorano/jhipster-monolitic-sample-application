import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmployeeAngulr, NewEmployeeAngulr } from '../employee-angulr.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmployeeAngulr for edit and NewEmployeeAngulrFormGroupInput for create.
 */
type EmployeeAngulrFormGroupInput = IEmployeeAngulr | PartialWithRequiredKeyOf<NewEmployeeAngulr>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEmployeeAngulr | NewEmployeeAngulr> = Omit<T, 'hireDate'> & {
  hireDate?: string | null;
};

type EmployeeAngulrFormRawValue = FormValueOf<IEmployeeAngulr>;

type NewEmployeeAngulrFormRawValue = FormValueOf<NewEmployeeAngulr>;

type EmployeeAngulrFormDefaults = Pick<NewEmployeeAngulr, 'id' | 'hireDate'>;

type EmployeeAngulrFormGroupContent = {
  id: FormControl<EmployeeAngulrFormRawValue['id'] | NewEmployeeAngulr['id']>;
  firstName: FormControl<EmployeeAngulrFormRawValue['firstName']>;
  lastName: FormControl<EmployeeAngulrFormRawValue['lastName']>;
  email: FormControl<EmployeeAngulrFormRawValue['email']>;
  phoneNumber: FormControl<EmployeeAngulrFormRawValue['phoneNumber']>;
  hireDate: FormControl<EmployeeAngulrFormRawValue['hireDate']>;
  salary: FormControl<EmployeeAngulrFormRawValue['salary']>;
  commissionPct: FormControl<EmployeeAngulrFormRawValue['commissionPct']>;
  manager: FormControl<EmployeeAngulrFormRawValue['manager']>;
  department: FormControl<EmployeeAngulrFormRawValue['department']>;
};

export type EmployeeAngulrFormGroup = FormGroup<EmployeeAngulrFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmployeeAngulrFormService {
  createEmployeeAngulrFormGroup(employee?: EmployeeAngulrFormGroupInput): EmployeeAngulrFormGroup {
    const employeeRawValue = this.convertEmployeeAngulrToEmployeeAngulrRawValue({
      ...this.getFormDefaults(),
      ...(employee ?? { id: null }),
    });
    return new FormGroup<EmployeeAngulrFormGroupContent>({
      id: new FormControl(
        { value: employeeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(employeeRawValue.firstName),
      lastName: new FormControl(employeeRawValue.lastName),
      email: new FormControl(employeeRawValue.email),
      phoneNumber: new FormControl(employeeRawValue.phoneNumber),
      hireDate: new FormControl(employeeRawValue.hireDate),
      salary: new FormControl(employeeRawValue.salary),
      commissionPct: new FormControl(employeeRawValue.commissionPct),
      manager: new FormControl(employeeRawValue.manager),
      department: new FormControl(employeeRawValue.department),
    });
  }

  getEmployeeAngulr(form: EmployeeAngulrFormGroup): IEmployeeAngulr | NewEmployeeAngulr {
    return this.convertEmployeeAngulrRawValueToEmployeeAngulr(
      form.getRawValue() as EmployeeAngulrFormRawValue | NewEmployeeAngulrFormRawValue,
    );
  }

  resetForm(form: EmployeeAngulrFormGroup, employee: EmployeeAngulrFormGroupInput): void {
    const employeeRawValue = this.convertEmployeeAngulrToEmployeeAngulrRawValue({ ...this.getFormDefaults(), ...employee });
    form.reset({
      ...employeeRawValue,
      id: { value: employeeRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): EmployeeAngulrFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      hireDate: currentTime,
    };
  }

  private convertEmployeeAngulrRawValueToEmployeeAngulr(
    rawEmployeeAngulr: EmployeeAngulrFormRawValue | NewEmployeeAngulrFormRawValue,
  ): IEmployeeAngulr | NewEmployeeAngulr {
    return {
      ...rawEmployeeAngulr,
      hireDate: dayjs(rawEmployeeAngulr.hireDate, DATE_TIME_FORMAT),
    };
  }

  private convertEmployeeAngulrToEmployeeAngulrRawValue(
    employee: IEmployeeAngulr | (Partial<NewEmployeeAngulr> & EmployeeAngulrFormDefaults),
  ): EmployeeAngulrFormRawValue | PartialWithRequiredKeyOf<NewEmployeeAngulrFormRawValue> {
    return {
      ...employee,
      hireDate: employee.hireDate ? employee.hireDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
