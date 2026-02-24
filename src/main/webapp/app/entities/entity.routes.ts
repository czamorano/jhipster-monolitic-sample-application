import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'aplicacion',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.aplicacion.home.title' },
    loadChildren: () => import('./aplicacion/aplicacion.routes'),
  },
  {
    path: 'organismo-emisor',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.organismoEmisor.home.title' },
    loadChildren: () => import('./organismo-emisor/organismo-emisor.routes'),
  },
  {
    path: 'envio-masivo',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.envioMasivo.home.title' },
    loadChildren: () => import('./envio-masivo/envio-masivo.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
