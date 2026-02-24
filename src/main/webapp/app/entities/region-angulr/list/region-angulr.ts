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
import { RegionAngulrDeleteDialog } from '../delete/region-angulr-delete-dialog';
import { IRegionAngulr } from '../region-angulr.model';
import { EntityArrayResponseType, RegionAngulrService } from '../service/region-angulr.service';

@Component({
  selector: 'jhi-region-angulr',
  templateUrl: './region-angulr.html',
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
export class RegionAngulr implements OnInit {
  subscription: Subscription | null = null;
  regions = signal<IRegionAngulr[]>([]);
  isLoading = signal(false);

  sortState = sortStateSignal({});

  readonly router = inject(Router);
  protected readonly regionService = inject(RegionAngulrService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);

  trackId = (item: IRegionAngulr): number => this.regionService.getRegionAngulrIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (this.regions().length === 0) {
            this.load();
          } else {
            this.regions.set(this.refineData(this.regions()));
          }
        }),
      )
      .subscribe();
  }

  delete(region: IRegionAngulr): void {
    const modalRef = this.modalService.open(RegionAngulrDeleteDialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.region = region;
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
    this.regions.set(this.refineData(dataFromBody));
  }

  protected refineData(data: IRegionAngulr[]): IRegionAngulr[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IRegionAngulr[] | null): IRegionAngulr[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading.set(true);
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.regionService.query(queryObject).pipe(finalize(() => this.isLoading.set(false)));
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
