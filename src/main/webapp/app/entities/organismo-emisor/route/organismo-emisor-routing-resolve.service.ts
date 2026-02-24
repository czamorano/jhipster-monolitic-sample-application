import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrganismoEmisor } from '../organismo-emisor.model';
import { OrganismoEmisorService } from '../service/organismo-emisor.service';

const organismoEmisorResolve = (route: ActivatedRouteSnapshot): Observable<null | IOrganismoEmisor> => {
  const id = route.params.id;
  if (id) {
    return inject(OrganismoEmisorService)
      .find(id)
      .pipe(
        mergeMap((organismoEmisor: HttpResponse<IOrganismoEmisor>) => {
          if (organismoEmisor.body) {
            return of(organismoEmisor.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default organismoEmisorResolve;
