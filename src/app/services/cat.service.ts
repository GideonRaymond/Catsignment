import { Subject, Observable, map, filter, throttleTime, timeout } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import {
  GetCatsResponse,
  GetFavoriteCatsResponse,
  GetCatBreedsResponse,
  GetCatCategoriesResponse,
  PostCatFavoriteRequest,
  CatImage,
  CatFavorite,
} from '../components/response-types';

interface Header {
  headers: {
    [header: string]: string | string[];
  };
}

export interface Cat {
  id: string | number;
  imageUrl: string;
  isLoading: boolean;
  isRemoving?: boolean;
  favoriteId?: string | number;
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
  private requestLimit = 24;
  /** Order images are retrieved by ('rand' == random) */
  private requestOrder = 'rand';
  /**
   * Image size ('small' for slightly better performance)
   * TODO: Convert 'small' to 'medium' for larger screens
   */
  private requestImageSize = 'small';
  /** Base query-params to send with each request when retrieving images */
  requestImageQuery = `?limit=${this.requestLimit}&size=${this.requestImageSize}`;
  /** Active breed to be applied to filtered request */
  private activeBreedFilter: string = '';
  /** Active categories to be applied to filtered request */
  private activeCategoryFilter: (string | number)[] = [];
  /** List of Cats currently in memory. */
  private cats: Cat[] = [];
  private catSubject = new Subject<Cat[]>();
  cats$ = this.catSubject.asObservable();
  /** Bool to set when request starts and finished */
  private isLoadingImages: boolean = false;
  /** Bool to set when initializing new list of cats. */
  private isInitializingImages: boolean = true;
  /**
   * Used to retrieve the correct list of cats based on 'limit'-size
   * when acquiring the list of Favorites.
   */
  private scrollPage: number = 0;

  constructor(private http: HttpClient, private userService: UserService) {
    /** Sets the constant header with apiKey from the environment */
    this.header = {
      headers: {
        'x-api-key': environment.apiKey,
      },
    };
  }

  get isInitializing(): boolean {
    return this.isInitializingImages;
  }

  get isLoading(): boolean {
    return this.isLoadingImages;
  }

  get isScrollEnd(): boolean {
    return this.cats.length % this.requestLimit !== 0;
  }

  private getQueryParameters(useOrder: boolean = true): string {
    /** Sets the optional query parameters if available */
    let query = this.requestImageQuery;

    if (useOrder) {
      query = query + `&order=${this.requestOrder}`;
    }

    if (!!this.activeBreedFilter) {
      query = query + `&breed_id=${this.activeBreedFilter}`;
    }

    if (this.activeCategoryFilter.length) {
      query = query + `&category_ids=${this.activeCategoryFilter}`;
    }

    return query;
  }

  getCatImages(isStarred: boolean = false): void {
    /** GET request which returns an array of GetCat objects and converts
     * them to Cat objects.
     */
    const env = environment.endPoints;
    let query = this.getQueryParameters(isStarred);
    let url = isStarred ? env.favorites : env.search;
    if (isStarred) {
      const userId = this.userService.userId;
      query += `&sub_id=${userId}&page=${this.scrollPage}`;
    }

    url = url + query;

    this.http
      .get<GetCatsResponse | GetFavoriteCatsResponse>(url, this.header)
      .pipe(
        filter(() => !this.isLoading && !this.isScrollEnd),
        throttleTime(2500),
        timeout(5000),
        map((res) => {
          this.isLoadingImages = true;
          return this.mapToCatItem(res, isStarred);
        })
      )
      .subscribe({
        next: (res) => this.finishRequest(res),
        error: () => {
          this.handleError();
        },
      });
  }

  private finishRequest(cats: Cat[]): void {
    /** Tells the service that a request has succesfully been completed */
    this.isLoadingImages = false;
    this.isInitializingImages = false;
    this.cats = cats;
    this.catSubject.next(cats);
  }

  getListOfCategories(): Observable<SelectItem[]> {
    /** GET request for list of categories; returns
     * GetCatCategoriesResponse object and converts this to
     * a SelectItem
     */
    return this.http
      .get<GetCatCategoriesResponse>(
        environment.endPoints.categoriesList,
        this.header
      )
      .pipe(map((res) => this.mapToSelectItem(res)));
  }

  getListOfBreeds(): Observable<SelectItem[]> {
    /** GET request for list of Breeds; returns GetCatBreedsResponse
     * and converts this to a SelectItem
     */
    return this.http
      .get<GetCatBreedsResponse>(environment.endPoints.breedList, this.header)
      .pipe(map((res) => this.mapToSelectItem(res)));
  }

  postStarredCat(catId: number | string): void {
    /**
     * Send POST request that takes a PostCatFavoriteRequest object.
     * Returns a PostCatFavoriteResponse object.
     */
    const cat = this.cats.find((c) => c.id === catId);

    if (!cat) return this.handleError();
    cat.isLoading = true;

    const data: PostCatFavoriteRequest = {
      image_id: cat.id,
      sub_id: this.userService.userId,
    };

    this.http
      .post(environment.endPoints.favorites, data, this.header)
      .pipe(throttleTime(200))
      .subscribe((res: any) => {
        cat.favoriteId = res.id;
        cat.isLoading = false;
      });
  }

  deleteStarredCat(catId: number | string | undefined): void {
    /** Send DELETE request to api with the 'favoriteId' as a parameter. */
    const cat = this.cats.find((c) => c.favoriteId === catId);

    if (!cat) return this.handleError();
    cat.isLoading = true;

    const url = `${environment.endPoints.favorites}/${cat.favoriteId}`;

    this.http
      .delete(url, this.header)
      .pipe(throttleTime(200))
      .subscribe(() => {
        cat.favoriteId = undefined;
        cat.isLoading = false;
      });
  }

  private mapToSelectItem(
    list: GetCatBreedsResponse | GetCatCategoriesResponse
  ): SelectItem[] {
    /** Maps array with multiple values and takes only 'name' and 'id' */
    return list.map((l) => {
      return { id: l.id, name: l.name };
    });
  }

  private mapToCatItem(
    list: GetCatsResponse | GetFavoriteCatsResponse,
    isStarred: boolean = false
  ): Cat[] {
    /** Maps array with multiple values and takes only 'url' and 'id'
     * Defaults 'isLoading' to 'false'.
     */
    return list.map((l: CatImage | CatFavorite) => {
      return {
        id: l.id,
        imageUrl: isStarred
          ? (l as CatFavorite).image.url
          : (l as CatImage).url,
        favoriteId: isStarred ? l.id : undefined,
        isLoading: false,
      };
    });
  }

  resetFilters(): void {
    /** Reset filters to their default values. */
    this.setFilters('', []);
  }

  setFilters(breedId: string, categoryIds: (string | number)[]) {
    /** Resets the cats and sets the active filters selected by user */
    this.resetCats();

    this.activeBreedFilter = breedId;
    this.activeCategoryFilter = categoryIds;
    this.isInitializingImages = true;
  }

  setIsRemoving(catId: string | number): void {
    /**
     * Sets the 'isRemoving' variable of the Cat object. Used to
     * set animation in motion when deleting an object from the array.
     */
    const cat = this.cats.find((c) => c.id === catId);

    if (!cat) return this.handleError();
    cat.isRemoving = true;
  }

  resetCats(): void {
    /** Reset cat-list to an empty array. */
    this.cats = [];
    this.catSubject.next(this.cats);
    this.scrollPage = 0;
  }

  private handleError(): void {
    /** TODO: Proper error-handling */
    return console.error('ERROR');
  }
}
