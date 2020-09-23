import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userIsAuthenticated = true;
  private _userId = "abc";

  constructor() {}

  getUserIsAuthenticated() {
    return this.userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  login() {
    this.userIsAuthenticated = true;
  }

  logout() {
    this.userIsAuthenticated = false;
  }
}
