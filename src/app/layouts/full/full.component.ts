import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: [],
})
export class FullComponent implements OnInit {

  @ViewChild('leftsidenav')
  public sidenav: MatSidenav | any;

  private layoutChangesSubscription = Subscription.EMPTY;

  public isMobile = false; // ⬅️ Dodato za padding u HTML-u
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;

  get isOver(): boolean {
    return this.isMobile;
  }

  constructor(private breakpointObserver: BreakpointObserver) {
    this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW])
      .subscribe((state) => {
        this.isMobile = state.breakpoints[MOBILE_VIEW];
      });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {}

  onSidenavClosedStart() {
    this.isCollapsedWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
  }
}
