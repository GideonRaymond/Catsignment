import { Subject, Observable, map } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Header {
  headers: {
    [header: string]: string | string[];
  };
}

export interface SelectItem {
  id: number | string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CatService {
  /** Header to send with every request to the CatApi */
  private header: Header;
  /** Maximum number of images per request */
  private requestLimit = 20;
  /** Order images are retrieved by ('rand' == random) */
  private requestOrder = 'rand';
  /**
   * Image size ('small' for slightly better performance)
   * TODO: Convert 'small' to 'medium' for larger screens
   */
  private requestImageSize = 'small';
  /** Base query-params to send with each request when retrieving images */
  requestImageQuery = `?limit=${this.requestLimit}&order=${this.requestOrder}&size=${this.requestImageSize}`;
  /** Active breed to be applied to filtered request */
  private activeBreedFilter: string = '';
  /** Active categories to be applied to filtered request */
  private activeCategoryFilter: (string | number)[] = [];

  /** Subject to cast incoming request response to Observers */
  private cats = new Subject<any[]>();
  /** Observable to subscribe to, new values pushed by 'cats' */
  cats$: Observable<any[]> = this.cats.asObservable();

  constructor(private http: HttpClient) {
    /** Sets the constant header with apiKey from the environment */
    this.header = {
      headers: {
        'x-api-key': environment.apiKey,
      },
    };
  }

  private getQueryParameters(): string {
    /** Sets the optional query parameters if available */
    let query = this.requestImageQuery;

    if (!!this.activeBreedFilter) {
      query = query + `&breed_id=${this.activeBreedFilter}`;
    }

    if (this.activeCategoryFilter.length) {
      query = query + `&category_ids=${this.activeCategoryFilter}`;
    }

    return query;
  }

  setFilters(breedId: string, categoryIds: (string | number)[]) {
    /** Sets the active filters selected by user */
    this.activeBreedFilter = breedId;
    this.activeCategoryFilter = categoryIds;
  }

  getCatImages(): void {
    /** Retrieves images and pushes new values via Subject to Observers */

    const query = this.getQueryParameters();
    const url = environment.endPoints.search + query;

    this.http
      .get<any[]>(url, this.header)
      .subscribe((res) => this.cats.next(res));
  }

  getListOfCategories(): Observable<SelectItem[]> {
    /** GET request for list of categories; converts to SelectItem */
    return this.http
      .get<any[]>(environment.endPoints.categoriesList, this.header)
      .pipe(map((res: any[]) => this.mapToSelectItem(res)));
  }

  getListOfBreeds(): Observable<SelectItem[]> {
    /** GET request for list of Breeds; converts to SelectItem */
    return this.http
      .get<any[]>(environment.endPoints.breedList, this.header)
      .pipe(map((res: any[]) => this.mapToSelectItem(res)));
  }

  mapToSelectItem(list: any[]): SelectItem[] {
    /** Maps array with multiple values and takes only 'name' and 'id' */
    return list.map((l) => {
      return { id: l.id, name: l.name };
    });
  }
}
