import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import TaskAngulrResolve from './route/task-angulr-routing-resolve.service';

const taskRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/task-angulr').then(m => m.TaskAngulr),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/task-angulr-detail').then(m => m.TaskAngulrDetail),
    resolve: {
      task: TaskAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/task-angulr-update').then(m => m.TaskAngulrUpdate),
    resolve: {
      task: TaskAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/task-angulr-update').then(m => m.TaskAngulrUpdate),
    resolve: {
      task: TaskAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default taskRoute;
