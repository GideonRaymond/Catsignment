import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'src/app/app.component';

@Component({
  selector: 'app-nav-link',
  templateUrl: './nav-link.component.html',
  styleUrls: ['./nav-link.component.scss'],
})
export class NavLinkComponent {
  @Input() menuItem: MenuItem;
  @Input() badgeNumber: number;
  @Output() onNavClick = new EventEmitter<string>();
}
