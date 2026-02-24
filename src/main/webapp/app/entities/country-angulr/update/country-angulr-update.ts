import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRegionAngulr } from 'app/entities/region-angulr/region-angulr.model';
import { RegionAngulrService } from 'app/entities/region-angulr/service/region-angulr.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ICountryAngulr } from '../country-angulr.model';
import { CountryAngulrService } from '../service/country-angulr.service';

import { CountryAngulrFormGroup, CountryAngulrFormService } from './country-angulr-form.service';

@Component({
  selector: 'jhi-country-angulr-update',
  templateUrl: './country-angulr-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class CountryAngulrUpdate implements OnInit {
  isSaving = signal(false);
  country: ICountryAngulr | null = null;

  regionsCollection = signal<IRegionAngulr[]>([]);

  protected countryService = inject(CountryAngulrService);
  protected countryFormService = inject(CountryAngulrFormService);
  protected regionService = inject(RegionAngulrService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CountryAngulrFormGroup = this.countryFormService.createCountryAngulrFormGroup();

  compareRegionAngulr = (o1: IRegionAngulr | null, o2: IRegionAngulr | null): boolean => this.regionService.compareRegionAngulr(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ country }) => {
      this.country = country;
      if (country) {
        this.updateForm(country);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const country = this.countryFormService.getCountryAngulr(this.editForm);
    if (country.id === null) {
      this.subscribeToSaveResponse(this.countryService.create(country));
    } else {
      this.subscribeToSaveResponse(this.countryService.update(country));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICountryAngulr>>): void {
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

  protected updateForm(country: ICountryAngulr): void {
    this.country = country;
    this.countryFormService.resetForm(this.editForm, country);

    this.regionsCollection.set(
      this.regionService.addRegionAngulrToCollectionIfMissing<IRegionAngulr>(this.regionsCollection(), country.region),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.regionService
      .query({ filter: 'country-is-null' })
      .pipe(map((res: HttpResponse<IRegionAngulr[]>) => res.body ?? []))
      .pipe(
        map((regions: IRegionAngulr[]) =>
          this.regionService.addRegionAngulrToCollectionIfMissing<IRegionAngulr>(regions, this.country?.region),
        ),
      )
      .subscribe((regions: IRegionAngulr[]) => this.regionsCollection.set(regions));
  }
}
