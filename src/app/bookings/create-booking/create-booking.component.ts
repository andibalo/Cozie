import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { Place } from "src/app/places/places.model";

@Component({
  selector: "app-create-booking",
  templateUrl: "./create-booking.component.html",
  styleUrls: ["./create-booking.component.scss"],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: "select" | "random";
  @ViewChild("f", { static: true }) form: NgForm;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, "cancel");
  }

  onBookPlace() {
    if (!this.form.valid || !this.isDateValid()) {
      return;
    }

    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value["first-name"],
          lastName: this.form.value["last-name"],
          guestsNumber: this.form.value["guests-number"],
          dateFrom: this.form.value["date-from"],
          dateTo: this.form.value["date-to"],
        },
      },
      "confirm"
    );
  }

  isDateValid() {
    const startDate = new Date(this.form.value["date-from"]);
    const endDate = new Date(this.form.value["date-to"]);

    return endDate > startDate;
  }
}
