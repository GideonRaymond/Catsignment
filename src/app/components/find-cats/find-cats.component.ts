import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';
import { CatService } from './../../services/cat.service';

@Component({
  selector: 'app-find-cats',
  templateUrl: './find-cats.component.html',
  styleUrls: ['./find-cats.component.scss'],
})
export class FindCatsComponent implements OnInit, AfterViewInit {
  /** The side-bar for with filter-options. */
  @ViewChild('drawer') drawer: MatDrawer;
  catUrls: string[] = [];

  constructor(
    private catService: CatService,
    private observer: BreakpointObserver
  ) {}

  ngOnInit(): void {
    /**
     * Subscribing to cats Observable to update when filters change.
     * Initializing the CatImages (without filters)
     */
    this.catService.cats$.subscribe(
      (res) => (this.catUrls = res.map((r) => r.url))
    );

    this.catService.getCatImages();
  }

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
  }

  closeDrawer(): void {
    /** Check to only close drawer on small screens */
    if (this.drawer.mode === 'over') this.drawer.close();
  }
}
