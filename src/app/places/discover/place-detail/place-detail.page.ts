import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  ActionSheetController,
  ModalController,
  NavController,
} from "@ionic/angular";
import { PlacesService } from "../../places.service";
import { ActivatedRoute } from "@angular/router";
import { Place } from "../../places.model";
import { CreateBookingComponent } from "src/app/bookings/create-booking/create-booking.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placesSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private placesService: PlacesService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private actionCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/discover");
        return;
      }

      this.placesSub = this.placesService
        .getPlace(paramMap.get("placeId"))
        .subscribe((place) => {
          this.place = place;
        });
    });
  }

  onBookPlace() {
    this.actionCtrl
      .create({
        header: "Choose an action",
        buttons: [
          {
            text: "Select a date",
            handler: () => {
              this.openBookingModal("select");
            },
          },
          {
            text: "Random date",
            handler: () => {
              this.openBookingModal("random");
            },
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ],
      })
      .then((actionSheetEle) => {
        actionSheetEle.present();
      });
  }

  openBookingModal(mode: "select" | "random") {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode },
      })
      .then((modalEle) => {
        modalEle.present();

        return modalEle.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData);
      });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
