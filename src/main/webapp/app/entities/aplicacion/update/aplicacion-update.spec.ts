import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAplicacion } from '../aplicacion.model';
import { AplicacionService } from '../service/aplicacion.service';

import { AplicacionFormService } from './aplicacion-form.service';
import { AplicacionUpdate } from './aplicacion-update';

describe('Aplicacion Management Update Component', () => {
  let comp: AplicacionUpdate;
  let fixture: ComponentFixture<AplicacionUpdate>;
  let activatedRoute: ActivatedRoute;
  let aplicacionFormService: AplicacionFormService;
  let aplicacionService: AplicacionService;

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

    fixture = TestBed.createComponent(AplicacionUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    aplicacionFormService = TestBed.inject(AplicacionFormService);
    aplicacionService = TestBed.inject(AplicacionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const aplicacion: IAplicacion = { id: 30796 };

      activatedRoute.data = of({ aplicacion });
      comp.ngOnInit();

      expect(comp.aplicacion).toEqual(aplicacion);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAplicacion>>();
      const aplicacion = { id: 7402 };
      vitest.spyOn(aplicacionFormService, 'getAplicacion').mockReturnValue(aplicacion);
      vitest.spyOn(aplicacionService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aplicacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: aplicacion }));
      saveSubject.complete();

      // THEN
      expect(aplicacionFormService.getAplicacion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(aplicacionService.update).toHaveBeenCalledWith(expect.objectContaining(aplicacion));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAplicacion>>();
      const aplicacion = { id: 7402 };
      vitest.spyOn(aplicacionFormService, 'getAplicacion').mockReturnValue({ id: null });
      vitest.spyOn(aplicacionService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aplicacion: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: aplicacion }));
      saveSubject.complete();

      // THEN
      expect(aplicacionFormService.getAplicacion).toHaveBeenCalled();
      expect(aplicacionService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAplicacion>>();
      const aplicacion = { id: 7402 };
      vitest.spyOn(aplicacionService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ aplicacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(aplicacionService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
