import { Component, OnInit } from "@angular/core";
import { PlacesService } from "../../places.service";
import { NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { Place } from "../../places.model";

@Component({
  selector: "app-edit-offer",
  templateUrl: "./edit-offer.page.html",
  styleUrls: ["./edit-offer.page.scss"],
})
export class EditOfferPage implements OnInit {
  place: Place;

  constructor(
    private placesService: PlacesService,
    private navCtrl: NavController,
    private route: ActivatedRoute
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
