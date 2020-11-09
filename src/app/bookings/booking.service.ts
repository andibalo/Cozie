import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { take, tap, delay, switchMap, map } from "rxjs/operators";
import { Booking } from "./booking.model";
import { HttpClient } from "@angular/common/http";

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}
@Injectable({
  providedIn: "root",
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  cancelBooking(bookingId: string) {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http.delete(
          `https://cozie-d78bb.firebaseio.com/bookings/${bookingId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.bookings;
      }),
      //IMPORTANT to take 1 because what we return from switchmap is the behaviour subject
      //and we call next in the tap operator, with take it only takes the sanpshot of data and end the subscription
      //without it we create an infinte loop
      take(1),
      tap((bookings) => {
        this._bookings.next(
          bookings.filter((booking) => {
            booking.id !== bookingId;
          })
        );
      })
    );
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImg: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    let newBooking: Booking;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error("No user id found");
        }

        fetchedUserId = userId;

        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          fetchedUserId,
          placeTitle,
          guestNumber,
          placeImg,
          firstName,
          lastName,
          dateFrom,
          dateTo
        );

        return this.http.post<{ name: string }>(
          `ttps://cozie-d78bb.firebaseio.com/bookings.json?auth=${token}`,
          { ...newBooking, id: null }
        );
      }),
      //SWITCHMAP allows us to combine and share data between observables. It must return an observable
      //in this case we need a resdata from the http request observable in the bookings observable which is the array of bookings

      switchMap((resData) => {
        generatedId = resData.name;
        return this.bookings;
      }),
      //TAKE 1 is a must because we dont want to setup an ongoing subscription but only a snapshot of current data or the first emitted data
      take(1),
      tap((bookings) => {
        newBooking.id = generatedId;
        return this._bookings.next(bookings.concat(newBooking));
      })
    );

    // return this._bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((bookings) => {
    //     this._bookings.next(bookings.concat(newBooking));
    //   })
    // );
  }

  fetchBookings() {
    let fetchedUserId: string;

    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error("No user found");
        }

        fetchedUserId = userId;

        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: BookingData }>(
          `https://cozie-d78bb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
        );
      }),
      map((bookingData) => {
        const bookings = [];

        for (let key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(
              new Booking(
                key,
                bookingData[key].placeId,
                bookingData[key].userId,
                bookingData[key].placeTitle,
                bookingData[key].guestNumber,
                bookingData[key].placeImage,
                bookingData[key].firstName,
                bookingData[key].lastName,
                new Date(bookingData[key].bookedFrom),
                new Date(bookingData[key].bookedTo)
              )
            );
          }
        }

        return bookings;
      }),
      tap((bookings) => {
        this._bookings.next(bookings);
      })
    );
    /*return this.http.get<{ [key: string]: BookingData }>(
        `https://cozie-d78bb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
      );
      .pipe(
        //MAP
        //map takes a data and format it to something we want difference between switchmap is that switchmap needs
        //to reutrn a observable but map can return any type of data
        map((bookingData) => {
          const bookings = [];

          for (let key in bookingData) {
            if (bookingData.hasOwnProperty(key)) {
              bookings.push(
                new Booking(
                  key,
                  bookingData[key].placeId,
                  bookingData[key].userId,
                  bookingData[key].placeTitle,
                  bookingData[key].guestNumber,
                  bookingData[key].placeImage,
                  bookingData[key].firstName,
                  bookingData[key].lastName,
                  new Date(bookingData[key].bookedFrom),
                  new Date(bookingData[key].bookedTo)
                )
              );
            }
          }

          return bookings;
        }),
        tap((bookings) => {
          this._bookings.next(bookings);
        })
      );*/
  }
}
