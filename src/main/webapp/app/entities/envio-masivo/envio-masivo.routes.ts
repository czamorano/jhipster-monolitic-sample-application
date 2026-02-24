import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import EnvioMasivoResolve from './route/envio-masivo-routing-resolve.service';

const envioMasivoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/envio-masivo').then(m => m.EnvioMasivo),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/envio-masivo-detail').then(m => m.EnvioMasivoDetail),
    resolve: {
      envioMasivo: EnvioMasivoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/envio-masivo-update').then(m => m.EnvioMasivoUpdate),
    resolve: {
      envioMasivo: EnvioMasivoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/envio-masivo-update').then(m => m.EnvioMasivoUpdate),
    resolve: {
      envioMasivo: EnvioMasivoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default envioMasivoRoute;
