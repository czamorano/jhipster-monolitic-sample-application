import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAplicacion } from 'app/entities/aplicacion/aplicacion.model';
import { AplicacionService } from 'app/entities/aplicacion/service/aplicacion.service';
import { EstadoEnvioMasivo } from 'app/entities/enumerations/estado-envio-masivo.model';
import { TipoEnvioMasivo } from 'app/entities/enumerations/tipo-envio-masivo.model';
import { IOrganismoEmisor } from 'app/entities/organismo-emisor/organismo-emisor.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';

import { IEnvioMasivo } from '../envio-masivo.model';
import { EnvioMasivoService } from '../service/envio-masivo.service';

import { EnvioMasivoFormGroup, EnvioMasivoFormService } from './envio-masivo-form.service';
import { OrganismoEmisorService } from 'app/entities/organismo-emisor/service/organismo-emisor.service';

@Component({
  selector: 'jhi-envio-masivo-update',
  templateUrl: './envio-masivo-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class EnvioMasivoUpdate implements OnInit {
  isSaving = signal(false);
  envioMasivo: IEnvioMasivo | null = null;
  tipoEnvioMasivoValues = Object.keys(TipoEnvioMasivo);
  estadoEnvioMasivoValues = Object.keys(EstadoEnvioMasivo);

  aplicacionsSharedCollection = signal<IAplicacion[]>([]);
  organismoEmisorsSharedCollection = signal<IOrganismoEmisor[]>([]);

  protected envioMasivoService = inject(EnvioMasivoService);
  protected envioMasivoFormService = inject(EnvioMasivoFormService);
  protected aplicacionService = inject(AplicacionService);
  protected organismoEmisorService = inject(OrganismoEmisorService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EnvioMasivoFormGroup = this.envioMasivoFormService.createEnvioMasivoFormGroup();

  compareAplicacion = (o1: IAplicacion | null, o2: IAplicacion | null): boolean => this.aplicacionService.compareAplicacion(o1, o2);

  compareOrganismoEmisor = (o1: IOrganismoEmisor | null, o2: IOrganismoEmisor | null): boolean =>
    this.organismoEmisorService.compareOrganismoEmisor(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ envioMasivo }) => {
      this.envioMasivo = envioMasivo;
      if (envioMasivo) {
        this.updateForm(envioMasivo);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const envioMasivo = this.envioMasivoFormService.getEnvioMasivo(this.editForm);
    if (envioMasivo.id === null) {
      this.subscribeToSaveResponse(this.envioMasivoService.create(envioMasivo));
    } else {
      this.subscribeToSaveResponse(this.envioMasivoService.update(envioMasivo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEnvioMasivo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(envioMasivo: IEnvioMasivo): void {
    this.envioMasivo = envioMasivo;
    this.envioMasivoFormService.resetForm(this.editForm, envioMasivo);

    this.aplicacionsSharedCollection.set(
      this.aplicacionService.addAplicacionToCollectionIfMissing<IAplicacion>(this.aplicacionsSharedCollection(), envioMasivo.aplicacion),
    );
    this.organismoEmisorsSharedCollection.set(
      this.organismoEmisorService.addOrganismoEmisorToCollectionIfMissing<IOrganismoEmisor>(
        this.organismoEmisorsSharedCollection(),
        envioMasivo.organismoEmisor,
      ),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.aplicacionService
      .query()
      .pipe(map((res: HttpResponse<IAplicacion[]>) => res.body ?? []))
      .pipe(
        map((aplicacions: IAplicacion[]) =>
          this.aplicacionService.addAplicacionToCollectionIfMissing<IAplicacion>(aplicacions, this.envioMasivo?.aplicacion),
        ),
      )
      .subscribe((aplicacions: IAplicacion[]) => this.aplicacionsSharedCollection.set(aplicacions));

    this.organismoEmisorService
      .query()
      .pipe(map((res: HttpResponse<IOrganismoEmisor[]>) => res.body ?? []))
      .pipe(
        map((organismoEmisors: IOrganismoEmisor[]) =>
          this.organismoEmisorService.addOrganismoEmisorToCollectionIfMissing<IOrganismoEmisor>(
            organismoEmisors,
            this.envioMasivo?.organismoEmisor,
          ),
        ),
      )
      .subscribe((organismoEmisors: IOrganismoEmisor[]) => this.organismoEmisorsSharedCollection.set(organismoEmisors));
  }
}
