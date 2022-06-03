import { environment } from './../environments/environment';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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


  }
}
