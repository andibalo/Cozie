import { Component, OnDestroy, OnInit } from "@angular/core";
import { PlacesService } from "../../places.service";
import {
  AlertController,
  LoadingController,
  NavController,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { Place } from "../../places.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-edit-offer",
  templateUrl: "./edit-offer.page.html",
  styleUrls: ["./edit-offer.page.scss"],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;
  form: FormGroup;
  isLoading = false;
  placeId: string;
  constructor(
    private placesService: PlacesService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/offers");
        return;
      }
      this.placeId = paramMap.get("placeId");
      this.isLoading = true;
      this.placeSub = this.placesService
        .getPlace(paramMap.get("placeId"))
        .subscribe(
          (place) => {
            this.place = place;
            this.form = new FormGroup({
              title: new FormControl(this.place.title, {
                updateOn: "blur",
                validators: [Validators.required],
              }),
              description: new FormControl(this.place.description, {
                updateOn: "blur",
                validators: [Validators.required, Validators.maxLength(100)],
              }),
            });

            this.isLoading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                header: "Error Occured",
                message: "The place you are looking for doest not exist.",
                buttons: [
                  {
                    text: "Okay",
                    handler: () => {
                      this.router.navigateByUrl("/places/offers");
                    },
                  },
                ],
              })
              .then((alertEle) => {
                alertEle.present();
              });
          }
        );
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  async onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }

    // console.log(this.form);

    const loadingEle = await this.loadingCtrl.create({
      message: "Updating offer",
    });

    loadingEle.present();

    this.placesService
      .updateOffer(
        this.placeId,
        this.form.value.title,
        this.form.value.description
      )
      .subscribe(() => {
        //all the operations are done in the services file like updating the offers
        //subsrive is just used to know when the operation finished and therefore dismissiing the loading ele
        loadingEle.dismiss();

        this.form.reset();

        this.router.navigateByUrl("/places/offers");
      });
  }
}
