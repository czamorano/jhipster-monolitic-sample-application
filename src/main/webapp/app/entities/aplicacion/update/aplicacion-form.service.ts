import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAplicacion, NewAplicacion } from '../aplicacion.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAplicacion for edit and NewAplicacionFormGroupInput for create.
 */
type AplicacionFormGroupInput = IAplicacion | PartialWithRequiredKeyOf<NewAplicacion>;

type AplicacionFormDefaults = Pick<NewAplicacion, 'id'>;

type AplicacionFormGroupContent = {
  id: FormControl<IAplicacion['id'] | NewAplicacion['id']>;
  nombre: FormControl<IAplicacion['nombre']>;
};

export type AplicacionFormGroup = FormGroup<AplicacionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AplicacionFormService {
  createAplicacionFormGroup(aplicacion?: AplicacionFormGroupInput): AplicacionFormGroup {
    const aplicacionRawValue = {
      ...this.getFormDefaults(),
      ...(aplicacion ?? { id: null }),
    };
    return new FormGroup<AplicacionFormGroupContent>({
      id: new FormControl(
        { value: aplicacionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombre: new FormControl(aplicacionRawValue.nombre, {
        validators: [Validators.required],
      }),
    });
  }

  getAplicacion(form: AplicacionFormGroup): IAplicacion | NewAplicacion {
    return form.getRawValue() as IAplicacion | NewAplicacion;
  }

  resetForm(form: AplicacionFormGroup, aplicacion: AplicacionFormGroupInput): void {
    const aplicacionRawValue = { ...this.getFormDefaults(), ...aplicacion };
    form.reset({
      ...aplicacionRawValue,
      id: { value: aplicacionRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): AplicacionFormDefaults {
    return {
      id: null,
    };
  }
}
