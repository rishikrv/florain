import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AppDataService } from '../services/app-data.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
  constructor() {}
 
  canActivate(): boolean {
    return false;
  }
}