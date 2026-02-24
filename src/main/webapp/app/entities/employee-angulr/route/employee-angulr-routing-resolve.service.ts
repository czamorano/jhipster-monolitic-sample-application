import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmployeeAngulr } from '../employee-angulr.model';
import { EmployeeAngulrService } from '../service/employee-angulr.service';

const employeeResolve = (route: ActivatedRouteSnapshot): Observable<null | IEmployeeAngulr> => {
  const id = route.params.id;
  if (id) {
    return inject(EmployeeAngulrService)
      .find(id)
      .pipe(
        mergeMap((employee: HttpResponse<IEmployeeAngulr>) => {
          if (employee.body) {
            return of(employee.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default employeeResolve;
