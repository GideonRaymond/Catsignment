import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-find-cats',
  templateUrl: './find-cats.component.html',
})
export class FindCatsComponent implements AfterViewInit {
  /** The side-bar for with filter-options. */
  @ViewChild('drawer') drawer: MatDrawer;

  constructor(
    private observer: BreakpointObserver,
    private cdRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    /** Changing how the SideBar (Drawer) is displayed based on window-size. */
    this.observer.observe(['(max-width: 990px)']).subscribe((res) => {
      if (res.matches) {
        this.drawer.mode = 'over';
        this.drawer.close();
      } else {
        this.drawer.mode = 'side';
        this.drawer.open();
      }
    });

    this.cdRef.detectChanges();
  }

  closeDrawer(): void {
    /** Check to only close drawer on small screens */
    if (this.drawer.mode === 'over') this.drawer.close();
  }
}
