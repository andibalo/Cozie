import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { Plugins, Capacitor } from "@capacitor/core";
import { AuthService } from "./auth/auth.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    private platform: Platform,

    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //HIDE splashscreen when the app is ready
      if (Capacitor.isPluginAvailable("SplashScreen")) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    this.authSub = this.authService.userIsAuthenticated.subscribe(
      //WE added a property that stores the previous auth state true if logged in
      //because the app ngoninit runs first before auth guard that sets the user class if the data exists in local storage
      //hence even if we login and refresh page we still get redirected to the login page because isAuthenticated will always be false
      (isAuthenticated) => {
        if (!isAuthenticated && this.previousAuthState !== isAuthenticated) {
          this.router.navigateByUrl("/auth");
        }

        this.previousAuthState = isAuthenticated;
      }
    );
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/auth");
  }
}
