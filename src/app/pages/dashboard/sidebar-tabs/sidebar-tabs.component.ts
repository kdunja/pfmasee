import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar-tabs',
  templateUrl: './sidebar-tabs.component.html'
})
export class SidebarTabsComponent {
  @Input() selectedTab: string = '';
  @Output() tabChanged = new EventEmitter<string>();

  setTab(tab: string) {
    this.tabChanged.emit(tab);
  }
}
