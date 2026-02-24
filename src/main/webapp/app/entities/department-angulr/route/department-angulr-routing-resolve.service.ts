import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDepartmentAngulr } from '../department-angulr.model';
import { DepartmentAngulrService } from '../service/department-angulr.service';

const departmentResolve = (route: ActivatedRouteSnapshot): Observable<null | IDepartmentAngulr> => {
  const id = route.params.id;
  if (id) {
    return inject(DepartmentAngulrService)
      .find(id)
      .pipe(
        mergeMap((department: HttpResponse<IDepartmentAngulr>) => {
          if (department.body) {
            return of(department.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default departmentResolve;
