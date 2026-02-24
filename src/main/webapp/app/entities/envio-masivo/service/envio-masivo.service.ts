import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IEnvioMasivo, NewEnvioMasivo } from '../envio-masivo.model';

export type PartialUpdateEnvioMasivo = Partial<IEnvioMasivo> & Pick<IEnvioMasivo, 'id'>;

type RestOf<T extends IEnvioMasivo | NewEnvioMasivo> = Omit<T, 'comienzo' | 'fin'> & {
  comienzo?: string | null;
  fin?: string | null;
};

export type RestEnvioMasivo = RestOf<IEnvioMasivo>;

export type NewRestEnvioMasivo = RestOf<NewEnvioMasivo>;

export type PartialUpdateRestEnvioMasivo = RestOf<PartialUpdateEnvioMasivo>;

export type EntityResponseType = HttpResponse<IEnvioMasivo>;
export type EntityArrayResponseType = HttpResponse<IEnvioMasivo[]>;

@Injectable({ providedIn: 'root' })
export class EnvioMasivoService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/envio-masivos');

  create(envioMasivo: NewEnvioMasivo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(envioMasivo);
    return this.http
      .post<RestEnvioMasivo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(envioMasivo: IEnvioMasivo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(envioMasivo);
    return this.http
      .put<RestEnvioMasivo>(`${this.resourceUrl}/${encodeURIComponent(this.getEnvioMasivoIdentifier(envioMasivo))}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(envioMasivo: PartialUpdateEnvioMasivo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(envioMasivo);
    return this.http
      .patch<RestEnvioMasivo>(`${this.resourceUrl}/${encodeURIComponent(this.getEnvioMasivoIdentifier(envioMasivo))}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEnvioMasivo>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEnvioMasivo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  getEnvioMasivoIdentifier(envioMasivo: Pick<IEnvioMasivo, 'id'>): number {
    return envioMasivo.id;
  }

  compareEnvioMasivo(o1: Pick<IEnvioMasivo, 'id'> | null, o2: Pick<IEnvioMasivo, 'id'> | null): boolean {
    return o1 && o2 ? this.getEnvioMasivoIdentifier(o1) === this.getEnvioMasivoIdentifier(o2) : o1 === o2;
  }

  addEnvioMasivoToCollectionIfMissing<Type extends Pick<IEnvioMasivo, 'id'>>(
    envioMasivoCollection: Type[],
    ...envioMasivosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const envioMasivos: Type[] = envioMasivosToCheck.filter(isPresent);
    if (envioMasivos.length > 0) {
      const envioMasivoCollectionIdentifiers = envioMasivoCollection.map(envioMasivoItem => this.getEnvioMasivoIdentifier(envioMasivoItem));
      const envioMasivosToAdd = envioMasivos.filter(envioMasivoItem => {
        const envioMasivoIdentifier = this.getEnvioMasivoIdentifier(envioMasivoItem);
        if (envioMasivoCollectionIdentifiers.includes(envioMasivoIdentifier)) {
          return false;
        }
        envioMasivoCollectionIdentifiers.push(envioMasivoIdentifier);
        return true;
      });
      return [...envioMasivosToAdd, ...envioMasivoCollection];
    }
    return envioMasivoCollection;
  }

  protected convertDateFromClient<T extends IEnvioMasivo | NewEnvioMasivo | PartialUpdateEnvioMasivo>(envioMasivo: T): RestOf<T> {
    return {
      ...envioMasivo,
      comienzo: envioMasivo.comienzo?.toJSON() ?? null,
      fin: envioMasivo.fin?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEnvioMasivo: RestEnvioMasivo): IEnvioMasivo {
    return {
      ...restEnvioMasivo,
      comienzo: restEnvioMasivo.comienzo ? dayjs(restEnvioMasivo.comienzo) : undefined,
      fin: restEnvioMasivo.fin ? dayjs(restEnvioMasivo.fin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEnvioMasivo>): HttpResponse<IEnvioMasivo> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEnvioMasivo[]>): HttpResponse<IEnvioMasivo[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
