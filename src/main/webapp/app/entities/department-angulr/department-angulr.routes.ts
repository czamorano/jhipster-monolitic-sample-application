import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import DepartmentAngulrResolve from './route/department-angulr-routing-resolve.service';

const departmentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/department-angulr').then(m => m.DepartmentAngulr),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/department-angulr-detail').then(m => m.DepartmentAngulrDetail),
    resolve: {
      department: DepartmentAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/department-angulr-update').then(m => m.DepartmentAngulrUpdate),
    resolve: {
      department: DepartmentAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/department-angulr-update').then(m => m.DepartmentAngulrUpdate),
    resolve: {
      department: DepartmentAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default departmentRoute;
