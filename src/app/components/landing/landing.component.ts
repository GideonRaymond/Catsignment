import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  /** Min and Max lengths of the Username */
  minLength = 5;
  maxLength = 12;
  /** Initial form control for Username input field. */
  control = new FormControl(this.userService.userName, [
    Validators.minLength(this.minLength),
    Validators.maxLength(this.maxLength),
    Validators.required,
  ]);
  form = new FormGroup({
    user: this.control,
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  onSubmit(): void {
    /**
     * Submits the Username form and saves the USERNAME to local-storage.
     * Reroutes the user to the 'find' page. All routing paths are specified
     * in 'app-routing.module.ts'.
     */
    const value = this.form.controls['user'].value;

    this.userService.saveUser(value);
    const route = this.route.snapshot.data['next'];

    this.router.navigateByUrl(route);
  }
}
