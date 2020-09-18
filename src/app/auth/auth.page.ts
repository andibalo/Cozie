import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  constructor(
    private authServices: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  isLogin = false;

  ngOnInit() {}

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onLogin() {
    this.loadingCtrl
      .create({ message: "Logging In", keyboardClose: true })
      .then((loadingEle) => {
        loadingEle.present();

        setTimeout(() => {
          this.authServices.login();
          loadingEle.dismiss();
          this.router.navigateByUrl("/places/discover");
        }, 1000);
      });
  }

  onSubmit(form: NgForm) {
    console.log(form.form.value);
  }
}
