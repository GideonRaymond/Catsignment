import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem, CatService } from './../../../services/cat.service';

@Component({
  selector: 'app-drawer-filter',
  templateUrl: './drawer-filter.component.html',
})
export class DrawerFilterComponent implements OnInit {
  /** Emitting when filter's are applied to close the drawer. */
  @Output() onApply = new EventEmitter<void>();
  /** List of all cat-categories to use in Select */
  catCategories: SelectItem[] = [];
  /** List of all cat-breeds */
  catBreeds: SelectItem[] = [];
  /** List of all cat-breed names to use in Autocomplete */
  catBreedNames: string[];
  form = new FormGroup({});

  get isLoading(): boolean {
    /** Checks whether categories and Breeds have been retrieved */
    return !this.catCategories.length || !this.catBreeds.length;
  }

  constructor(private catService: CatService) {}

  ngOnInit() {
    /** Retrieving the Categories and Breeds (only happens once) */
    this.catService.getListOfCategories().subscribe((res) => {
      this.catCategories = res;
    });

    this.catService.getListOfBreeds().subscribe((res) => {
      this.catBreeds = res;
      this.catBreedNames = this.catBreeds.map((o) => o.name);
    });
  }

  getCatBreedId(breed: string): string {
    const option = this.catBreeds.find((option) => option.name === breed);

    return option ? option.id.toString() : '';
  }

  onSubmit(): void {
    /**
     * Submitting the filter-form sets the chosen filters,
     * then requests the Cat images,
     * then emits that they were applied.
     */
    const formValue = this.form.value;
    const breedId = this.getCatBreedId(formValue['breed'] ?? '');
    const categories = formValue['category'] ?? [];

    this.catService.setFilters(breedId, categories);
    this.catService.getCatImages();
    this.onApply.emit();
  }
}
