import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { IJobHistoryAngulr } from '../job-history-angulr.model';

@Component({
  selector: 'jhi-job-history-angulr-detail',
  templateUrl: './job-history-angulr-detail.html',
  imports: [FontAwesomeModule, NgbModule, Alert, AlertError, TranslateDirective, TranslateModule, RouterLink, FormatMediumDatetimePipe],
})
export class JobHistoryAngulrDetail {
  jobHistory = input<IJobHistoryAngulr | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
