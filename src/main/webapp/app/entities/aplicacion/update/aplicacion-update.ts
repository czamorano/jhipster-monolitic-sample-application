import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IAplicacion } from '../aplicacion.model';
import { AplicacionService } from '../service/aplicacion.service';

import { AplicacionFormGroup, AplicacionFormService } from './aplicacion-form.service';

@Component({
  selector: 'jhi-aplicacion-update',
  templateUrl: './aplicacion-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class AplicacionUpdate implements OnInit {
  isSaving = signal(false);
  aplicacion: IAplicacion | null = null;

  protected aplicacionService = inject(AplicacionService);
  protected aplicacionFormService = inject(AplicacionFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AplicacionFormGroup = this.aplicacionFormService.createAplicacionFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ aplicacion }) => {
      this.aplicacion = aplicacion;
      if (aplicacion) {
        this.updateForm(aplicacion);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const aplicacion = this.aplicacionFormService.getAplicacion(this.editForm);
    if (aplicacion.id === null) {
      this.subscribeToSaveResponse(this.aplicacionService.create(aplicacion));
    } else {
      this.subscribeToSaveResponse(this.aplicacionService.update(aplicacion));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAplicacion>>): void {
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

  protected updateForm(aplicacion: IAplicacion): void {
    this.aplicacion = aplicacion;
    this.aplicacionFormService.resetForm(this.editForm, aplicacion);
  }
}
