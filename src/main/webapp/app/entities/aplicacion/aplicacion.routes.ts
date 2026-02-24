import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import AplicacionResolve from './route/aplicacion-routing-resolve.service';

const aplicacionRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/aplicacion').then(m => m.Aplicacion),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/aplicacion-detail').then(m => m.AplicacionDetail),
    resolve: {
      aplicacion: AplicacionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/aplicacion-update').then(m => m.AplicacionUpdate),
    resolve: {
      aplicacion: AplicacionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/aplicacion-update').then(m => m.AplicacionUpdate),
    resolve: {
      aplicacion: AplicacionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default aplicacionRoute;
