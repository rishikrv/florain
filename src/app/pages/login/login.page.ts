import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
// import { GooglePlus } from "@ionic-native/google-plus/ngx";
// import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { api_urls } from "../../../environments/environment";
import { AppDataService } from "src/app/services/app-data.service";
import {
  NavController,
  ModalController,
  isPlatform,
  AlertController,
} from "@ionic/angular";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";

import { HttpClient } from "@angular/common/http";

import "@codetrix-studio/capacitor-google-auth";
import { Router } from "@angular/router";

import {
  FacebookLogin,
  FacebookLoginPlugin,
} from "@capacitor-community/facebook-login";
import { Plugins, registerWebPlugin } from "@capacitor/core";
registerWebPlugin(FacebookLogin);

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  userForm: FormGroup;
  userRegForm: FormGroup;
  RegForm: FormGroup;
  loginForm = true;
  RegForm_Check = false;
  LoginOtp = false;
  showPassword: boolean;
  showPassword1: boolean;

  fbAccessToken;
  googleAccessToken;

  userInfo = null;
  fbLogin;
  user = null;
  token = null;
  usertype: any;
  
  updateUser: any;
  userData: { email: any; name: any; phone: any; address: any; dob: any; houseName: any; roadName: any; city: any; pincode: any; landMark: any; };
  Data: { name: any; businessName: any; email: string; phone: string; address: string; businessType: string; loginType: number; city: string; pincode: number; };
  contactNumber: any;
  constructor(
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    // private googlePlus: GooglePlus,
    // private fb: Facebook,
    private router: Router,
    private appData: AppDataService,
    private nav: NavController,
    private api: ApiService,
    private utils: UtilsService,
    private model: ModalController,
    private http: HttpClient
  ) {
    this.showPassword = false;
    this.showPassword1 = false;
    this.userForm = formBuilder.group({
      email: ["", Validators.compose([Validators.email, Validators.required])],
      password: ["", Validators.required],
    });

    this.RegForm = formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.compose([Validators.email, Validators.required])],
      number: ["", Validators.required],
      address: ["", Validators.required],
      dob: ["", Validators.required],
      hName: ["", Validators.required],
      rName: ["", Validators.required],
      City: ["", Validators.required],
      pinCode: ["", Validators.required],
      landMark: ["", Validators.required],
      businessName: ["", Validators.required],
      bType: ["", Validators.required],
    });

    let EMAILPATTERN =
      /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.userRegForm = formBuilder.group({
      // name: ["", Validators.required],
      // email: ["", [Validators.required, Validators.pattern(EMAILPATTERN)]],
      // password: ["", Validators.required],
      // password_confirmation: [
      //   "",
      //   Validators.required,
      //   this.passwordMatch.bind(this),
      // ],
      // agree: [true, Validators.required],
      // accepts_marketing: [],
      contact_number: ["", Validators.required],
    });

    // this.setupFbLogin();
    const { FacebookLogin } = Plugins;
    this.fbLogin = FacebookLogin;
  }

  ngOnInit() {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  togglePassword1() {
    this.showPassword1 = !this.showPassword1;
  }

  validateLogin() {
    if (!this.userForm.valid) {
      this.utils.presentAlert("", "Invalid details");
    } else {
      //

      console.log("valid form");

      this.login();
    }
  }

  async login() {
    this.utils.presentLoading("Please wait");

    try {
      let resp = await this.api
        .post(api_urls.login, this.userForm.value)
        .toPromise();
      console.log(resp);

      this.utils.dismissLoading();
      if (resp.data) {
        //remember user login data for future use
        this.api.token = resp.data.api_token;
        this.appData.setValue("isAuthenticated", true);
        this.appData.setValue("currentUser", JSON.stringify(resp.data));
        this.appData.isAuthenticated.next(true);
        this.model.dismiss({ isAuthenticated: true });
      } else {
        this.utils.presentAlert("Message", resp.message);
      }
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.utils.presentAlert("Login error", error.error.message);
    }

    // try {
    //   let resp = await this.api
    //     .newPost(api_urls.login, this.userForm.value)
    //     .toPromise();
    //   console.log(resp);

    //   this.utils.dismissLoading();
    //   if (resp.data) {
    //     //remember user login data for future use
    //     this.api.token = resp.data.api_token;
    //     this.appData.setValue("isAuthenticated", true);
    //     this.appData.setValue("currentUser", JSON.stringify(resp.data));
    //     this.appData.isAuthenticated.next(true);
    //     this.model.dismiss({ isAuthenticated: true });
    //   } else {
    //     this.utils.presentAlert("Message", resp.message);
    //   }
    // } catch (error) {
    //   this.utils.dismissLoading();
    //   console.log(error);
    //   this.utils.presentAlert("Login error", error.error.message);
    // }
  }

  async register() {
    console.log(this.userRegForm.value);

    // try {
    //   let resp = await this.api
    //     .newPost(api_urls.signup, this.userRegForm.value)
    //     .toPromise();
    //   console.log('try');

    //   console.log(resp);

    //   if (resp.data) {
    //       this.utils.presentToast("Successfully registered");
    //       //remember user login data for future use
    //       this.api.token = resp.data.api_token;
    //       this.appData.setValue("isAuthenticated", true);
    //       this.appData.setValue("currentUser", JSON.stringify(resp.data));
    //       this.appData.isAuthenticated.next(true);
    //       this.model.dismiss({ isAuthenticated: true });
    //     } else {
    //       this.utils.presentToast(resp.message);
    //     }
    // } catch (error) {
    //   console.log(error.error);

    //   if(error.error.errors.email){
    //     this.utils.presentAlert("Registration Error", error.error.errors.email[0]);
    //   } else if (error.error.errors.password) {
    //     this.utils.presentAlert("Registration Error", "Invalied Password");
    //   } else {
    //     this.utils.presentAlert("Registration Error", error.error.message);
    //   }
    // }

    try {
      let resp = await this.api
        .post(api_urls.signup, this.userRegForm.value)
        .toPromise();
      console.log("try");

      console.log(resp);

      if (resp.data) {
        this.utils.presentToast("Successfully registered");
        //remember user login data for future use
        this.api.token = resp.data.api_token;
        this.appData.setValue("isAuthenticated", true);
        this.appData.setValue("currentUser", JSON.stringify(resp.data));
        this.appData.isAuthenticated.next(true);
        this.model.dismiss({ isAuthenticated: true });
      } else {
        this.utils.presentToast(resp.message);
      }
    } catch (error) {
      console.log(error.error);

      if (error.error.errors.email) {
        this.utils.presentAlert(
          "Registration Error",
          error.error.errors.email[0]
        );
      } else if (error.error.errors.password) {
        this.utils.presentAlert("Registration Error", "Invalied Password");
      } else {
        this.utils.presentAlert("Registration Error", error.error.message);
      }
    }

    // if (this.userRegForm.valid) {
    //   this.api
    //     .post(api_urls.signup, this.userRegForm.value)
    //     .subscribe((resp: any) => {
    //       console.log('hhjghjggjhg');

    //       // console.log(resp);
    //       // if (resp.data) {
    //       //   this.utils.presentToast("Successfully registered");
    //       //   //remember user login data for future use
    //       //   this.api.token = resp.data.api_token;
    //       //   this.appData.setValue("isAuthenticated", true);
    //       //   this.appData.setValue("currentUser", JSON.stringify(resp.data));
    //       //   this.appData.isAuthenticated.next(true);
    //       //   this.model.dismiss({ isAuthenticated: true });
    //       // } else {
    //       //   this.utils.presentToast(resp.message);
    //       // }
    //     });
    // } else {
    //   this.utils.presentAlert("Register Alert", "Invalid Form Data");
    // }
  }

  passwordMatch(val) {
    return new Promise((resolve) => {
      if (val.value == this.userRegForm.value.password) {
        resolve(null);
      } else {
        resolve({ mismatch: true });
      }
    });
  }

  toggleLogin(id) {
    if (this.loginForm) {
      this.loginForm = false;
      this.usertype = id;
      this.LoginOtp = true;
      console.log(this.usertype);
    } else {
      this.loginForm = true;
    }
  }

  async googleSignup() {
    // console.log('this.router.url', this.router.url);
    const googleUser = await Plugins.GoogleAuth.signIn();
    // console.log('my user: ', googleUser);
    // this.userInfo = googleUser;
    console.log(googleUser.authentication.accessToken);

    this.socialLoginCall(googleUser.authentication.accessToken, "google");
  }

  googleLogin() {}

  // async setupFbLogin() {
  //   if (isPlatform('desktop')) {
  //     this.fbLogin = FacebookLogin;
  //   } else {
  //     // Use the native implementation inside a real app!
  //     const { FacebookLogin } = Plugins;
  //     this.fbLogin = FacebookLogin;
  //   }
  // }

  async facebookLoginButton() {
    console.log(this.fbLogin);

    // console.log('fb login');

    // this.fb
    //   .login(["public_profile", "email"])
    //   .then((res: FacebookLoginResponse) => {
    //     this.socialLoginCall(res.authResponse.accessToken, "facebook");
    //     //this.utils.presentToast(JSON.stringify(res.authResponse));
    //   })
    //   .catch((e) => {
    //     console.log("Error logging into Facebook", e);
    //     this.utils.presentToast("Error logging into Facebook");
    //   });

    const FACEBOOK_PERMISSIONS = ["email"];
    const result = await this.fbLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });
    console.log("permission: ", result.accessToken.token);
    this.socialLoginCall(result.accessToken.token, "facebook");

    if (result.accessToken && result.accessToken.userId) {
      this.token = result.accessToken;
      this.loadUserData();
    } else if (result.accessToken && !result.accessToken.userId) {
      // Web only gets the token but not the user ID
      // Directly call get token to retrieve it now
      this.getCurrentToken();
    } else {
      // Login failed
    }
  }

  async getCurrentToken() {
    const result = await this.fbLogin.getCurrentAccessToken();

    console.log("current token: ", result);

    if (result.accessToken) {
      this.token = result.accessToken;
      this.loadUserData();
    } else {
      // Not logged in.
    }
  }

  async loadUserData() {
    const url = `https://graph.facebook.com/${this.token.userId}?
    fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
    this.http.get(url).subscribe((res) => {
      this.user = res;
      console.log("user details: ", res);
    });
  }

  async socialLoginCall(access_token, prom) {
    try {
      this.utils.presentLoading("");
      let resp = await this.api
        .post(api_urls.social + prom, { access_token: access_token })
        .toPromise();

      console.log(resp);
      // this.utils.presentToast(JSON.stringify(resp));

      if (resp.data) {
        this.utils.dismissLoading();
        this.api.token = resp.data.api_token;
        this.appData.setValue("isAuthenticated", true);
        this.appData.setValue("currentUser", JSON.stringify(resp.data));
        this.appData.isAuthenticated.next(true);
        this.model.dismiss({ isAuthenticated: true });
        // this.utils.presentAlert("debug", JSON.stringify(resp));
      } else {
        this.utils.presentToast(resp.message);
      }
    } catch (error) {
      this.utils.dismissLoading();
      console.log(error);
      this.utils.presentToast(JSON.stringify(error));
    }
  }

  goBack() {
    this.model.dismiss({ isAuthenticated: false });
  }
  login_otp() {
    console.log(this.userRegForm.value);
    console.log(this.usertype);
    if (!this.userRegForm.valid) {
      this.utils.presentAlert("", "Invalid details");
    } else {
      //
      console.log("valid form");

      this.otp();
    }
  }
  async otp() {
    const data = {
      phone: this.userRegForm.value.contact_number,
      user_role: this.usertype,
    };
    this.utils.presentLoading("Please wait");

    try {
      let resp = await this.api.post(api_urls.login, data).toPromise();
      console.log(resp);

      this.utils.dismissLoading();
      if (resp.data) {
        //remember user login data for future use
        this.api.token = resp.data.api_token;
        this.appData.setValue("isAuthenticated", true);
        this.appData.setValue("currentUser", JSON.stringify(resp.data));
        this.appData.isAuthenticated.next(true);
        this.model.dismiss({ isAuthenticated: true });
      } else {
        this.utils.presentAlert("hello", resp.message);
      }
    } catch (error) {
      this.utils.dismissLoading();
      if (error.status == 401) {
        this.RegForm_Check = true;
        this.loginForm = false;
        this.LoginOtp = false;
        this.updateUser = this.usertype;
        this.contactNumber = this.userRegForm.value.contact_number
      }
    }
  }
  register_user() {
    if(this.updateUser==1){
      this.userData ={
        "email":this.RegForm.value.email,
        "name" : this.RegForm.value.name,
        "phone":this.RegForm.value.number,
        "address":this.RegForm.value.address,
        "dob" :this.RegForm.value.dob,
        "houseName" : this.RegForm.value.hName,
        "roadName": this.RegForm.value.rName,
        "city" :this.RegForm.value.City,
        "pincode" :this.RegForm.value.pinCode,
        "landMark":this.RegForm.value.landMark
      }
      this.UserRegister(this.userData);
    }
    else{
      this.Data ={
        "name" :this.RegForm.value.name,
        "businessName" :this.RegForm.value.businessName,
        "email":this.RegForm.value.email,
        "phone" :this.RegForm.value.number,
        "address":this.RegForm.value.address,
        "businessType" : this.RegForm.value.bType,
        "loginType" : 2,
        "city" : this.RegForm.value.city,
        "pincode" :this.RegForm.value.pCode
      }
      this.UserRegister(this.Data);
    }
  }
  async UserRegister(data){
    console.log(data)
    this.utils.presentLoading("Please wait");
    try {
      let resp = await this.api.post(api_urls.signup, data).toPromise();
      console.log(resp);

      this.utils.dismissLoading();
      if (resp.data) {
        //remember user login data for future use
        this.api.token = resp.data.api_token;
        this.appData.setValue("isAuthenticated", true);
        this.appData.setValue("currentUser", JSON.stringify(resp.data));
        this.appData.isAuthenticated.next(true);
        this.model.dismiss({ isAuthenticated: true });
      } else {
        this.utils.presentAlert("hello", resp.message);
      }
    } catch (error) {
      this.utils.dismissLoading();
      this.utils.presentAlert("hello", error.error.message);
    }
  }
}
