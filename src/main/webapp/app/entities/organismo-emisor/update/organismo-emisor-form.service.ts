import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IOrganismoEmisor, NewOrganismoEmisor } from '../organismo-emisor.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrganismoEmisor for edit and NewOrganismoEmisorFormGroupInput for create.
 */
type OrganismoEmisorFormGroupInput = IOrganismoEmisor | PartialWithRequiredKeyOf<NewOrganismoEmisor>;

type OrganismoEmisorFormDefaults = Pick<NewOrganismoEmisor, 'id'>;

type OrganismoEmisorFormGroupContent = {
  id: FormControl<IOrganismoEmisor['id'] | NewOrganismoEmisor['id']>;
  nombre: FormControl<IOrganismoEmisor['nombre']>;
  codigo: FormControl<IOrganismoEmisor['codigo']>;
};

export type OrganismoEmisorFormGroup = FormGroup<OrganismoEmisorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrganismoEmisorFormService {
  createOrganismoEmisorFormGroup(organismoEmisor?: OrganismoEmisorFormGroupInput): OrganismoEmisorFormGroup {
    const organismoEmisorRawValue = {
      ...this.getFormDefaults(),
      ...(organismoEmisor ?? { id: null }),
    };
    return new FormGroup<OrganismoEmisorFormGroupContent>({
      id: new FormControl(
        { value: organismoEmisorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombre: new FormControl(organismoEmisorRawValue.nombre, {
        validators: [Validators.required],
      }),
      codigo: new FormControl(organismoEmisorRawValue.codigo, {
        validators: [Validators.required],
      }),
    });
  }

  getOrganismoEmisor(form: OrganismoEmisorFormGroup): IOrganismoEmisor | NewOrganismoEmisor {
    return form.getRawValue() as IOrganismoEmisor | NewOrganismoEmisor;
  }

  resetForm(form: OrganismoEmisorFormGroup, organismoEmisor: OrganismoEmisorFormGroupInput): void {
    const organismoEmisorRawValue = { ...this.getFormDefaults(), ...organismoEmisor };
    form.reset({
      ...organismoEmisorRawValue,
      id: { value: organismoEmisorRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): OrganismoEmisorFormDefaults {
    return {
      id: null,
    };
  }
}
