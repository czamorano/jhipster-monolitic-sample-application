import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IDepartmentAngulr, NewDepartmentAngulr } from '../department-angulr.model';

export type PartialUpdateDepartmentAngulr = Partial<IDepartmentAngulr> & Pick<IDepartmentAngulr, 'id'>;

export type EntityResponseType = HttpResponse<IDepartmentAngulr>;
export type EntityArrayResponseType = HttpResponse<IDepartmentAngulr[]>;

@Injectable({ providedIn: 'root' })
export class DepartmentAngulrService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/departments');

  create(department: NewDepartmentAngulr): Observable<EntityResponseType> {
    return this.http.post<IDepartmentAngulr>(this.resourceUrl, department, { observe: 'response' });
  }

  update(department: IDepartmentAngulr): Observable<EntityResponseType> {
    return this.http.put<IDepartmentAngulr>(
      `${this.resourceUrl}/${encodeURIComponent(this.getDepartmentAngulrIdentifier(department))}`,
      department,
      { observe: 'response' },
    );
  }

  partialUpdate(department: PartialUpdateDepartmentAngulr): Observable<EntityResponseType> {
    return this.http.patch<IDepartmentAngulr>(
      `${this.resourceUrl}/${encodeURIComponent(this.getDepartmentAngulrIdentifier(department))}`,
      department,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDepartmentAngulr>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDepartmentAngulr[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  getDepartmentAngulrIdentifier(department: Pick<IDepartmentAngulr, 'id'>): number {
    return department.id;
  }

  compareDepartmentAngulr(o1: Pick<IDepartmentAngulr, 'id'> | null, o2: Pick<IDepartmentAngulr, 'id'> | null): boolean {
    return o1 && o2 ? this.getDepartmentAngulrIdentifier(o1) === this.getDepartmentAngulrIdentifier(o2) : o1 === o2;
  }

  addDepartmentAngulrToCollectionIfMissing<Type extends Pick<IDepartmentAngulr, 'id'>>(
    departmentCollection: Type[],
    ...departmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const departments: Type[] = departmentsToCheck.filter(isPresent);
    if (departments.length > 0) {
      const departmentCollectionIdentifiers = departmentCollection.map(departmentItem =>
        this.getDepartmentAngulrIdentifier(departmentItem),
      );
      const departmentsToAdd = departments.filter(departmentItem => {
        const departmentIdentifier = this.getDepartmentAngulrIdentifier(departmentItem);
        if (departmentCollectionIdentifiers.includes(departmentIdentifier)) {
          return false;
        }
        departmentCollectionIdentifiers.push(departmentIdentifier);
        return true;
      });
      return [...departmentsToAdd, ...departmentCollection];
    }
    return departmentCollection;
  }
}
