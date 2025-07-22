import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html'
})
export class AccountInfoComponent {
  @Input() kinds: string[] = [];
  @Input() selectedKind: string = '';
  @Input() accountBalance: string = '';
  @Input() accountNumber: string = '';

  @Input() onKindSelected!: (kind: string) => void;
}
