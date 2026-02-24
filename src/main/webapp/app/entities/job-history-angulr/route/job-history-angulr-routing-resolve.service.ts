import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobHistoryAngulr } from '../job-history-angulr.model';
import { JobHistoryAngulrService } from '../service/job-history-angulr.service';

const jobHistoryResolve = (route: ActivatedRouteSnapshot): Observable<null | IJobHistoryAngulr> => {
  const id = route.params.id;
  if (id) {
    return inject(JobHistoryAngulrService)
      .find(id)
      .pipe(
        mergeMap((jobHistory: HttpResponse<IJobHistoryAngulr>) => {
          if (jobHistory.body) {
            return of(jobHistory.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default jobHistoryResolve;
