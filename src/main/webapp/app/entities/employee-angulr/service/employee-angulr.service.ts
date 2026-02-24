import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IEmployeeAngulr, NewEmployeeAngulr } from '../employee-angulr.model';

export type PartialUpdateEmployeeAngulr = Partial<IEmployeeAngulr> & Pick<IEmployeeAngulr, 'id'>;

type RestOf<T extends IEmployeeAngulr | NewEmployeeAngulr> = Omit<T, 'hireDate'> & {
  hireDate?: string | null;
};

export type RestEmployeeAngulr = RestOf<IEmployeeAngulr>;

export type NewRestEmployeeAngulr = RestOf<NewEmployeeAngulr>;

export type PartialUpdateRestEmployeeAngulr = RestOf<PartialUpdateEmployeeAngulr>;

export type EntityResponseType = HttpResponse<IEmployeeAngulr>;
export type EntityArrayResponseType = HttpResponse<IEmployeeAngulr[]>;

@Injectable({ providedIn: 'root' })
export class EmployeeAngulrService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/employees');

  create(employee: NewEmployeeAngulr): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employee);
    return this.http
      .post<RestEmployeeAngulr>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(employee: IEmployeeAngulr): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employee);
    return this.http
      .put<RestEmployeeAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getEmployeeAngulrIdentifier(employee))}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(employee: PartialUpdateEmployeeAngulr): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employee);
    return this.http
      .patch<RestEmployeeAngulr>(`${this.resourceUrl}/${encodeURIComponent(this.getEmployeeAngulrIdentifier(employee))}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEmployeeAngulr>(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEmployeeAngulr[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${encodeURIComponent(id)}`, { observe: 'response' });
  }

  getEmployeeAngulrIdentifier(employee: Pick<IEmployeeAngulr, 'id'>): number {
    return employee.id;
  }

  compareEmployeeAngulr(o1: Pick<IEmployeeAngulr, 'id'> | null, o2: Pick<IEmployeeAngulr, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmployeeAngulrIdentifier(o1) === this.getEmployeeAngulrIdentifier(o2) : o1 === o2;
  }

  addEmployeeAngulrToCollectionIfMissing<Type extends Pick<IEmployeeAngulr, 'id'>>(
    employeeCollection: Type[],
    ...employeesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const employees: Type[] = employeesToCheck.filter(isPresent);
    if (employees.length > 0) {
      const employeeCollectionIdentifiers = employeeCollection.map(employeeItem => this.getEmployeeAngulrIdentifier(employeeItem));
      const employeesToAdd = employees.filter(employeeItem => {
        const employeeIdentifier = this.getEmployeeAngulrIdentifier(employeeItem);
        if (employeeCollectionIdentifiers.includes(employeeIdentifier)) {
          return false;
        }
        employeeCollectionIdentifiers.push(employeeIdentifier);
        return true;
      });
      return [...employeesToAdd, ...employeeCollection];
    }
    return employeeCollection;
  }

  protected convertDateFromClient<T extends IEmployeeAngulr | NewEmployeeAngulr | PartialUpdateEmployeeAngulr>(employee: T): RestOf<T> {
    return {
      ...employee,
      hireDate: employee.hireDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEmployeeAngulr: RestEmployeeAngulr): IEmployeeAngulr {
    return {
      ...restEmployeeAngulr,
      hireDate: restEmployeeAngulr.hireDate ? dayjs(restEmployeeAngulr.hireDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEmployeeAngulr>): HttpResponse<IEmployeeAngulr> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEmployeeAngulr[]>): HttpResponse<IEmployeeAngulr[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
