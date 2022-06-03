import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-content-cat-images',
  templateUrl: './content-cat-images.component.html',
})
export class ContentCatImagesComponent {
  /** List of retrieved urls corresponding to the cat-images. */
  @Input() catUrls: string[];
  /** Drawer is either 'side' (always visible) or 'over' (hidden on small screens) */
  @Input() drawerMode: string;
  /** Emits when button clicked to open Drawer (small screens only). */
  @Output() onDrawerToggle = new EventEmitter<void>();
}
