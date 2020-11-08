import { Injectable } from "@angular/core";
import { UrlTree, CanLoad, Route, UrlSegment, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { switchMap, take, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanLoad {
  constructor(private authServices: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authServices.userIsAuthenticated.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        //When the auth guard runs it will check first if the user class is set with token

        if (!isAuthenticated) {
          //If not it will try to check the localstorage for userdata and set it to the user class hence
          //logging us in
          return this.authServices.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigateByUrl("/auth");
        }
      })
    );
  }
}
