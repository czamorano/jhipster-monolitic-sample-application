import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobAngulr } from '../job-angulr.model';
import { JobAngulrService } from '../service/job-angulr.service';

const jobResolve = (route: ActivatedRouteSnapshot): Observable<null | IJobAngulr> => {
  const id = route.params.id;
  if (id) {
    return inject(JobAngulrService)
      .find(id)
      .pipe(
        mergeMap((job: HttpResponse<IJobAngulr>) => {
          if (job.body) {
            return of(job.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default jobResolve;
