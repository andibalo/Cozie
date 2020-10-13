import { Component, OnDestroy, OnInit } from "@angular/core";
import { IonItemSliding, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Booking } from "./booking.model";
import { BookingService } from "./booking.service";

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.page.html",
  styleUrls: ["./bookings.page.scss"],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  bookingSub: Subscription;
  isLoading = false
  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe((bookings) => {
      this.loadedBookings = bookings;
    });
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.isLoading = true
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false
    })
  }

  onDeleteBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();

    this.loadingCtrl.create({ message: "Cancelling" }).then((loadingEle) => {
      loadingEle.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingEle.dismiss();
      });
    });
  }
}
