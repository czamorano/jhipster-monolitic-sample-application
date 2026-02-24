import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILocationAngulr } from '../location-angulr.model';
import { LocationAngulrService } from '../service/location-angulr.service';

const locationResolve = (route: ActivatedRouteSnapshot): Observable<null | ILocationAngulr> => {
  const id = route.params.id;
  if (id) {
    return inject(LocationAngulrService)
      .find(id)
      .pipe(
        mergeMap((location: HttpResponse<ILocationAngulr>) => {
          if (location.body) {
            return of(location.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default locationResolve;
