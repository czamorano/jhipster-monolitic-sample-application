import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEnvioMasivo, NewEnvioMasivo } from '../envio-masivo.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEnvioMasivo for edit and NewEnvioMasivoFormGroupInput for create.
 */
type EnvioMasivoFormGroupInput = IEnvioMasivo | PartialWithRequiredKeyOf<NewEnvioMasivo>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEnvioMasivo | NewEnvioMasivo> = Omit<T, 'comienzo' | 'fin'> & {
  comienzo?: string | null;
  fin?: string | null;
};

type EnvioMasivoFormRawValue = FormValueOf<IEnvioMasivo>;

type NewEnvioMasivoFormRawValue = FormValueOf<NewEnvioMasivo>;

type EnvioMasivoFormDefaults = Pick<NewEnvioMasivo, 'id' | 'comienzo' | 'fin'>;

type EnvioMasivoFormGroupContent = {
  id: FormControl<EnvioMasivoFormRawValue['id'] | NewEnvioMasivo['id']>;
  identificador: FormControl<EnvioMasivoFormRawValue['identificador']>;
  tipo: FormControl<EnvioMasivoFormRawValue['tipo']>;
  estado: FormControl<EnvioMasivoFormRawValue['estado']>;
  comienzo: FormControl<EnvioMasivoFormRawValue['comienzo']>;
  fin: FormControl<EnvioMasivoFormRawValue['fin']>;
  aplicacion: FormControl<EnvioMasivoFormRawValue['aplicacion']>;
  organismoEmisor: FormControl<EnvioMasivoFormRawValue['organismoEmisor']>;
};

export type EnvioMasivoFormGroup = FormGroup<EnvioMasivoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EnvioMasivoFormService {
  createEnvioMasivoFormGroup(envioMasivo?: EnvioMasivoFormGroupInput): EnvioMasivoFormGroup {
    const envioMasivoRawValue = this.convertEnvioMasivoToEnvioMasivoRawValue({
      ...this.getFormDefaults(),
      ...(envioMasivo ?? { id: null }),
    });
    return new FormGroup<EnvioMasivoFormGroupContent>({
      id: new FormControl(
        { value: envioMasivoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      identificador: new FormControl(envioMasivoRawValue.identificador, {
        validators: [Validators.required],
      }),
      tipo: new FormControl(envioMasivoRawValue.tipo, {
        validators: [Validators.required],
      }),
      estado: new FormControl(envioMasivoRawValue.estado, {
        validators: [Validators.required],
      }),
      comienzo: new FormControl(envioMasivoRawValue.comienzo),
      fin: new FormControl(envioMasivoRawValue.fin),
      aplicacion: new FormControl(envioMasivoRawValue.aplicacion),
      organismoEmisor: new FormControl(envioMasivoRawValue.organismoEmisor),
    });
  }

  getEnvioMasivo(form: EnvioMasivoFormGroup): IEnvioMasivo | NewEnvioMasivo {
    return this.convertEnvioMasivoRawValueToEnvioMasivo(form.getRawValue() as EnvioMasivoFormRawValue | NewEnvioMasivoFormRawValue);
  }

  resetForm(form: EnvioMasivoFormGroup, envioMasivo: EnvioMasivoFormGroupInput): void {
    const envioMasivoRawValue = this.convertEnvioMasivoToEnvioMasivoRawValue({ ...this.getFormDefaults(), ...envioMasivo });
    form.reset({
      ...envioMasivoRawValue,
      id: { value: envioMasivoRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): EnvioMasivoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      comienzo: currentTime,
      fin: currentTime,
    };
  }

  private convertEnvioMasivoRawValueToEnvioMasivo(
    rawEnvioMasivo: EnvioMasivoFormRawValue | NewEnvioMasivoFormRawValue,
  ): IEnvioMasivo | NewEnvioMasivo {
    return {
      ...rawEnvioMasivo,
      comienzo: dayjs(rawEnvioMasivo.comienzo, DATE_TIME_FORMAT),
      fin: dayjs(rawEnvioMasivo.fin, DATE_TIME_FORMAT),
    };
  }

  private convertEnvioMasivoToEnvioMasivoRawValue(
    envioMasivo: IEnvioMasivo | (Partial<NewEnvioMasivo> & EnvioMasivoFormDefaults),
  ): EnvioMasivoFormRawValue | PartialWithRequiredKeyOf<NewEnvioMasivoFormRawValue> {
    return {
      ...envioMasivo,
      comienzo: envioMasivo.comienzo ? envioMasivo.comienzo.format(DATE_TIME_FORMAT) : undefined,
      fin: envioMasivo.fin ? envioMasivo.fin.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
