import { Component, OnDestroy, OnInit } from "@angular/core";
import { PlacesService } from "../places.service";
import { Place } from "../places.model";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"],
})
export class DiscoverPage implements OnInit, OnDestroy {
  isLoading = false;
  loadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSub: Subscription;
  private filter = "all";
  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    //EVERY observable returns a subscripton object when subscribed
    //it is stored in a variable of type Subscrption
    //the subscripton obj has unsubscribe method on it to unsub to observable when page is destroyed
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.onFilterUpdate(this.filter);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlace().subscribe(() => {
      this.isLoading = false;
    });
  }
  onFilterUpdate(filter: string) {
    // console.log(event.detail);

    this.authService.userId.pipe(take(1)).subscribe((userId) => {
      if (filter === "all") {
        this.relevantPlaces = this.loadedPlaces;
      } else {
        this.relevantPlaces = this.loadedPlaces.filter(
          (place) => place.userId !== userId
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
