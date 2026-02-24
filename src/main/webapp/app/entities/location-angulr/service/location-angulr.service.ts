import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ILocationAngulr, NewLocationAngulr } from '../location-angulr.model';

export type PartialUpdateLocationAngulr = Partial<ILocationAngulr> & Pick<ILocationAngulr, 'id'>;

export type EntityResponseType = HttpResponse<ILocationAngulr>;
export type EntityArrayResponseType = HttpResponse<ILocationAngulr[]>;

@Injectable({ providedIn: 'root' })
export class LocationAngulrService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/locations');

  create(location: NewLocationAngulr): Observable<EntityResponseType> {
    return this.http.post<ILocationAngulr>(this.resourceUrl, location, { observe: 'response' });
  }

  update(location: ILocationAngulr): Observable<EntityResponseType> {
    return this.http.put<ILocationAngulr>(
      `${this.resourceUrl}/${encodeURIComponent(this.getLocationAngulrIdentifier(location))}`,
      location,
      { observe: 'response' },
    );
  }

  partialUpdate(location: PartialUpdateLocationAngulr): Observable<EntityResponseType> {
    return this.http.patch<ILocationAngulr>(
      `${this.resourceUrl}/${encodeURIComponent(this.getLocationAngulrIdentifier(location))}`,
      location,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILocationAngulr>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILocationAngulr[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  getLocationAngulrIdentifier(location: Pick<ILocationAngulr, 'id'>): number {
    return location.id;
  }

  compareLocationAngulr(o1: Pick<ILocationAngulr, 'id'> | null, o2: Pick<ILocationAngulr, 'id'> | null): boolean {
    return o1 && o2 ? this.getLocationAngulrIdentifier(o1) === this.getLocationAngulrIdentifier(o2) : o1 === o2;
  }

  addLocationAngulrToCollectionIfMissing<Type extends Pick<ILocationAngulr, 'id'>>(
    locationCollection: Type[],
    ...locationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const locations: Type[] = locationsToCheck.filter(isPresent);
    if (locations.length > 0) {
      const locationCollectionIdentifiers = locationCollection.map(locationItem => this.getLocationAngulrIdentifier(locationItem));
      const locationsToAdd = locations.filter(locationItem => {
        const locationIdentifier = this.getLocationAngulrIdentifier(locationItem);
        if (locationCollectionIdentifiers.includes(locationIdentifier)) {
          return false;
        }
        locationCollectionIdentifiers.push(locationIdentifier);
        return true;
      });
      return [...locationsToAdd, ...locationCollection];
    }
    return locationCollection;
  }
}
