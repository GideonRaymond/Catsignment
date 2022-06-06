import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

/** Custom interface for navigation links */
export interface MenuItem {
  link: string;
  path: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /** Title of the app */
  title = 'Catsignment';
  /** Name displayed in Header */
  menuName: string;
  /** List of navigation links in the Header */
  menuItems: MenuItem[] = [
    { link: 'furry friend finder', path: 'find' },
    { link: 'cat collection', path: 'collection' },
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    /** Sets 'menuName' to username if exists, else 'meow' */
    this.menuName = this.userService.userName ?? 'meow';
  }
}
