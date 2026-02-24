import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IRegionAngulr, NewRegionAngulr } from '../region-angulr.model';

export type PartialUpdateRegionAngulr = Partial<IRegionAngulr> & Pick<IRegionAngulr, 'id'>;

export type EntityResponseType = HttpResponse<IRegionAngulr>;
export type EntityArrayResponseType = HttpResponse<IRegionAngulr[]>;

@Injectable({ providedIn: 'root' })
export class RegionAngulrService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/regions');

  create(region: NewRegionAngulr): Observable<EntityResponseType> {
    return this.http.post<IRegionAngulr>(this.resourceUrl, region, { observe: 'response' });
  }

  update(region: IRegionAngulr): Observable<EntityResponseType> {
    return this.http.put<IRegionAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getRegionAngulrIdentifier(region))}`, region, {
      observe: 'response',
    });
  }

  partialUpdate(region: PartialUpdateRegionAngulr): Observable<EntityResponseType> {
    return this.http.patch<IRegionAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getRegionAngulrIdentifier(region))}`, region, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRegionAngulr>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRegionAngulr[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  getRegionAngulrIdentifier(region: Pick<IRegionAngulr, 'id'>): number {
    return region.id;
  }

  compareRegionAngulr(o1: Pick<IRegionAngulr, 'id'> | null, o2: Pick<IRegionAngulr, 'id'> | null): boolean {
    return o1 && o2 ? this.getRegionAngulrIdentifier(o1) === this.getRegionAngulrIdentifier(o2) : o1 === o2;
  }

  addRegionAngulrToCollectionIfMissing<Type extends Pick<IRegionAngulr, 'id'>>(
    regionCollection: Type[],
    ...regionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const regions: Type[] = regionsToCheck.filter(isPresent);
    if (regions.length > 0) {
      const regionCollectionIdentifiers = regionCollection.map(regionItem => this.getRegionAngulrIdentifier(regionItem));
      const regionsToAdd = regions.filter(regionItem => {
        const regionIdentifier = this.getRegionAngulrIdentifier(regionItem);
        if (regionCollectionIdentifiers.includes(regionIdentifier)) {
          return false;
        }
        regionCollectionIdentifiers.push(regionIdentifier);
        return true;
      });
      return [...regionsToAdd, ...regionCollection];
    }
    return regionCollection;
  }
}
