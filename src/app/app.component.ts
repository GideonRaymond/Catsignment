import { environment } from './../environments/environment';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'catsignment';
  apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  onButtonClick(): void {
    const options = { headers: { 'x-api-key': this.apiKey } };
    this.http
      .get('https://api.thecatapi.com/v1/categories', options)
      .subscribe((res) => console.log(res));
  }
}
