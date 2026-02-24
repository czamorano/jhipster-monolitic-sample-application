import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IJobAngulr, NewJobAngulr } from '../job-angulr.model';

export type PartialUpdateJobAngulr = Partial<IJobAngulr> & Pick<IJobAngulr, 'id'>;

export type EntityResponseType = HttpResponse<IJobAngulr>;
export type EntityArrayResponseType = HttpResponse<IJobAngulr[]>;

@Injectable({ providedIn: 'root' })
export class JobAngulrService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/jobs');

  create(job: NewJobAngulr): Observable<EntityResponseType> {
    return this.http.post<IJobAngulr>(this.resourceUrl, job, { observe: 'response' });
  }

  update(job: IJobAngulr): Observable<EntityResponseType> {
    return this.http.put<IJobAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getJobAngulrIdentifier(job))}`, job, {
      observe: 'response',
    });
  }

  partialUpdate(job: PartialUpdateJobAngulr): Observable<EntityResponseType> {
    return this.http.patch<IJobAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getJobAngulrIdentifier(job))}`, job, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJobAngulr>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJobAngulr[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  getJobAngulrIdentifier(job: Pick<IJobAngulr, 'id'>): number {
    return job.id;
  }

  compareJobAngulr(o1: Pick<IJobAngulr, 'id'> | null, o2: Pick<IJobAngulr, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobAngulrIdentifier(o1) === this.getJobAngulrIdentifier(o2) : o1 === o2;
  }

  addJobAngulrToCollectionIfMissing<Type extends Pick<IJobAngulr, 'id'>>(
    jobCollection: Type[],
    ...jobsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobs: Type[] = jobsToCheck.filter(isPresent);
    if (jobs.length > 0) {
      const jobCollectionIdentifiers = jobCollection.map(jobItem => this.getJobAngulrIdentifier(jobItem));
      const jobsToAdd = jobs.filter(jobItem => {
        const jobIdentifier = this.getJobAngulrIdentifier(jobItem);
        if (jobCollectionIdentifiers.includes(jobIdentifier)) {
          return false;
        }
        jobCollectionIdentifiers.push(jobIdentifier);
        return true;
      });
      return [...jobsToAdd, ...jobCollection];
    }
    return jobCollection;
  }
}
