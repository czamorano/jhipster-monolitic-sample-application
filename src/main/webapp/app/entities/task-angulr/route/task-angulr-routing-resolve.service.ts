import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { TaskAngulrService } from '../service/task-angulr.service';
import { ITaskAngulr } from '../task-angulr.model';

const taskResolve = (route: ActivatedRouteSnapshot): Observable<null | ITaskAngulr> => {
  const id = route.params.id;
  if (id) {
    return inject(TaskAngulrService)
      .find(id)
      .pipe(
        mergeMap((task: HttpResponse<ITaskAngulr>) => {
          if (task.body) {
            return of(task.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default taskResolve;
