import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IJobHistoryAngulr, NewJobHistoryAngulr } from '../job-history-angulr.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJobHistoryAngulr for edit and NewJobHistoryAngulrFormGroupInput for create.
 */
type JobHistoryAngulrFormGroupInput = IJobHistoryAngulr | PartialWithRequiredKeyOf<NewJobHistoryAngulr>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IJobHistoryAngulr | NewJobHistoryAngulr> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

type JobHistoryAngulrFormRawValue = FormValueOf<IJobHistoryAngulr>;

type NewJobHistoryAngulrFormRawValue = FormValueOf<NewJobHistoryAngulr>;

type JobHistoryAngulrFormDefaults = Pick<NewJobHistoryAngulr, 'id' | 'startDate' | 'endDate'>;

type JobHistoryAngulrFormGroupContent = {
  id: FormControl<JobHistoryAngulrFormRawValue['id'] | NewJobHistoryAngulr['id']>;
  startDate: FormControl<JobHistoryAngulrFormRawValue['startDate']>;
  endDate: FormControl<JobHistoryAngulrFormRawValue['endDate']>;
  language: FormControl<JobHistoryAngulrFormRawValue['language']>;
  job: FormControl<JobHistoryAngulrFormRawValue['job']>;
  department: FormControl<JobHistoryAngulrFormRawValue['department']>;
  employee: FormControl<JobHistoryAngulrFormRawValue['employee']>;
};

export type JobHistoryAngulrFormGroup = FormGroup<JobHistoryAngulrFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JobHistoryAngulrFormService {
  createJobHistoryAngulrFormGroup(jobHistory?: JobHistoryAngulrFormGroupInput): JobHistoryAngulrFormGroup {
    const jobHistoryRawValue = this.convertJobHistoryAngulrToJobHistoryAngulrRawValue({
      ...this.getFormDefaults(),
      ...(jobHistory ?? { id: null }),
    });
    return new FormGroup<JobHistoryAngulrFormGroupContent>({
      id: new FormControl(
        { value: jobHistoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      startDate: new FormControl(jobHistoryRawValue.startDate),
      endDate: new FormControl(jobHistoryRawValue.endDate),
      language: new FormControl(jobHistoryRawValue.language),
      job: new FormControl(jobHistoryRawValue.job),
      department: new FormControl(jobHistoryRawValue.department),
      employee: new FormControl(jobHistoryRawValue.employee),
    });
  }

  getJobHistoryAngulr(form: JobHistoryAngulrFormGroup): IJobHistoryAngulr | NewJobHistoryAngulr {
    return this.convertJobHistoryAngulrRawValueToJobHistoryAngulr(
      form.getRawValue() as JobHistoryAngulrFormRawValue | NewJobHistoryAngulrFormRawValue,
    );
  }

  resetForm(form: JobHistoryAngulrFormGroup, jobHistory: JobHistoryAngulrFormGroupInput): void {
    const jobHistoryRawValue = this.convertJobHistoryAngulrToJobHistoryAngulrRawValue({ ...this.getFormDefaults(), ...jobHistory });
    form.reset({
      ...jobHistoryRawValue,
      id: { value: jobHistoryRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): JobHistoryAngulrFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
    };
  }

  private convertJobHistoryAngulrRawValueToJobHistoryAngulr(
    rawJobHistoryAngulr: JobHistoryAngulrFormRawValue | NewJobHistoryAngulrFormRawValue,
  ): IJobHistoryAngulr | NewJobHistoryAngulr {
    return {
      ...rawJobHistoryAngulr,
      startDate: dayjs(rawJobHistoryAngulr.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawJobHistoryAngulr.endDate, DATE_TIME_FORMAT),
    };
  }

  private convertJobHistoryAngulrToJobHistoryAngulrRawValue(
    jobHistory: IJobHistoryAngulr | (Partial<NewJobHistoryAngulr> & JobHistoryAngulrFormDefaults),
  ): JobHistoryAngulrFormRawValue | PartialWithRequiredKeyOf<NewJobHistoryAngulrFormRawValue> {
    return {
      ...jobHistory,
      startDate: jobHistory.startDate ? jobHistory.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: jobHistory.endDate ? jobHistory.endDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
