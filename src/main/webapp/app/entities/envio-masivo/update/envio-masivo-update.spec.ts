import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAplicacion } from 'app/entities/aplicacion/aplicacion.model';
import { AplicacionService } from 'app/entities/aplicacion/service/aplicacion.service';
import { IOrganismoEmisor } from 'app/entities/organismo-emisor/organismo-emisor.model';
import { OrganismoEmisorService } from 'app/entities/organismo-emisor/service/organismo-emisor.service';
import { IEnvioMasivo } from '../envio-masivo.model';
import { EnvioMasivoService } from '../service/envio-masivo.service';

import { EnvioMasivoFormService } from './envio-masivo-form.service';
import { EnvioMasivoUpdate } from './envio-masivo-update';

describe('EnvioMasivo Management Update Component', () => {
  let comp: EnvioMasivoUpdate;
  let fixture: ComponentFixture<EnvioMasivoUpdate>;
  let activatedRoute: ActivatedRoute;
  let envioMasivoFormService: EnvioMasivoFormService;
  let envioMasivoService: EnvioMasivoService;
  let aplicacionService: AplicacionService;
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

    fixture = TestBed.createComponent(EnvioMasivoUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    envioMasivoFormService = TestBed.inject(EnvioMasivoFormService);
    envioMasivoService = TestBed.inject(EnvioMasivoService);
    aplicacionService = TestBed.inject(AplicacionService);
    organismoEmisorService = TestBed.inject(OrganismoEmisorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Aplicacion query and add missing value', () => {
      const envioMasivo: IEnvioMasivo = { id: 7434 };
      const aplicacion: IAplicacion = { id: 7402 };
      envioMasivo.aplicacion = aplicacion;

      const aplicacionCollection: IAplicacion[] = [{ id: 7402 }];
      vitest.spyOn(aplicacionService, 'query').mockReturnValue(of(new HttpResponse({ body: aplicacionCollection })));
      const additionalAplicacions = [aplicacion];
      const expectedCollection: IAplicacion[] = [...additionalAplicacions, ...aplicacionCollection];
      vitest.spyOn(aplicacionService, 'addAplicacionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ envioMasivo });
      comp.ngOnInit();

      expect(aplicacionService.query).toHaveBeenCalled();
      expect(aplicacionService.addAplicacionToCollectionIfMissing).toHaveBeenCalledWith(
        aplicacionCollection,
        ...additionalAplicacions.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.aplicacionsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call OrganismoEmisor query and add missing value', () => {
      const envioMasivo: IEnvioMasivo = { id: 7434 };
      const organismoEmisor: IOrganismoEmisor = { id: 10004 };
      envioMasivo.organismoEmisor = organismoEmisor;

      const organismoEmisorCollection: IOrganismoEmisor[] = [{ id: 10004 }];
      vitest.spyOn(organismoEmisorService, 'query').mockReturnValue(of(new HttpResponse({ body: organismoEmisorCollection })));
      const additionalOrganismoEmisors = [organismoEmisor];
      const expectedCollection: IOrganismoEmisor[] = [...additionalOrganismoEmisors, ...organismoEmisorCollection];
      vitest.spyOn(organismoEmisorService, 'addOrganismoEmisorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ envioMasivo });
      comp.ngOnInit();

      expect(organismoEmisorService.query).toHaveBeenCalled();
      expect(organismoEmisorService.addOrganismoEmisorToCollectionIfMissing).toHaveBeenCalledWith(
        organismoEmisorCollection,
        ...additionalOrganismoEmisors.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.organismoEmisorsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const envioMasivo: IEnvioMasivo = { id: 7434 };
      const aplicacion: IAplicacion = { id: 7402 };
      envioMasivo.aplicacion = aplicacion;
      const organismoEmisor: IOrganismoEmisor = { id: 10004 };
      envioMasivo.organismoEmisor = organismoEmisor;

      activatedRoute.data = of({ envioMasivo });
      comp.ngOnInit();

      expect(comp.aplicacionsSharedCollection()).toContainEqual(aplicacion);
      expect(comp.organismoEmisorsSharedCollection()).toContainEqual(organismoEmisor);
      expect(comp.envioMasivo).toEqual(envioMasivo);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnvioMasivo>>();
      const envioMasivo = { id: 27737 };
      vitest.spyOn(envioMasivoFormService, 'getEnvioMasivo').mockReturnValue(envioMasivo);
      vitest.spyOn(envioMasivoService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ envioMasivo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: envioMasivo }));
      saveSubject.complete();

      // THEN
      expect(envioMasivoFormService.getEnvioMasivo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(envioMasivoService.update).toHaveBeenCalledWith(expect.objectContaining(envioMasivo));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnvioMasivo>>();
      const envioMasivo = { id: 27737 };
      vitest.spyOn(envioMasivoFormService, 'getEnvioMasivo').mockReturnValue({ id: null });
      vitest.spyOn(envioMasivoService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ envioMasivo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: envioMasivo }));
      saveSubject.complete();

      // THEN
      expect(envioMasivoFormService.getEnvioMasivo).toHaveBeenCalled();
      expect(envioMasivoService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnvioMasivo>>();
      const envioMasivo = { id: 27737 };
      vitest.spyOn(envioMasivoService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ envioMasivo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(envioMasivoService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAplicacion', () => {
      it('should forward to aplicacionService', () => {
        const entity = { id: 7402 };
        const entity2 = { id: 30796 };
        vitest.spyOn(aplicacionService, 'compareAplicacion');
        comp.compareAplicacion(entity, entity2);
        expect(aplicacionService.compareAplicacion).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareOrganismoEmisor', () => {
      it('should forward to organismoEmisorService', () => {
        const entity = { id: 10004 };
        const entity2 = { id: 27700 };
        vitest.spyOn(organismoEmisorService, 'compareOrganismoEmisor');
        comp.compareOrganismoEmisor(entity, entity2);
        expect(organismoEmisorService.compareOrganismoEmisor).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
