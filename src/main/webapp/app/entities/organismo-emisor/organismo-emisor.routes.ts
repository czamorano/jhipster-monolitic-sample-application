import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import OrganismoEmisorResolve from './route/organismo-emisor-routing-resolve.service';

const organismoEmisorRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/organismo-emisor').then(m => m.OrganismoEmisor),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/organismo-emisor-detail').then(m => m.OrganismoEmisorDetail),
    resolve: {
      organismoEmisor: OrganismoEmisorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/organismo-emisor-update').then(m => m.OrganismoEmisorUpdate),
    resolve: {
      organismoEmisor: OrganismoEmisorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/organismo-emisor-update').then(m => m.OrganismoEmisorUpdate),
    resolve: {
      organismoEmisor: OrganismoEmisorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default organismoEmisorRoute;
