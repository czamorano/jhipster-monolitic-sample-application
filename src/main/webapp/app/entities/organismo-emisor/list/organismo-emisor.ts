import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Data, ParamMap, Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subscription, combineLatest, filter, finalize, tap } from 'rxjs';

import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { OrganismoEmisorDeleteDialog } from '../delete/organismo-emisor-delete-dialog';
import { IOrganismoEmisor } from '../organismo-emisor.model';
import { EntityArrayResponseType, OrganismoEmisorService } from '../service/organismo-emisor.service';

@Component({
  selector: 'jhi-organismo-emisor',
  templateUrl: './organismo-emisor.html',
  imports: [
    RouterLink,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    AlertError,
    Alert,
    SortDirective,
    SortByDirective,
    TranslateDirective,
    TranslateModule,
  ],
})
export class OrganismoEmisor implements OnInit {
  subscription: Subscription | null = null;
  organismoEmisors = signal<IOrganismoEmisor[]>([]);
  isLoading = signal(false);

  sortState = sortStateSignal({});

  readonly router = inject(Router);
  protected readonly organismoEmisorService = inject(OrganismoEmisorService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);

  trackId = (item: IOrganismoEmisor): number => this.organismoEmisorService.getOrganismoEmisorIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (this.organismoEmisors().length === 0) {
            this.load();
          } else {
            this.organismoEmisors.set(this.refineData(this.organismoEmisors()));
          }
        }),
      )
      .subscribe();
  }

  delete(organismoEmisor: IOrganismoEmisor): void {
    const modalRef = this.modalService.open(OrganismoEmisorDeleteDialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.organismoEmisor = organismoEmisor;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe((res: EntityArrayResponseType) => this.onResponseSuccess(res));
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.organismoEmisors.set(this.refineData(dataFromBody));
  }

  protected refineData(data: IOrganismoEmisor[]): IOrganismoEmisor[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IOrganismoEmisor[] | null): IOrganismoEmisor[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading.set(true);
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.organismoEmisorService.query(queryObject).pipe(finalize(() => this.isLoading.set(false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }
}
