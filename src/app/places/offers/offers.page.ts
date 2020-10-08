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
  isLoading = false;
  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    //By subscribing we get the list of places and future updated places
    //If we use take(1) we only get the current list of places and not future updated places
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;

    //fetchPlace makes http request to server. All operations are down in the service
    //by suscribing in the component it signals that operation is done.
    //hence we use subscribe in component for loading state
    this.placesService.fetchPlace().subscribe(() => {
      this.isLoading = false;
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
