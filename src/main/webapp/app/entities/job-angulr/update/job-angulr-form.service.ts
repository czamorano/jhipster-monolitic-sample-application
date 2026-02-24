import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IJobAngulr, NewJobAngulr } from '../job-angulr.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobAngulr for edit and NewJobAngulrFormGroupInput for create.
 */
type JobAngulrFormGroupInput = IJobAngulr | PartialWithRequiredKeyOf<NewJobAngulr>;

type JobAngulrFormDefaults = Pick<NewJobAngulr, 'id' | 'tasks'>;

type JobAngulrFormGroupContent = {
  id: FormControl<IJobAngulr['id'] | NewJobAngulr['id']>;
  jobTitle: FormControl<IJobAngulr['jobTitle']>;
  minSalary: FormControl<IJobAngulr['minSalary']>;
  maxSalary: FormControl<IJobAngulr['maxSalary']>;
  tasks: FormControl<IJobAngulr['tasks']>;
  employee: FormControl<IJobAngulr['employee']>;
};

export type JobAngulrFormGroup = FormGroup<JobAngulrFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobAngulrFormService {
  createJobAngulrFormGroup(job?: JobAngulrFormGroupInput): JobAngulrFormGroup {
    const jobRawValue = {
      ...this.getFormDefaults(),
      ...(job ?? { id: null }),
    };
    return new FormGroup<JobAngulrFormGroupContent>({
      id: new FormControl(
        { value: jobRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      jobTitle: new FormControl(jobRawValue.jobTitle),
      minSalary: new FormControl(jobRawValue.minSalary),
      maxSalary: new FormControl(jobRawValue.maxSalary),
      tasks: new FormControl(jobRawValue.tasks ?? []),
      employee: new FormControl(jobRawValue.employee),
    });
  }

  getJobAngulr(form: JobAngulrFormGroup): IJobAngulr | NewJobAngulr {
    return form.getRawValue() as IJobAngulr | NewJobAngulr;
  }

  resetForm(form: JobAngulrFormGroup, job: JobAngulrFormGroupInput): void {
    const jobRawValue = { ...this.getFormDefaults(), ...job };
    form.reset({
      ...jobRawValue,
      id: { value: jobRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): JobAngulrFormDefaults {
    return {
      id: null,
      tasks: [],
    };
  }
}
