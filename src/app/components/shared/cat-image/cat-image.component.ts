import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Cat } from '../../../services/cat.service';

@Component({
  selector: 'app-cat-image',
  templateUrl: './cat-image.component.html',
})
export class CatImageComponent implements OnInit {
  /** Cat to display */
  @Input() cat: Cat;
  /** Icon to use on image. */
  @Input() icon: 'star' | 'close';
  /** Emit event when clicked on image. */
  @Output() onImageClick = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
