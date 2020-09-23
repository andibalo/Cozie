import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Place } from "./places.model";
import { take, map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      "p1",
      "Manhattan Mansion",
      "In the heart of New York City.",
      "https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200",
      149.99,
      new Date("2020-09-19"),
      new Date("2020-12-19"),
      "abc"
    ),
    new Place(
      "p2",
      "L'Amour Toujours",
      "A romantic place in Paris!",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg",
      189.99,
      new Date("2020-09-19"),
      new Date("2020-12-19"),
      "abc"
    ),
    new Place(
      "p3",
      "The Foggy Palace",
      "Not your average city trip!",
      "https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg",
      99.99,
      new Date("2020-09-19"),
      new Date("2020-12-19"),
      "abc"
    ),
  ]);

  get places() {
    //If we return as observable we can only subscribe to it
    //we do this because _places is a subject and we can suscribe or call next on it
    //we only want to be able to subscribe to it because by subscribing to it we get the list of places
    return this._places.asObservable();
  }

  getPlace(id: string) {
    //IN get place function we want to return an Observable as well because if we subscribe to it
    //we get the data of that one place

    //MAP takes in the list of places from the take operator and wrap the object we return from the func
    //as an observable that we can sub to and get the data
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      "https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200",
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    //this._places.push(newPlace);

    //take takes only the first emitted data as value for the function inside subscription and then cancels the subscription
    //we want to do this so we get only one object of places which is the current latest list of places and not listen to future updates
    //because it is a click listener and we do not want it ro run everytime the places changes
    this.places.pipe(take(1)).subscribe((places) => {
      //Since places is not an array and is a behaviour subject, to add places we
      //call next to emit an event with the newest data which is the old array of places + new place
      this._places.next(places.concat(newPlace));
    });
  }

  constructor(private authService: AuthService) {}
}
