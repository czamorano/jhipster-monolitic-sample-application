import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IJobHistoryAngulr, NewJobHistoryAngulr } from '../job-history-angulr.model';

export type PartialUpdateJobHistoryAngulr = Partial<IJobHistoryAngulr> & Pick<IJobHistoryAngulr, 'id'>;

type RestOf<T extends IJobHistoryAngulr | NewJobHistoryAngulr> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestJobHistoryAngulr = RestOf<IJobHistoryAngulr>;

export type NewRestJobHistoryAngulr = RestOf<NewJobHistoryAngulr>;

export type PartialUpdateRestJobHistoryAngulr = RestOf<PartialUpdateJobHistoryAngulr>;

export type EntityResponseType = HttpResponse<IJobHistoryAngulr>;
export type EntityArrayResponseType = HttpResponse<IJobHistoryAngulr[]>;

@Injectable({ providedIn: 'root' })
export class JobHistoryAngulrService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/job-histories');

  create(jobHistory: NewJobHistoryAngulr): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobHistory);
    return this.http
      .post<RestJobHistoryAngulr>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(jobHistory: IJobHistoryAngulr): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobHistory);
    return this.http
      .put<RestJobHistoryAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getJobHistoryAngulrIdentifier(jobHistory))}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(jobHistory: PartialUpdateJobHistoryAngulr): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobHistory);
    return this.http
      .patch<RestJobHistoryAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getJobHistoryAngulrIdentifier(jobHistory))}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestJobHistoryAngulr>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestJobHistoryAngulr[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  getJobHistoryAngulrIdentifier(jobHistory: Pick<IJobHistoryAngulr, 'id'>): number {
    return jobHistory.id;
  }

  compareJobHistoryAngulr(o1: Pick<IJobHistoryAngulr, 'id'> | null, o2: Pick<IJobHistoryAngulr, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobHistoryAngulrIdentifier(o1) === this.getJobHistoryAngulrIdentifier(o2) : o1 === o2;
  }

  addJobHistoryAngulrToCollectionIfMissing<Type extends Pick<IJobHistoryAngulr, 'id'>>(
    jobHistoryCollection: Type[],
    ...jobHistoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobHistories: Type[] = jobHistoriesToCheck.filter(isPresent);
    if (jobHistories.length > 0) {
      const jobHistoryCollectionIdentifiers = jobHistoryCollection.map(jobHistoryItem =>
        this.getJobHistoryAngulrIdentifier(jobHistoryItem),
      );
      const jobHistoriesToAdd = jobHistories.filter(jobHistoryItem => {
        const jobHistoryIdentifier = this.getJobHistoryAngulrIdentifier(jobHistoryItem);
        if (jobHistoryCollectionIdentifiers.includes(jobHistoryIdentifier)) {
          return false;
        }
        jobHistoryCollectionIdentifiers.push(jobHistoryIdentifier);
        return true;
      });
      return [...jobHistoriesToAdd, ...jobHistoryCollection];
    }
    return jobHistoryCollection;
  }

  protected convertDateFromClient<T extends IJobHistoryAngulr | NewJobHistoryAngulr | PartialUpdateJobHistoryAngulr>(
    jobHistory: T,
  ): RestOf<T> {
    return {
      ...jobHistory,
      startDate: jobHistory.startDate?.toJSON() ?? null,
      endDate: jobHistory.endDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restJobHistoryAngulr: RestJobHistoryAngulr): IJobHistoryAngulr {
    return {
      ...restJobHistoryAngulr,
      startDate: restJobHistoryAngulr.startDate ? dayjs(restJobHistoryAngulr.startDate) : undefined,
      endDate: restJobHistoryAngulr.endDate ? dayjs(restJobHistoryAngulr.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestJobHistoryAngulr>): HttpResponse<IJobHistoryAngulr> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestJobHistoryAngulr[]>): HttpResponse<IJobHistoryAngulr[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
