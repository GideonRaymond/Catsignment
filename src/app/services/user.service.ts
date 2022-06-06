import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /** Local storage key */
  private key: 'USERNAME';
  private userIdExt: string = 'thecatsass';

  get isLoggedIn(): boolean {
    /** Checks if user is logged in by checking if user exists */
    return !!this.getUser();
  }

  saveUser(username: string): void {
    /** Sets user in local storage */
    localStorage.setItem(this.key, username);
  }

  get userName(): string {
    return this.getUser() ?? '';
  }

  get userId(): string {
    const user = this.getUser();
    return user ? user + '-' + this.userIdExt : '';
  }

  private getUser(): string | null {
    /** Retrieves user from local storage */
    return localStorage.getItem(this.key);
  }
}
