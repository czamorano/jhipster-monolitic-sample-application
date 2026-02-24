import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { JobHistoryAngulrDetail } from './job-history-angulr-detail';

describe('JobHistoryAngulr Management Detail Component', () => {
  let comp: JobHistoryAngulrDetail;
  let fixture: ComponentFixture<JobHistoryAngulrDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./job-history-angulr-detail').then(m => m.JobHistoryAngulrDetail),
              resolve: { jobHistory: () => of({ id: 18667 }) },
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
    fixture = TestBed.createComponent(JobHistoryAngulrDetail);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load jobHistory on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JobHistoryAngulrDetail);

      // THEN
      expect(instance.jobHistory()).toEqual(expect.objectContaining({ id: 18667 }));
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
