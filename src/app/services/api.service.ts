import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { api_urls, environment } from "src/environments/environment";
import { AppDataService } from "./app-data.service";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  token: any;

  constructor(private http: HttpClient, private appData: AppDataService) {}

  get(path): Observable<any> {
    console.log(this.token);

    let headers: HttpHeaders = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.get(environment.BASE_URL + path, { headers: headers });
  }

  category_details(path): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.get(environment.BASE_URL + `listing/category/${path}`, { headers: headers });
  }

  getCategory(): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.get(environment.BASE_URL + api_urls.grps, { headers: headers });
  }

  get_full(path): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.get(path, { headers: headers });
  }

  post(path, data): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json'
    }).set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.post(environment.BASE_URL + path, data, {
      headers: headers,
    });
  }

  delete(path): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.delete(environment.BASE_URL + path, { headers: headers });
  }
}
