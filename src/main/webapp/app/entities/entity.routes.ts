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
  {
    path: 'region-angulr',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.region.home.title' },
    loadChildren: () => import('./region-angulr/region-angulr.routes'),
  },
  {
    path: 'country-angulr',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.country.home.title' },
    loadChildren: () => import('./country-angulr/country-angulr.routes'),
  },
  {
    path: 'location-angulr',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.location.home.title' },
    loadChildren: () => import('./location-angulr/location-angulr.routes'),
  },
  {
    path: 'department-angulr',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.department.home.title' },
    loadChildren: () => import('./department-angulr/department-angulr.routes'),
  },
  {
    path: 'task-angulr',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.task.home.title' },
    loadChildren: () => import('./task-angulr/task-angulr.routes'),
  },
  {
    path: 'employee-angulr',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.employee.home.title' },
    loadChildren: () => import('./employee-angulr/employee-angulr.routes'),
  },
  {
    path: 'job-angulr',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.job.home.title' },
    loadChildren: () => import('./job-angulr/job-angulr.routes'),
  },
  {
    path: 'job-history-angulr',
    data: { pageTitle: 'jhipsterMonoliticSampleApplicationApp.jobHistory.home.title' },
    loadChildren: () => import('./job-history-angulr/job-history-angulr.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
