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
import { IOrganismoEmisor } from '../organismo-emisor.model';
import { OrganismoEmisorService } from '../service/organismo-emisor.service';

import { OrganismoEmisorFormGroup, OrganismoEmisorFormService } from './organismo-emisor-form.service';

@Component({
  selector: 'jhi-organismo-emisor-update',
  templateUrl: './organismo-emisor-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class OrganismoEmisorUpdate implements OnInit {
  isSaving = signal(false);
  organismoEmisor: IOrganismoEmisor | null = null;

  protected organismoEmisorService = inject(OrganismoEmisorService);
  protected organismoEmisorFormService = inject(OrganismoEmisorFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OrganismoEmisorFormGroup = this.organismoEmisorFormService.createOrganismoEmisorFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organismoEmisor }) => {
      this.organismoEmisor = organismoEmisor;
      if (organismoEmisor) {
        this.updateForm(organismoEmisor);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const organismoEmisor = this.organismoEmisorFormService.getOrganismoEmisor(this.editForm);
    if (organismoEmisor.id === null) {
      this.subscribeToSaveResponse(this.organismoEmisorService.create(organismoEmisor));
    } else {
      this.subscribeToSaveResponse(this.organismoEmisorService.update(organismoEmisor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganismoEmisor>>): void {
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

  protected updateForm(organismoEmisor: IOrganismoEmisor): void {
    this.organismoEmisor = organismoEmisor;
    this.organismoEmisorFormService.resetForm(this.editForm, organismoEmisor);
  }
}
