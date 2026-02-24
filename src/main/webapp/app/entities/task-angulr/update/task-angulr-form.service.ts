import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITaskAngulr, NewTaskAngulr } from '../task-angulr.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITaskAngulr for edit and NewTaskAngulrFormGroupInput for create.
 */
type TaskAngulrFormGroupInput = ITaskAngulr | PartialWithRequiredKeyOf<NewTaskAngulr>;

type TaskAngulrFormDefaults = Pick<NewTaskAngulr, 'id' | 'jobs'>;

type TaskAngulrFormGroupContent = {
  id: FormControl<ITaskAngulr['id'] | NewTaskAngulr['id']>;
  title: FormControl<ITaskAngulr['title']>;
  description: FormControl<ITaskAngulr['description']>;
  jobs: FormControl<ITaskAngulr['jobs']>;
};

export type TaskAngulrFormGroup = FormGroup<TaskAngulrFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskAngulrFormService {
  createTaskAngulrFormGroup(task?: TaskAngulrFormGroupInput): TaskAngulrFormGroup {
    const taskRawValue = {
      ...this.getFormDefaults(),
      ...(task ?? { id: null }),
    };
    return new FormGroup<TaskAngulrFormGroupContent>({
      id: new FormControl(
        { value: taskRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(taskRawValue.title),
      description: new FormControl(taskRawValue.description),
      jobs: new FormControl(taskRawValue.jobs ?? []),
    });
  }

  getTaskAngulr(form: TaskAngulrFormGroup): ITaskAngulr | NewTaskAngulr {
    return form.getRawValue() as ITaskAngulr | NewTaskAngulr;
  }

  resetForm(form: TaskAngulrFormGroup, task: TaskAngulrFormGroupInput): void {
    const taskRawValue = { ...this.getFormDefaults(), ...task };
    form.reset({
      ...taskRawValue,
      id: { value: taskRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): TaskAngulrFormDefaults {
    return {
      id: null,
      jobs: [],
    };
  }
}
