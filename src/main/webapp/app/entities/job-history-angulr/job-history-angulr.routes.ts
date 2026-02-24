import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import JobHistoryAngulrResolve from './route/job-history-angulr-routing-resolve.service';

const jobHistoryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/job-history-angulr').then(m => m.JobHistoryAngulr),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/job-history-angulr-detail').then(m => m.JobHistoryAngulrDetail),
    resolve: {
      jobHistory: JobHistoryAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/job-history-angulr-update').then(m => m.JobHistoryAngulrUpdate),
    resolve: {
      jobHistory: JobHistoryAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/job-history-angulr-update').then(m => m.JobHistoryAngulrUpdate),
    resolve: {
      jobHistory: JobHistoryAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default jobHistoryRoute;
