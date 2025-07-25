import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar-tabs',
  templateUrl: './sidebar-tabs.component.html'
})
export class SidebarTabsComponent {
  @Input() selectedTab: string = '';
  @Output() tabChanged = new EventEmitter<string>();

  tabs: string[] = ['overview', 'budgets', 'savings', 'rules'];

  tabIconMap: { [key: string]: string } = {
    overview: 'show_chart',       // ili 'analytics'
    budgets: 'account_balance_wallet',
    savings: 'savings',
    rules: 'tune'                 // ili 'rule'
  };

  selectTab(tab: string) {
    this.tabChanged.emit(tab);
  }
}
