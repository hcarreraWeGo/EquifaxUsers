import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { LocalStorageService } from "../shared/services/local.storage.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
  })
  export class AdminGuard  {
    constructor(public router: Router, private localStorageService:LocalStorageService) {}
  
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // Guard for user is login or not
      let user = JSON.parse(this.localStorageService.getItem("user"));
      if (!user || user === null) {
        this.router.navigate(["/auth/login"]);
        return true;
      } else if (user) {
        if (!Object.keys(user).length) {
          this.router.navigate(["/auth/login"]);
          return true;
        }
      }
      return true;
    }
  }