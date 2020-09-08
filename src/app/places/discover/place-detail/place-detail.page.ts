import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { PlacesService } from "../../places.service";
import { ActivatedRoute } from "@angular/router";
import { Place } from "../../places.model";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(
    private navCtrl: NavController,
    private placesService: PlacesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/discover");
        return;
      }

      this.place = this.placesService.getPlace(paramMap.get("placeId"));
    });
  }
}
