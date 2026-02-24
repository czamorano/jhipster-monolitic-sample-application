import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { OrganismoEmisorDetail } from './organismo-emisor-detail';

describe('OrganismoEmisor Management Detail Component', () => {
  let comp: OrganismoEmisorDetail;
  let fixture: ComponentFixture<OrganismoEmisorDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./organismo-emisor-detail').then(m => m.OrganismoEmisorDetail),
              resolve: { organismoEmisor: () => of({ id: 10004 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    });
    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faArrowLeft);
    library.addIcons(faPencilAlt);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismoEmisorDetail);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load organismoEmisor on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', OrganismoEmisorDetail);

      // THEN
      expect(instance.organismoEmisor()).toEqual(expect.objectContaining({ id: 10004 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      vitest.spyOn(window.history, 'back');
      comp.previousState();
      expect(globalThis.history.back).toHaveBeenCalled();
    });
  });
});
