import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAplicacion } from '../aplicacion.model';
import { AplicacionService } from '../service/aplicacion.service';

const aplicacionResolve = (route: ActivatedRouteSnapshot): Observable<null | IAplicacion> => {
  const id = route.params.id;
  if (id) {
    return inject(AplicacionService)
      .find(id)
      .pipe(
        mergeMap((aplicacion: HttpResponse<IAplicacion>) => {
          if (aplicacion.body) {
            return of(aplicacion.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default aplicacionResolve;
