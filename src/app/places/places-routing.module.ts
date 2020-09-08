import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PlacesPage } from "./places.page";

//TABS NAVIGATION
//in order to use ionic tab navigation the routing module of the page which view contains the ion tabs
//component has to have children routes of the different tabs.
//in this example the ion tab refrensces discover and offers, so we have both routes as children of the places route
//so in palces it renders the discover and offer components when the route is visited by the tab nav

const routes: Routes = [
  {
    path: "",
    component: PlacesPage,
    children: [
      {
        path: "discover",
        loadChildren: () =>
          import("./discover/discover.module").then(
            (m) => m.DiscoverPageModule
          ),
      },
      {
        path: "offers",
        loadChildren: () =>
          import("./offers/offers.module").then((m) => m.OffersPageModule),
      },
      {
        path: "",
        redirectTo: "/places/discover",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/places/discover",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
