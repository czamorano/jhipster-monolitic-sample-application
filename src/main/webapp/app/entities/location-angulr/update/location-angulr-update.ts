import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICountryAngulr } from 'app/entities/country-angulr/country-angulr.model';
import { CountryAngulrService } from 'app/entities/country-angulr/service/country-angulr.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ILocationAngulr } from '../location-angulr.model';
import { LocationAngulrService } from '../service/location-angulr.service';

import { LocationAngulrFormGroup, LocationAngulrFormService } from './location-angulr-form.service';

@Component({
  selector: 'jhi-location-angulr-update',
  templateUrl: './location-angulr-update.html',
  imports: [TranslateDirective, TranslateModule, NgbModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class LocationAngulrUpdate implements OnInit {
  isSaving = signal(false);
  location: ILocationAngulr | null = null;

  countriesCollection = signal<ICountryAngulr[]>([]);

  protected locationService = inject(LocationAngulrService);
  protected locationFormService = inject(LocationAngulrFormService);
  protected countryService = inject(CountryAngulrService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: LocationAngulrFormGroup = this.locationFormService.createLocationAngulrFormGroup();

  compareCountryAngulr = (o1: ICountryAngulr | null, o2: ICountryAngulr | null): boolean =>
    this.countryService.compareCountryAngulr(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.location = location;
      if (location) {
        this.updateForm(location);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const location = this.locationFormService.getLocationAngulr(this.editForm);
    if (location.id === null) {
      this.subscribeToSaveResponse(this.locationService.create(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.update(location));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocationAngulr>>): void {
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

  protected updateForm(location: ILocationAngulr): void {
    this.location = location;
    this.locationFormService.resetForm(this.editForm, location);

    this.countriesCollection.set(
      this.countryService.addCountryAngulrToCollectionIfMissing<ICountryAngulr>(this.countriesCollection(), location.country),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.countryService
      .query({ filter: 'location-is-null' })
      .pipe(map((res: HttpResponse<ICountryAngulr[]>) => res.body ?? []))
      .pipe(
        map((countries: ICountryAngulr[]) =>
          this.countryService.addCountryAngulrToCollectionIfMissing<ICountryAngulr>(countries, this.location?.country),
        ),
      )
      .subscribe((countries: ICountryAngulr[]) => this.countriesCollection.set(countries));
  }
}
