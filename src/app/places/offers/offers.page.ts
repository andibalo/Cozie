import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IonItemSliding } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Place } from "../places.model";
import { PlacesService } from "../places.service";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.page.html",
  styleUrls: ["./offers.page.scss"],
})
export class OffersPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  private placesSub: Subscription;
  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    //By subscribing we get the list of places and future updated places
    //If we use take(1) we only get the current list of places and not future updated places
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigateByUrl(`/places/offers/edit/${offerId}`);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
