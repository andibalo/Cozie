import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Place } from "../../places.model";
import { PlacesService } from "../../places.service";
import { NavController } from "@ionic/angular";
@Component({
  selector: "app-offer-booking",
  templateUrl: "./offer-booking.page.html",
  styleUrls: ["./offer-booking.page.scss"],
})
export class OfferBookingPage implements OnInit {
  place: Place;
  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/offers");
        return;
      }

      this.place = this.placesService.getPlace(paramMap.get("placeId"));
    });
  }
}
