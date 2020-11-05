import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: string;
}
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userIsAuthenticated = false;
  private _userId = null;

  constructor(private http: HttpClient) {}

  getUserIsAuthenticated() {
    return this.userIsAuthenticated;
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }

  get userId() {
    return this._userId;
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }

  logout() {
    this.userIsAuthenticated = false;
  }
}
