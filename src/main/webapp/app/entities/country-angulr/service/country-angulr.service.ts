import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ICountryAngulr, NewCountryAngulr } from '../country-angulr.model';

export type PartialUpdateCountryAngulr = Partial<ICountryAngulr> & Pick<ICountryAngulr, 'id'>;

export type EntityResponseType = HttpResponse<ICountryAngulr>;
export type EntityArrayResponseType = HttpResponse<ICountryAngulr[]>;

@Injectable({ providedIn: 'root' })
export class CountryAngulrService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/countries');

  create(country: NewCountryAngulr): Observable<EntityResponseType> {
    return this.http.post<ICountryAngulr>(this.resourceUrl, country, { observe: 'response' });
  }

  update(country: ICountryAngulr): Observable<EntityResponseType> {
    return this.http.put<ICountryAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getCountryAngulrIdentifier(country))}`, country, {
      observe: 'response',
    });
  }

  partialUpdate(country: PartialUpdateCountryAngulr): Observable<EntityResponseType> {
    return this.http.patch<ICountryAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getCountryAngulrIdentifier(country))}`, country, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICountryAngulr>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICountryAngulr[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  getCountryAngulrIdentifier(country: Pick<ICountryAngulr, 'id'>): number {
    return country.id;
  }

  compareCountryAngulr(o1: Pick<ICountryAngulr, 'id'> | null, o2: Pick<ICountryAngulr, 'id'> | null): boolean {
    return o1 && o2 ? this.getCountryAngulrIdentifier(o1) === this.getCountryAngulrIdentifier(o2) : o1 === o2;
  }

  addCountryAngulrToCollectionIfMissing<Type extends Pick<ICountryAngulr, 'id'>>(
    countryCollection: Type[],
    ...countriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const countries: Type[] = countriesToCheck.filter(isPresent);
    if (countries.length > 0) {
      const countryCollectionIdentifiers = countryCollection.map(countryItem => this.getCountryAngulrIdentifier(countryItem));
      const countriesToAdd = countries.filter(countryItem => {
        const countryIdentifier = this.getCountryAngulrIdentifier(countryItem);
        if (countryCollectionIdentifiers.includes(countryIdentifier)) {
          return false;
        }
        countryCollectionIdentifiers.push(countryIdentifier);
        return true;
      });
      return [...countriesToAdd, ...countryCollection];
    }
    return countryCollection;
  }
}
