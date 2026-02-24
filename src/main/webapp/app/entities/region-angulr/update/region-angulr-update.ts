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
import { IRegionAngulr } from '../region-angulr.model';
import { RegionAngulrService } from '../service/region-angulr.service';

import { RegionAngulrFormGroup, RegionAngulrFormService } from './region-angulr-form.service';

@Component({
  selector: 'jhi-region-angulr-update',
  templateUrl: './region-angulr-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class RegionAngulrUpdate implements OnInit {
  isSaving = signal(false);
  region: IRegionAngulr | null = null;

  protected regionService = inject(RegionAngulrService);
  protected regionFormService = inject(RegionAngulrFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: RegionAngulrFormGroup = this.regionFormService.createRegionAngulrFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ region }) => {
      this.region = region;
      if (region) {
        this.updateForm(region);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const region = this.regionFormService.getRegionAngulr(this.editForm);
    if (region.id === null) {
      this.subscribeToSaveResponse(this.regionService.create(region));
    } else {
      this.subscribeToSaveResponse(this.regionService.update(region));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegionAngulr>>): void {
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

  protected updateForm(region: IRegionAngulr): void {
    this.region = region;
    this.regionFormService.resetForm(this.editForm, region);
  }
}
