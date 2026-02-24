import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IRegionAngulr, NewRegionAngulr } from '../region-angulr.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRegionAngulr for edit and NewRegionAngulrFormGroupInput for create.
 */
type RegionAngulrFormGroupInput = IRegionAngulr | PartialWithRequiredKeyOf<NewRegionAngulr>;

type RegionAngulrFormDefaults = Pick<NewRegionAngulr, 'id'>;

type RegionAngulrFormGroupContent = {
  id: FormControl<IRegionAngulr['id'] | NewRegionAngulr['id']>;
  regionName: FormControl<IRegionAngulr['regionName']>;
};

export type RegionAngulrFormGroup = FormGroup<RegionAngulrFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RegionAngulrFormService {
  createRegionAngulrFormGroup(region?: RegionAngulrFormGroupInput): RegionAngulrFormGroup {
    const regionRawValue = {
      ...this.getFormDefaults(),
      ...(region ?? { id: null }),
    };
    return new FormGroup<RegionAngulrFormGroupContent>({
      id: new FormControl(
        { value: regionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      regionName: new FormControl(regionRawValue.regionName),
    });
  }

  getRegionAngulr(form: RegionAngulrFormGroup): IRegionAngulr | NewRegionAngulr {
    return form.getRawValue() as IRegionAngulr | NewRegionAngulr;
  }

  resetForm(form: RegionAngulrFormGroup, region: RegionAngulrFormGroupInput): void {
    const regionRawValue = { ...this.getFormDefaults(), ...region };
    form.reset({
      ...regionRawValue,
      id: { value: regionRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): RegionAngulrFormDefaults {
    return {
      id: null,
    };
  }
}
