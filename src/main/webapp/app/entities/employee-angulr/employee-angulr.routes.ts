import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import EmployeeAngulrResolve from './route/employee-angulr-routing-resolve.service';

const employeeRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/employee-angulr').then(m => m.EmployeeAngulr),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/employee-angulr-detail').then(m => m.EmployeeAngulrDetail),
    resolve: {
      employee: EmployeeAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/employee-angulr-update').then(m => m.EmployeeAngulrUpdate),
    resolve: {
      employee: EmployeeAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/employee-angulr-update').then(m => m.EmployeeAngulrUpdate),
    resolve: {
      employee: EmployeeAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default employeeRoute;
