import { Component, OnInit } from "@angular/core";
import { AuthResponseData, AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { Button } from "protractor";
import { ignoreElements } from "rxjs/operators";
import { Observable } from "rxjs";
@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  constructor(
    private authServices: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  isLogin = false;

  ngOnInit() {}

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  authenticate(email: string, password: string) {
    this.loadingCtrl
      .create({ message: "Logging In", keyboardClose: true })
      .then((loadingEle) => {
        loadingEle.present();
        let authObs: Observable<AuthResponseData>;

        if (this.isLogin) {
          authObs = this.authServices.login(email, password);
        } else {
          authObs = this.authServices.signup(email, password);
        }
        authObs.subscribe(
          (resData) => {
            console.log(resData);
            loadingEle.dismiss();
            this.router.navigateByUrl("/places/discover");
          },
          (errorRes) => {
            console.log(errorRes);
            loadingEle.dismiss();
            const code = errorRes.error.error.message;

            let message = "Something went wrong. Please try again later.";

            if (code === "EMAIL_EXISTS") {
              message = "This email already exists";
            }

            this.showAlert(message);
          }
        );
      });
  }

  showAlert(message: string) {
    this.alertCtrl
      .create({
        header: "Authentication Failed",
        message: message,
        buttons: ["Okay"],
      })
      .then((alertEle) => {
        alertEle.present();
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    //console.log(email, password);
  }
}
