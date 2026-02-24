import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IOrganismoEmisor } from '../organismo-emisor.model';

@Component({
  selector: 'jhi-organismo-emisor-detail',
  templateUrl: './organismo-emisor-detail.html',
  imports: [FontAwesomeModule, NgbModule, Alert, AlertError, TranslateDirective, TranslateModule, RouterLink],
})
export class OrganismoEmisorDetail {
  organismoEmisor = input<IOrganismoEmisor | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
