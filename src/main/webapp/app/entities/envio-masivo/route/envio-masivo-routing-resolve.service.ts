import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEnvioMasivo } from '../envio-masivo.model';
import { EnvioMasivoService } from '../service/envio-masivo.service';

const envioMasivoResolve = (route: ActivatedRouteSnapshot): Observable<null | IEnvioMasivo> => {
  const id = route.params.id;
  if (id) {
    return inject(EnvioMasivoService)
      .find(id)
      .pipe(
        mergeMap((envioMasivo: HttpResponse<IEnvioMasivo>) => {
          if (envioMasivo.body) {
            return of(envioMasivo.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default envioMasivoResolve;
