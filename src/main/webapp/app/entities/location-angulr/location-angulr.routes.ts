import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import LocationAngulrResolve from './route/location-angulr-routing-resolve.service';

const locationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/location-angulr').then(m => m.LocationAngulr),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/location-angulr-detail').then(m => m.LocationAngulrDetail),
    resolve: {
      location: LocationAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/location-angulr-update').then(m => m.LocationAngulrUpdate),
    resolve: {
      location: LocationAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/location-angulr-update').then(m => m.LocationAngulrUpdate),
    resolve: {
      location: LocationAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default locationRoute;
