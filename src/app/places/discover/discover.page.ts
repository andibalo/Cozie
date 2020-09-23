import { Component, OnDestroy, OnInit } from "@angular/core";
import { PlacesService } from "../places.service";
import { Place } from "../places.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  private placesSub: Subscription;
  constructor(private placesService: PlacesService) {}

  ngOnInit() {
    //EVERY observable returns a subscripton object when subscribed
    //it is stored in a variable of type Subscrption
    //the subscripton obj has unsubscribe method on it to unsub to observable when page is destroyed
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
    });
  }

  onFilterUpdate(event: CustomEvent) {
    // console.log(event.detail);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
