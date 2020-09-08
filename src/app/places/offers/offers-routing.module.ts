import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { OffersPage } from "./offers.page";

//NOTE:
//HARDCODED PATH MUST PRECED PATH WITH DYNAMIC SEGEMENTS
//the reason is if :placeId os placed before /new
//then the url /new is treated as a pram for :placeId
const routes: Routes = [
  {
    path: "",
    component: OffersPage,
  },
  {
    path: "new",
    loadChildren: () =>
      import("./new-offer/new-offer.module").then((m) => m.NewOfferPageModule),
  },
  {
    path: "edit/:placeId",
    loadChildren: () =>
      import("./edit-offer/edit-offer.module").then(
        (m) => m.EditOfferPageModule
      ),
  },
  {
    path: ":placeId",
    loadChildren: () =>
      import("./offer-booking/offer-booking.module").then(
        (m) => m.OfferBookingPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersPageRoutingModule {}
