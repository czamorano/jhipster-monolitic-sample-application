import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IOrganismoEmisor } from '../organismo-emisor.model';
import { OrganismoEmisorService } from '../service/organismo-emisor.service';

import { OrganismoEmisorFormService } from './organismo-emisor-form.service';
import { OrganismoEmisorUpdate } from './organismo-emisor-update';

describe('OrganismoEmisor Management Update Component', () => {
  let comp: OrganismoEmisorUpdate;
  let fixture: ComponentFixture<OrganismoEmisorUpdate>;
  let activatedRoute: ActivatedRoute;
  let organismoEmisorFormService: OrganismoEmisorFormService;
  let organismoEmisorService: OrganismoEmisorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(OrganismoEmisorUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organismoEmisorFormService = TestBed.inject(OrganismoEmisorFormService);
    organismoEmisorService = TestBed.inject(OrganismoEmisorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const organismoEmisor: IOrganismoEmisor = { id: 27700 };

      activatedRoute.data = of({ organismoEmisor });
      comp.ngOnInit();

      expect(comp.organismoEmisor).toEqual(organismoEmisor);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrganismoEmisor>>();
      const organismoEmisor = { id: 10004 };
      vitest.spyOn(organismoEmisorFormService, 'getOrganismoEmisor').mockReturnValue(organismoEmisor);
      vitest.spyOn(organismoEmisorService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organismoEmisor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organismoEmisor }));
      saveSubject.complete();

      // THEN
      expect(organismoEmisorFormService.getOrganismoEmisor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(organismoEmisorService.update).toHaveBeenCalledWith(expect.objectContaining(organismoEmisor));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrganismoEmisor>>();
      const organismoEmisor = { id: 10004 };
      vitest.spyOn(organismoEmisorFormService, 'getOrganismoEmisor').mockReturnValue({ id: null });
      vitest.spyOn(organismoEmisorService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organismoEmisor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organismoEmisor }));
      saveSubject.complete();

      // THEN
      expect(organismoEmisorFormService.getOrganismoEmisor).toHaveBeenCalled();
      expect(organismoEmisorService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrganismoEmisor>>();
      const organismoEmisor = { id: 10004 };
      vitest.spyOn(organismoEmisorService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organismoEmisor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(organismoEmisorService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
