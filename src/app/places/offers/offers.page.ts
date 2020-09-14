import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IonItemSliding } from "@ionic/angular";
import { Place } from "../places.model";
import { PlacesService } from "../places.service";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.page.html",
  styleUrls: ["./offers.page.scss"],
})
export class OffersPage implements OnInit {
  loadedPlaces: Place[];

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigateByUrl(`/places/offers/edit/${offerId}`);
  }
}
