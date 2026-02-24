import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IAplicacion, NewAplicacion } from '../aplicacion.model';

export type PartialUpdateAplicacion = Partial<IAplicacion> & Pick<IAplicacion, 'id'>;

export type EntityResponseType = HttpResponse<IAplicacion>;
export type EntityArrayResponseType = HttpResponse<IAplicacion[]>;

@Injectable({ providedIn: 'root' })
export class AplicacionService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/aplicacions');

  create(aplicacion: NewAplicacion): Observable<EntityResponseType> {
    return this.http.post<IAplicacion>(this.resourceUrl, aplicacion, { observe: 'response' });
  }

  update(aplicacion: IAplicacion): Observable<EntityResponseType> {
    return this.http.put<IAplicacion>(`${this.resourceUrl}/${encodeURIComponent(this.getAplicacionIdentifier(aplicacion))}`, aplicacion, {
      observe: 'response',
    });
  }

  partialUpdate(aplicacion: PartialUpdateAplicacion): Observable<EntityResponseType> {
    return this.http.patch<IAplicacion>(`${this.resourceUrl}/${encodeURIComponent(this.getAplicacionIdentifier(aplicacion))}`, aplicacion, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAplicacion>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAplicacion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  getAplicacionIdentifier(aplicacion: Pick<IAplicacion, 'id'>): number {
    return aplicacion.id;
  }

  compareAplicacion(o1: Pick<IAplicacion, 'id'> | null, o2: Pick<IAplicacion, 'id'> | null): boolean {
    return o1 && o2 ? this.getAplicacionIdentifier(o1) === this.getAplicacionIdentifier(o2) : o1 === o2;
  }

  addAplicacionToCollectionIfMissing<Type extends Pick<IAplicacion, 'id'>>(
    aplicacionCollection: Type[],
    ...aplicacionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const aplicacions: Type[] = aplicacionsToCheck.filter(isPresent);
    if (aplicacions.length > 0) {
      const aplicacionCollectionIdentifiers = aplicacionCollection.map(aplicacionItem => this.getAplicacionIdentifier(aplicacionItem));
      const aplicacionsToAdd = aplicacions.filter(aplicacionItem => {
        const aplicacionIdentifier = this.getAplicacionIdentifier(aplicacionItem);
        if (aplicacionCollectionIdentifiers.includes(aplicacionIdentifier)) {
          return false;
        }
        aplicacionCollectionIdentifiers.push(aplicacionIdentifier);
        return true;
      });
      return [...aplicacionsToAdd, ...aplicacionCollection];
    }
    return aplicacionCollection;
  }
}
