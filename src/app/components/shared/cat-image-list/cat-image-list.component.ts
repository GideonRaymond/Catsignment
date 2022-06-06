import { MatDialog } from '@angular/material/dialog';
import { CatService } from './../../../services/cat.service';
import {
  AfterViewInit,
  Component,
  Input,
  NgZone,
  ViewChild,
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, map, pairwise, throttleTime } from 'rxjs';
import { Cat } from '../../../services/cat.service';
import { DeleteDialogComponent } from '../../starred/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-cat-image-list',
  templateUrl: './cat-image-list.component.html',
})
export class CatImageListComponent implements AfterViewInit {
  @Input() isStarred: boolean;
  /** Virtual scroller element which can be used to track scroll position. */
  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;
  /** List of retrieved Cat objects from CatService */
  cats: Cat[] = [];
  icon: string;
  isScrollEnd: boolean = false;
  /** Empty array used to iterate over for the initial skeleton-loader */
  emptyArray = Array.apply(null, Array(20)).map(function () {});

  get isLoading(): boolean {
    return this.catService.isLoading;
  }

  get isInitializing(): boolean {
    return this.catService.isInitializing;
  }

  constructor(
    private ngZone: NgZone,
    private dialog: MatDialog,
    private catService: CatService
  ) {}

  ngOnInit(): void {
    /**
     * Subscribing to cats Observable to update when filters change.
     * Initializing the CatImages (without filters).
     * Deciding which icon to use on the cat-image.
     */
    this.catService.cats$.subscribe((cats) => {
      this.isScrollEnd = !!this.cats.length && this.cats.length === cats.length;
      this.cats = cats;
    });

    this.icon = this.isStarred ? 'close' : 'star';
    this.catService.resetCats();
    this.catService.resetFilters();
    this.getCats();
  }

  getCats(): void {
    if (this.isStarred) this.catService.getStarredCats();
    else this.catService.getCatImages();
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
        this.ngZone.run(() => this.getCats());
      });
  }

  handleImageClick(cat: Cat): void {
    /**
     * If Starred-page, open the delete-dialog to confirm removal of the
     * image from the list. This sets first sets of the animation of removal
     * by setting isRemoving to TRUE for the selected image, then sends a
     * DELETE request to the api to delete the favorited-image.
     */
    if (this.isStarred) {
      const dialogRef = this.dialog.open(DeleteDialogComponent);
      dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          this.catService.setIsRemoving(cat.id);
          this.catService.deleteStarredCat(cat.id);
          const interval = setInterval(() => {
            if (this.removeImage(cat)) clearInterval(interval);
            return;
          });
        }
      });
    } else {
      if (!!cat.favoriteId) {
        this.catService.deleteStarredCat(cat.favoriteId);
      } else {
        this.catService.postStarredCat(cat.id);
      }
    }
  }

  removeImage(cat: Cat): boolean {
    if (cat.favoriteId) return false;

    setTimeout(
      () => (this.cats = this.cats.filter((c) => c.id !== cat.id)),
      400
    );
    return true;
  }
}
