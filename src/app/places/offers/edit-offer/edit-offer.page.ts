import { Component, OnDestroy, OnInit } from "@angular/core";
import { PlacesService } from "../../places.service";
import { LoadingController, NavController } from "@ionic/angular";
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

  constructor(
    private placesService: PlacesService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/offers");
        return;
      }

      this.placeSub = this.placesService
        .getPlace(paramMap.get("placeId"))
        .subscribe((place) => {
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
        });
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
        this.place.id,
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
