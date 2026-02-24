import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ILocationAngulr, NewLocationAngulr } from '../location-angulr.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILocationAngulr for edit and NewLocationAngulrFormGroupInput for create.
 */
type LocationAngulrFormGroupInput = ILocationAngulr | PartialWithRequiredKeyOf<NewLocationAngulr>;

type LocationAngulrFormDefaults = Pick<NewLocationAngulr, 'id'>;

type LocationAngulrFormGroupContent = {
  id: FormControl<ILocationAngulr['id'] | NewLocationAngulr['id']>;
  streetAddress: FormControl<ILocationAngulr['streetAddress']>;
  postalCode: FormControl<ILocationAngulr['postalCode']>;
  city: FormControl<ILocationAngulr['city']>;
  stateProvince: FormControl<ILocationAngulr['stateProvince']>;
  country: FormControl<ILocationAngulr['country']>;
};

export type LocationAngulrFormGroup = FormGroup<LocationAngulrFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LocationAngulrFormService {
  createLocationAngulrFormGroup(location?: LocationAngulrFormGroupInput): LocationAngulrFormGroup {
    const locationRawValue = {
      ...this.getFormDefaults(),
      ...(location ?? { id: null }),
    };
    return new FormGroup<LocationAngulrFormGroupContent>({
      id: new FormControl(
        { value: locationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      streetAddress: new FormControl(locationRawValue.streetAddress),
      postalCode: new FormControl(locationRawValue.postalCode),
      city: new FormControl(locationRawValue.city),
      stateProvince: new FormControl(locationRawValue.stateProvince),
      country: new FormControl(locationRawValue.country),
    });
  }

  getLocationAngulr(form: LocationAngulrFormGroup): ILocationAngulr | NewLocationAngulr {
    return form.getRawValue() as ILocationAngulr | NewLocationAngulr;
  }

  resetForm(form: LocationAngulrFormGroup, location: LocationAngulrFormGroupInput): void {
    const locationRawValue = { ...this.getFormDefaults(), ...location };
    form.reset({
      ...locationRawValue,
      id: { value: locationRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): LocationAngulrFormDefaults {
    return {
      id: null,
    };
  }
}
