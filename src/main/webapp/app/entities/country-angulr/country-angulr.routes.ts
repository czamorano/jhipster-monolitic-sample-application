import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import CountryAngulrResolve from './route/country-angulr-routing-resolve.service';

const countryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/country-angulr').then(m => m.CountryAngulr),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/country-angulr-detail').then(m => m.CountryAngulrDetail),
    resolve: {
      country: CountryAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/country-angulr-update').then(m => m.CountryAngulrUpdate),
    resolve: {
      country: CountryAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/country-angulr-update').then(m => m.CountryAngulrUpdate),
    resolve: {
      country: CountryAngulrResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default countryRoute;
