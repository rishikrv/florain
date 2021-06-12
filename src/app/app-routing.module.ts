import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./tabs/tabs.module").then((m) => m.TabsPageModule),
  // },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "wishlist",
    loadChildren: () =>
      import("./pages/wishlist/wishlist.module").then(
        (m) => m.WishlistPageModule
      ),
  },
  {
    path: "cart",
    loadChildren: () =>
      import("./pages/cart/cart.module").then((m) => m.CartPageModule),
  },
  {
    path: "account",
    loadChildren: () =>
      import("./pages/account/account.module").then(
        (m) => m.AccountPageModule
      ),
  },
  {
    path: "vendors",
    loadChildren: () =>
      import("./pages/vendors/vendors.module").then(
        (m) => m.VendorsPageModule
      ),
  },
  {
    path: "product",
    loadChildren: () =>
      import("./pages/product/product.module").then((m) => m.ProductPageModule),
  },
  {
    path: "orders",
    loadChildren: () =>
      import("./pages/orders/orders.module").then((m) => m.OrdersPageModule),
  },
  {
    path: "orders-details",
    loadChildren: () =>
      import("./pages/orders-details/orders-details.module").then(
        (m) => m.OrdersDetailsPageModule
      ),
  },
  {
    path: "checkout",
    loadChildren: () =>
      import("./pages/checkout/checkout.module").then(
        (m) => m.CheckoutPageModule
      ),
  },
  {
    path: "coupons",
    loadChildren: () =>
      import("./pages/coupons/coupons.module").then((m) => m.CouponsPageModule),
  },
  {
    path: "account-details",
    loadChildren: () =>
      import("./pages/account-details/account-details.module").then(
        (m) => m.AccountDetailsPageModule
      ),
  },
  {
    path: "category",
    loadChildren: () =>
      import("./pages/category/category.module").then(
        (m) => m.CategoryPageModule
      ),
  },
  {
    path: "add-address",
    loadChildren: () =>
      import("./pages/add-address/add-address.module").then(
        (m) => m.AddAddressPageModule
      ),
  },
  {
    path: "shop",
    loadChildren: () =>
      import("./pages/shop/shop.module").then((m) => m.ShopPageModule),
  },
  {
    path: "evaluate",
    loadChildren: () =>
      import("./pages/evaluate/evaluate.module").then(
        (m) => m.EvaluatePageModule
      ),
  },
  {
    path: "dispute",
    loadChildren: () =>
      import("./pages/dispute/dispute.module").then((m) => m.DisputePageModule),
  },
  {
    path: "disputes",
    loadChildren: () =>
      import("./pages/disputes/disputes.module").then(
        (m) => m.DisputesPageModule
      ),
  },
  {
    path: "dispute-details",
    loadChildren: () =>
      import("./pages/dispute-details/dispute-details.module").then(
        (m) => m.DisputeDetailsPageModule
      ),
  },
  {
    path: "reviews",
    loadChildren: () =>
      import("./pages/reviews/reviews.module").then((m) => m.ReviewsPageModule),
  },
  {
    path: "offer",
    loadChildren: () =>
      import("./pages/offer/offer.module").then((m) => m.OfferPageModule),
  },
  {
    path: "manufacturer",
    loadChildren: () =>
      import("./pages/manufacturer/manufacturer.module").then(
        (m) => m.ManufacturerPageModule
      ),
  },
  {
    path: "info",
    loadChildren: () =>
      import("./pages/info/info.module").then((m) => m.InfoPageModule),
  },
  {
    path: "conversation",
    loadChildren: () =>
      import("./pages/conversation/conversation.module").then(
        (m) => m.ConversationPageModule
      ),
  },
  {
    path: "contact-seller",
    loadChildren: () =>
      import("./pages/contact-seller/contact-seller.module").then(
        (m) => m.ContactSellerPageModule
      ),
  },
  // {
  //   path: "contact-seller",
  //   loadChildren: () =>
  //     import("./pages/contact-seller/contact-seller.module").then(
  //       (m) => m.ContactSellerPageModule
  //     ),
  // },
  {
    path: "response",
    loadChildren: () =>
      import("./pages/response/response.module").then(
        (m) => m.ResponsePageModule
      ),
  },
  {
    path: "conversations",
    loadChildren: () =>
      import("./pages/conversations/conversations.module").then(
        (m) => m.ConversationsPageModule
      ),
  },
  {
    path: "search",
    loadChildren: () =>
      import("./pages/search/search.module").then((m) => m.SearchPageModule),
  },
  {
    path: "categories",
    loadChildren: () =>
      import("./pages/categories/categories.module").then(
        (m) => m.CategoriesPageModule
      ),
  },
  {
    path: "blogs",
    loadChildren: () =>
      import("./pages/blogs/blogs.module").then((m) => m.BlogsPageModule),
  },
  {
    path: "blog",
    loadChildren: () =>
      import("./pages/blog/blog.module").then((m) => m.BlogPageModule),
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./pagess/settings/settings.module").then(
        (m) => m.SettingsPageModule
      ),
  },
  {
    path: 'list/:slug',
    loadChildren: () => import('./pages/list/list.module').then( m => m.ListPageModule)
  },
  

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
