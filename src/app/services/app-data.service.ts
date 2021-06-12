import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs";
import { Platform } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class AppDataService {
  data: any[];
  order: any;
  feedbacks = [];
  category: any;
  page: any;
  product: any;
  guest_adddress: any;
  post: any;
  playerID: any;

  isAuthenticated: BehaviorSubject<boolean>;

  constructor(private storage: Storage, private plt: Platform) {
    this.isAuthenticated = new BehaviorSubject(false);
    this.data = [];
  }

  setData(key, value) {
    this.data[key] = value;
  }

  getData(key) {
    return this.data[key];
  }

  setValue(key, value) {
    // set a key/value
    return this.storage.set(key, value);
  }

  getValue(key) {
    return this.storage.get(key);
  }
}
