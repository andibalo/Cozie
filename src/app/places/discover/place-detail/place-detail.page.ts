import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from "@ionic/angular";
import { PlacesService } from "../../places.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Place } from "../../places.model";
import { CreateBookingComponent } from "src/app/bookings/create-booking/create-booking.component";
import { Subscription } from "rxjs";
import { BookingService } from "src/app/bookings/booking.service";
import { AuthService } from "src/app/auth/auth.service";
import { switchMap, take } from "rxjs/operators";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placesSub: Subscription;
  isLoading = false;
  isBookable: boolean;
  constructor(
    private navCtrl: NavController,
    private placesService: PlacesService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private actionCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/discover");
        return;
      }
      this.isLoading = true;
      let fetchedUserId: string | boolean;
      this.authService.userId
        .pipe(
          take(1),
          switchMap((userId) => {
            if (!userId) {
              throw new Error("No user found");
            }

            fetchedUserId = userId;
            return this.placesService.getPlace(paramMap.get("placeId"));
          })
        )
        .subscribe(
          (place) => {
            this.place = place;
            this.isBookable = place.userId !== fetchedUserId;
            this.isLoading = false;
          },
          (error) => {
            //console.log(error);
            this.alertCtrl
              .create({
                header: "Error Occured",
                message: "Could not load place.",
                buttons: [
                  {
                    text: "Okay",
                    handler: () => {
                      this.router.navigateByUrl("/places/discover");
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
        //console.log(resultData);

        if (resultData.role === "confirm") {
          this.loadingCtrl
            .create({
              message: "Creating booking",
            })
            .then((loadingEle) => {
              loadingEle.present();
              const data = resultData.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestsNumber,
                  data.dateFrom,
                  data.dateTo
                )
                .subscribe(() => {
                  loadingEle.dismiss();
                });
            });
        }
      });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
