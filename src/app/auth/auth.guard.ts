import { Injectable } from "@angular/core";
import { UrlTree, CanLoad, Route, UrlSegment, Router } from "@angular/router";
import { Observable } from "rxjs";
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
    if (!this.authServices.getUserIsAuthenticated()) {
      this.router.navigateByUrl("/auth");
    }

    return this.authServices.getUserIsAuthenticated();
  }
}
