import {
  OnInit,
  AfterViewInit,
  Component,
  Input,
  NgZone,
  ViewChild,
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, map, pairwise, throttleTime } from 'rxjs';
import { CatService } from './../../../services/cat.service';

@Component({
  selector: 'app-content-cat-images',
  templateUrl: './content-cat-images.component.html',
  styleUrls: ['./content-cat-images.scss'],
})
export class ContentCatImagesComponent implements OnInit, AfterViewInit {
  /** List of retrieved urls corresponding to the cat-images. */
  @Input() catUrls: string[] = [];
  /** Virtual scroller element which can be used to track scroll position. */
  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;

  /** Empty array used to iterate over for the initial skeleton-loader */
  emptyArray = Array.apply(null, Array(20)).map(function () {});

  /** Loading indicator for spinner when loading more images. */
  get isLoading(): boolean {
    return this.catService.isLoading;
  }

  constructor(private ngZone: NgZone, private catService: CatService) {}

  ngOnInit(): void {
    /**
     * Subscribing to cats Observable to update when filters change.
     * Initializing the CatImages (without filters)
     */
    this.catService.cats$.subscribe((res) => {
      const newImages = res.map((r) => r.url);
      this.catUrls = [...this.catUrls, ...newImages];
    });

    this.catService.getCatImages();
  }

  ngAfterViewInit(): void {
    /**
     * Subscribe to VirtualScroller element.
     * Only get new images if scrolling down (y[1] > y[0]) and if scroll
     * is within 300px of the end.
     */
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter((y, _) => y[0] > y[1] && y[1] < 300),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => this.catService.getCatImages());
      });
  }
}
