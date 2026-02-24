import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IOrganismoEmisor, NewOrganismoEmisor } from '../organismo-emisor.model';

export type PartialUpdateOrganismoEmisor = Partial<IOrganismoEmisor> & Pick<IOrganismoEmisor, 'id'>;

export type EntityResponseType = HttpResponse<IOrganismoEmisor>;
export type EntityArrayResponseType = HttpResponse<IOrganismoEmisor[]>;

@Injectable({ providedIn: 'root' })
export class OrganismoEmisorService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organismo-emisors');

  create(organismoEmisor: NewOrganismoEmisor): Observable<EntityResponseType> {
    return this.http.post<IOrganismoEmisor>(this.resourceUrl, organismoEmisor, { observe: 'response' });
  }

  update(organismoEmisor: IOrganismoEmisor): Observable<EntityResponseType> {
    return this.http.put<IOrganismoEmisor>(
      `${this.resourceUrl}/${encodeURIComponent(this.getOrganismoEmisorIdentifier(organismoEmisor))}`,
      organismoEmisor,
      { observe: 'response' },
    );
  }

  partialUpdate(organismoEmisor: PartialUpdateOrganismoEmisor): Observable<EntityResponseType> {
    return this.http.patch<IOrganismoEmisor>(
      `${this.resourceUrl}/${encodeURIComponent(this.getOrganismoEmisorIdentifier(organismoEmisor))}`,
      organismoEmisor,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrganismoEmisor>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrganismoEmisor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  getOrganismoEmisorIdentifier(organismoEmisor: Pick<IOrganismoEmisor, 'id'>): number {
    return organismoEmisor.id;
  }

  compareOrganismoEmisor(o1: Pick<IOrganismoEmisor, 'id'> | null, o2: Pick<IOrganismoEmisor, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrganismoEmisorIdentifier(o1) === this.getOrganismoEmisorIdentifier(o2) : o1 === o2;
  }

  addOrganismoEmisorToCollectionIfMissing<Type extends Pick<IOrganismoEmisor, 'id'>>(
    organismoEmisorCollection: Type[],
    ...organismoEmisorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const organismoEmisors: Type[] = organismoEmisorsToCheck.filter(isPresent);
    if (organismoEmisors.length > 0) {
      const organismoEmisorCollectionIdentifiers = organismoEmisorCollection.map(organismoEmisorItem =>
        this.getOrganismoEmisorIdentifier(organismoEmisorItem),
      );
      const organismoEmisorsToAdd = organismoEmisors.filter(organismoEmisorItem => {
        const organismoEmisorIdentifier = this.getOrganismoEmisorIdentifier(organismoEmisorItem);
        if (organismoEmisorCollectionIdentifiers.includes(organismoEmisorIdentifier)) {
          return false;
        }
        organismoEmisorCollectionIdentifiers.push(organismoEmisorIdentifier);
        return true;
      });
      return [...organismoEmisorsToAdd, ...organismoEmisorCollection];
    }
    return organismoEmisorCollection;
  }
}
