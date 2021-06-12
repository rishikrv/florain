import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "tab1",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../pages/home/home.module").then((m) => m.HomePageModule),
          },
        ],
      },
      {
        path: "tab2",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../pages/wishlist/wishlist.module").then(
                (m) => m.WishlistPageModule
              ),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../pages/cart/cart.module").then((m) => m.CartPageModule),
          },
        ],
      },
      {
        path: "tab4",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../pages/account/account.module").then(
                (m) => m.AccountPageModule
              ),
          },
        ],
      },
      {
        path: "tab5",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../pages/vendors/vendors.module").then(
                (m) => m.VendorsPageModule
              ),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/tabs/tab1",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/tabs/tab1",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
