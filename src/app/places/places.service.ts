import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Place } from "./places.model";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
interface PlaceData {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  availableFrom: Date;
  availableTo: Date;
  userId: string;
}
@Injectable({
  providedIn: "root",
})
export class PlacesService {
  // new Place(
  //   "p1",
  //   "Manhattan Mansion",
  //   "In the heart of New York City.",
  //   "https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200",
  //   149.99,
  //   new Date("2020-09-19"),
  //   new Date("2020-12-19"),
  //   "xyz"
  // ),
  // new Place(
  //   "p2",
  //   "L'Amour Toujours",
  //   "A romantic place in Paris!",
  //   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg",
  //   189.99,
  //   new Date("2020-09-19"),
  //   new Date("2020-12-19"),
  //   "abc"
  // ),
  // new Place(
  //   "p3",
  //   "The Foggy Palace",
  //   "Not your average city trip!",
  //   "https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg",
  //   99.99,
  //   new Date("2020-09-19"),
  //   new Date("2020-12-19"),
  //   "abc"
  // ),
  private _places = new BehaviorSubject<Place[]>([]);

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
    // return this.places.pipe(
    //   take(1),
    //   map((places) => {
    //     return { ...places.find((p) => p.id === id) };
    //   })
    // );

    return this.http
      .get<PlaceData>(
        `https://cozie-d78bb.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map((place) => {
          return new Place(
            id,
            place.title,
            place.description,
            place.imageUrl,
            place.price,
            new Date(place.availableFrom),
            new Date(place.availableTo),
            place.userId
          );
        })
      );
  }

  updateOffer(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    //updateOffer runs when the user clicks so therefore we onyl want the latest data when that event occurs
    //hence we use take(1) so we get the latest data and end
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        //create the newly updated place and update the places array with the new place
        const updatedPlaceIndex = places.findIndex((p) => p.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];

        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );

        //update the newly updated places in the database
        return this.http.put(
          `https://cozie-d78bb.firebaseio.com/offered-places/${placeId}.json`,
          {
            ...updatedPlaces[updatedPlaceIndex],
            id: null,
          }
        );
      }),
      tap(() => {
        //we emit an event with the newly updated place
        //so in other part of the app that is subsribed to the place subject it will receive the new data
        this._places.next(updatedPlaces);
      })
    );
  }

  fetchPlace() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        "https://cozie-d78bb.firebaseio.com/offered-places.json"
      )
      .pipe(
        map((resData) => {
          //MAP
          //map is an operator that takes in the respsone data and returns a non observable data
          //switchmap returns a new observable

          const places = [];

          for (let key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }

          return places;
        }),
        tap((places) => {
          //TAP
          //tap operator will recieve returned data that is manipulated by the map operator

          this._places.next(places);
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
    let generatedId: string;

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

    //Http responses is returned as an observable
    return this.http
      .post<{ name: string }>(
        "https://cozie-d78bb.firebaseio.com/offered-places.json",
        { ...newPlace, id: null }
      )
      .pipe(
        //SWITCHMAP
        //switchmap takes data from the current obsevable chain and returns a new observable
        //we do this because we need the data from http response but we stll need to return the original observable
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),

        //TAKE
        //take takes only the first emitted data as value for the function inside subscription and then cancels the subscription
        //we want to do this so we get only one object of places which is the current latest list of places and not listen to future updates
        //because it is a click listener and we do not want it ro run everytime the places changes
        take(1),
        tap((places) => {
          //TAP
          //tap is used to execute a piece of code without completing the variable
          //if we use subsrive the observable will complete so by using tap we can return it as observable
          //and access it in another file by calling subscribe and getting the data from subscribe

          //Since places is not an array and is a behaviour subject, to add places we
          //call next to emit an event with the newest data which is the old array of places + new place
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));

          //if we use settimeout to simulate delay it will not stop subsrcube from running
          //subscribe will run first before the async code finishes
        })
      );
  }
  
  
  constructor(private authService: AuthService, private http: HttpClient) {}
}
