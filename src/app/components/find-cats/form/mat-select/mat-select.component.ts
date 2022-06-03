import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';
import { SelectItem } from '../../../../services/cat.service';

/** Maximum of multiselect-options to choose from */
const MAX_FILTERS = 3;

@Component({
  selector: 'app-mat-select',
  templateUrl: './mat-select.component.html',
})
export class MatSelectComponent implements OnInit {
  /** Parent form */
  @Input() formGroup: FormGroup;
  /** List of options to display in dropdown */
  @Input() options: SelectItem[];
  /** Form field label */
  @Input() label: string;

  /** Form field control */
  control: FormControl;
  /** Error message to display for custom validator function */
  errorMessage: string;

  constructor() {}

  ngOnInit(): void {
    /**
     * Sets controls and adds it to parent FormGroup
     * Sets the errorMessage
     */
    const controlName = this.label.toLowerCase();
    this.errorMessage = `Only ${MAX_FILTERS} "${controlName}" can be chosen.`;

    this.control = new FormControl(null, {
      validators: [this.validator()],
    });

    this.formGroup.addControl(controlName, this.control);
  }

  validator(): ValidatorFn {
    /** Validates if number of options chosen is less than the maximum amount */
    return (control: AbstractControl) => {
      const value = (control.value ?? []).length;

      if (value > MAX_FILTERS) return { invalid: true };
      else return null;
    };
  }
}
