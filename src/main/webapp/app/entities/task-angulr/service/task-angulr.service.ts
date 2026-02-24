import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ITaskAngulr, NewTaskAngulr } from '../task-angulr.model';

export type PartialUpdateTaskAngulr = Partial<ITaskAngulr> & Pick<ITaskAngulr, 'id'>;

export type EntityResponseType = HttpResponse<ITaskAngulr>;
export type EntityArrayResponseType = HttpResponse<ITaskAngulr[]>;

@Injectable({ providedIn: 'root' })
export class TaskAngulrService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tasks');

  create(task: NewTaskAngulr): Observable<EntityResponseType> {
    return this.http.post<ITaskAngulr>(this.resourceUrl, task, { observe: 'response' });
  }

  update(task: ITaskAngulr): Observable<EntityResponseType> {
    return this.http.put<ITaskAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getTaskAngulrIdentifier(task))}`, task, {
      observe: 'response',
    });
  }

  partialUpdate(task: PartialUpdateTaskAngulr): Observable<EntityResponseType> {
    return this.http.patch<ITaskAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getTaskAngulrIdentifier(task))}`, task, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITaskAngulr>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITaskAngulr[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  getTaskAngulrIdentifier(task: Pick<ITaskAngulr, 'id'>): number {
    return task.id;
  }

  compareTaskAngulr(o1: Pick<ITaskAngulr, 'id'> | null, o2: Pick<ITaskAngulr, 'id'> | null): boolean {
    return o1 && o2 ? this.getTaskAngulrIdentifier(o1) === this.getTaskAngulrIdentifier(o2) : o1 === o2;
  }

  addTaskAngulrToCollectionIfMissing<Type extends Pick<ITaskAngulr, 'id'>>(
    taskCollection: Type[],
    ...tasksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tasks: Type[] = tasksToCheck.filter(isPresent);
    if (tasks.length > 0) {
      const taskCollectionIdentifiers = taskCollection.map(taskItem => this.getTaskAngulrIdentifier(taskItem));
      const tasksToAdd = tasks.filter(taskItem => {
        const taskIdentifier = this.getTaskAngulrIdentifier(taskItem);
        if (taskCollectionIdentifiers.includes(taskIdentifier)) {
          return false;
        }
        taskCollectionIdentifiers.push(taskIdentifier);
        return true;
      });
      return [...tasksToAdd, ...taskCollection];
    }
    return taskCollection;
  }
}
