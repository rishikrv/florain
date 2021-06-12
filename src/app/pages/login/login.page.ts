import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
// import { GooglePlus } from "@ionic-native/google-plus/ngx";
// import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { api_urls } from "../../../environments/environment";
import { AppDataService } from "src/app/services/app-data.service";
import { NavController, ModalController, isPlatform } from "@ionic/angular";
import { ApiService } from "src/app/services/api.service";
import { UtilsService } from "src/app/services/utils.service";

import { HttpClient } from '@angular/common/http';

import '@codetrix-studio/capacitor-google-auth';
import { Router } from '@angular/router';

import { FacebookLogin, FacebookLoginPlugin } from '@capacitor-community/facebook-login';
import { Plugins, registerWebPlugin } from '@capacitor/core';
registerWebPlugin(FacebookLogin);

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  userForm: FormGroup;
  userRegForm: FormGroup;
  loginForm = true;
  showPassword: boolean;
  showPassword1: boolean;

  fbAccessToken;
  googleAccessToken;

  userInfo = null;
  fbLogin;
  user = null;
  token = null;

  constructor(
    public formBuilder: FormBuilder,
    // private googlePlus: GooglePlus,
    // private fb: Facebook,
    private router: Router,
    private appData: AppDataService,
    private nav: NavController,
    private api: ApiService,
    private utils: UtilsService,
    private model: ModalController,
    private http: HttpClient,
  ) {
    this.showPassword = false;
    this.showPassword1 = false;
    this.userForm = formBuilder.group({
      email: ["", Validators.compose([Validators.email, Validators.required])],
      password: ["", Validators.required],
    });

    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.userRegForm = formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(EMAILPATTERN)]],
      password: ["", Validators.required],
      password_confirmation: [
        "",
        Validators.required,
        this.passwordMatch.bind(this),
      ],
      agree: [true, Validators.required],
      accepts_marketing: [],
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
      console.log('try');
        
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
      
      if(error.error.errors.email){
        this.utils.presentAlert("Registration Error", error.error.errors.email[0]);
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

  


  toggleLogin() {
    if (this.loginForm) {
      this.loginForm = false;
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

    const FACEBOOK_PERMISSIONS = ['email'];
    const result = await this.fbLogin.login({ permissions: FACEBOOK_PERMISSIONS });
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
    this.http.get(url).subscribe(res => {
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
}
