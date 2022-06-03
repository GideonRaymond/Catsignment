import { SelectItem } from './../../../../services/cat.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-mat-autocomplete',
  templateUrl: './mat-autocomplete.component.html',
})
export class MatAutocompleteComponent implements OnInit {
  /** Parent FormGroup */
  @Input() formGroup: FormGroup;
  /** List of options to display in dropdown */
  @Input() options: SelectItem[];
  /** Form field label */
  @Input() label: string;

  /** Sets the formControl of the AutoComplete */
  control: FormControl = new FormControl();
  /** List of options; filtered after 'control.value' has a value */
  filteredOptions: Observable<SelectItem[]>;

  ngOnInit() {
    /**
     * Sets controlName for the parent FormGroup
     * Sets the subscription for when input value changes to filter options
     */
    const controlName = this.label.toLowerCase();

    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map((value: SelectItem) => this.filter(value ? value.name ?? '' : ''))
    );

    this.formGroup.addControl(controlName, this.control);
  }

  filter(value: string): SelectItem[] {
    /** Filter function, compares the names in 'options' to the input-value */
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
