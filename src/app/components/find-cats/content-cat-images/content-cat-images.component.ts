import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-content-cat-images',
  templateUrl: './content-cat-images.component.html',
})
export class ContentCatImagesComponent {
  /** List of retrieved urls corresponding to the cat-images. */
  @Input() catUrls: string[];
}
