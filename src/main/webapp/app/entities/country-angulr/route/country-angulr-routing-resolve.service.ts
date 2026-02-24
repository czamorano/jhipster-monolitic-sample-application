import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICountryAngulr } from '../country-angulr.model';
import { CountryAngulrService } from '../service/country-angulr.service';

const countryResolve = (route: ActivatedRouteSnapshot): Observable<null | ICountryAngulr> => {
  const id = route.params.id;
  if (id) {
    return inject(CountryAngulrService)
      .find(id)
      .pipe(
        mergeMap((country: HttpResponse<ICountryAngulr>) => {
          if (country.body) {
            return of(country.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default countryResolve;
