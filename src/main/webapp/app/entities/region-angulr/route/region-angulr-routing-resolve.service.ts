import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRegionAngulr } from '../region-angulr.model';
import { RegionAngulrService } from '../service/region-angulr.service';

const regionResolve = (route: ActivatedRouteSnapshot): Observable<null | IRegionAngulr> => {
  const id = route.params.id;
  if (id) {
    return inject(RegionAngulrService)
      .find(id)
      .pipe(
        mergeMap((region: HttpResponse<IRegionAngulr>) => {
          if (region.body) {
            return of(region.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default regionResolve;
