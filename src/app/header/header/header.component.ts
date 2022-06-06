import { MenuItem } from 'src/app/app.component';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() menuItems: MenuItem[];
  @Input() menuName: string;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onNavButtonClick(path: string) {
    if (!path) return;

    this.router.navigateByUrl(path);
  }
}
