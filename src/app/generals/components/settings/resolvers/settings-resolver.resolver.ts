import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { SettingsService } from "src/app/core/services/settings.service";

@Injectable({
  providedIn: "root",
})
export class SettingsResolverResolver implements Resolve<boolean> {
  constructor(private settingsService: SettingsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.settingsService.getAllGenerals();
  }
}