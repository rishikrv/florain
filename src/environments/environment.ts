// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,

  BASE_URL: "http://test.floraindustry.com/public/api/",
  IMG_URL: "http://test.floraindustry.com/public/",
  firebaseConfig : {
    apiKey: "AIzaSyBvRCU1a4Me26Exp8Kq0HCAkBYinpvevys",
    authDomain: "flora-industry-98892.firebaseapp.com",
    projectId: "flora-industry-98892",
    storageBucket: "flora-industry-98892.appspot.com",
    messagingSenderId: "670897737217",
    appId: "1:670897737217:web:5548ea87584de0a1687a00",
    measurementId: "G-CJS3BW4ME2"
  }

};



export const api_urls = {
  verifyOTP:"auth/checkOTP",
  otp : "auth/sendOTP",
  login: "auth/login",
  social: "auth/social/",
  signup: "auth/register",
  logout: "auth/logout",
  dashboard: "dashboard",
  my_acc: "account/update",
  acc_updt: "account/update",
  pwd_updt: "password/update",
  sliders: "sliders",
  banners: "banners",
  categories: "categories/",
  categ_itm: "category/",
  grps: "category-grps",
  subgrps: "category-subgrps",
  lst_latst: "listings/latest",
  lst_pop: "listings/popular",
  lst_rand: "listings/random",
  lst_trend: "listings/trending",
  lst_sgl: "listing/",
  offers: "offers/",
  search: "search/",
  cat_itm: "category/",
  brand_itm: "brand/",
  contact_us: "page/contact-us",
  addTocart: "addToCart/",
  cartList: "carts",
  cartUpdate: "cart/",
  rem_cartItm: "cart/removeItem",
  apply_coupon: "/applyCoupon",
  addresses: "addresses",
  add_creat: "address/create",
  add_store: "address/store",
  add_edit: "address/",
  add_del: "address/",
  wishlist: "wishlist",
  addToWhishlist: "/add",
  del_wishlist: "/remove",
  coupons: "coupons",
  orders: "orders",
  order: "order/",
  orderConv: "/conversation",
  goodsReceived: "/goodsReceived",
  disputes: "disputes",
  disputesAct: "/disputes",
  dispute: "/dispute",
  disputeAct: "dispute/",
  lst_feedback: "/feedbacks",
  feedback: "/feedback",
  shop: "shop/",
  brand: "brand/",
  county: "countries",
  state: "states/",
  packaging: "packaging/",
  shipping: "/shipTo",
  payOps: "paymentOptions/",
  appeal: "/appeal",
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
