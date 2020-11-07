import { Injectable } from "@angular/core";
import { UrlTree, CanLoad, Route, UrlSegment, Router } from "@angular/router";
import { Observable } from "rxjs";
import { take, tap } from "rxjs/operators";
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
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigateByUrl("/auth");
        }
      })
    );
  }
}
