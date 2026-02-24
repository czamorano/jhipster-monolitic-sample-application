import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ICountryAngulr, NewCountryAngulr } from '../country-angulr.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICountryAngulr for edit and NewCountryAngulrFormGroupInput for create.
 */
type CountryAngulrFormGroupInput = ICountryAngulr | PartialWithRequiredKeyOf<NewCountryAngulr>;

type CountryAngulrFormDefaults = Pick<NewCountryAngulr, 'id'>;

type CountryAngulrFormGroupContent = {
  id: FormControl<ICountryAngulr['id'] | NewCountryAngulr['id']>;
  countryName: FormControl<ICountryAngulr['countryName']>;
  region: FormControl<ICountryAngulr['region']>;
};

export type CountryAngulrFormGroup = FormGroup<CountryAngulrFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CountryAngulrFormService {
  createCountryAngulrFormGroup(country?: CountryAngulrFormGroupInput): CountryAngulrFormGroup {
    const countryRawValue = {
      ...this.getFormDefaults(),
      ...(country ?? { id: null }),
    };
    return new FormGroup<CountryAngulrFormGroupContent>({
      id: new FormControl(
        { value: countryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      countryName: new FormControl(countryRawValue.countryName),
      region: new FormControl(countryRawValue.region),
    });
  }

  getCountryAngulr(form: CountryAngulrFormGroup): ICountryAngulr | NewCountryAngulr {
    return form.getRawValue() as ICountryAngulr | NewCountryAngulr;
  }

  resetForm(form: CountryAngulrFormGroup, country: CountryAngulrFormGroupInput): void {
    const countryRawValue = { ...this.getFormDefaults(), ...country };
    form.reset({
      ...countryRawValue,
      id: { value: countryRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): CountryAngulrFormDefaults {
    return {
      id: null,
    };
  }
}
