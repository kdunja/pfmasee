import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  HostListener,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  isMobileView = false;
  showMobileMenu = false;

  mobileNavItems = [
  { icon: 'home', link: '/overview' },
  { icon: 'credit_card', link: '/budgets' },
  { icon: 'account_balance', link: '/savings' },
  { icon: 'menu_book', link: '/rules' },
  { icon: 'sync_alt', link: '/transactions' },
  { icon: 'description', link: '/reports' },
  { icon: 'bar_chart', link: '/analytics' },
  { icon: 'spa', link: '/goals' },
  { icon: 'headset_mic', link: '/support' }
];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.checkScreenWidth();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.checkScreenWidth();
  }

  checkScreenWidth(): void {
    this.isMobileView = window.innerWidth <= 768;
  }
}
