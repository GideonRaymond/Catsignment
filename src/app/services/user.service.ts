import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /** Local storage key */
  private key: 'USERNAME';

  get isLoggedIn(): boolean {
    /** Checks if user is logged in by checking if user exists */
    return !!this.getUser();
  }

  saveUser(username: string): void {
    /** Sets user in local storage */
    localStorage.setItem(this.key, username);
  }

  getUser(): string | null {
    /** Retrieves user from local storage */
    return localStorage.getItem(this.key);
  }
}
