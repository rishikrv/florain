import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, EMPTY } from "rxjs";
import { map, catchError, retryWhen, delay, tap } from "rxjs/operators";
import { AppDataService } from "./app-data.service";
import { ApiService } from "./api.service";
import { UtilsService } from "./utils.service";

@Injectable({
  providedIn: "root",
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private data: AppDataService,
    private api: ApiService,
    private utils: UtilsService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (error.error.success === false) {
            this.utils.presentToast(error.error.message);
            console.log(error);
          } else {
            this.logout();
          }
        }
        return throwError(error);
      })
      // retryWhen((err) => {
      //   let retries = 1;

      //   return err.pipe(
      //     delay(1000),
      //     tap(() => {
      //       this.utils.presentToast("Request Timeout. Retrying...");
      //     }),
      //     map((error) => {
      //       if (retries++ == 3) {
      //         throw error;
      //       }
      //       return error;
      //     })
      //   );
      // }),

      // catchError((err) => {
      //   console.log(err);
      //   // this.utils.presentToast(err.error.error);
      //   this.utils.presentToast("Something went wrong. Try again");
      //   return EMPTY;
      // })
    );
  }

  logout() {
    this.data.setValue("isAuthenticated", null);
    this.data.setValue("currentUser", null);
    this.api.token = null;
    this.data.order = null;
    this.data.data = null;
    this.data.feedbacks = null;
    this.data.category = null;
    this.data.page = null;
    this.data.product = null;
    this.data.isAuthenticated.next(false);
  }
}
