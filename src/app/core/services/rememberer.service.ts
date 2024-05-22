import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class RemembererService {
  private remembererObject: any = {};

  public _setState(route: string, key: string, value: any): void {
    if (this.remembererObject[route] == undefined) {
      this.remembererObject[route] = {};
    }
    this.remembererObject[route][key] = value;
  }

  public getState(route: string, key: string, value: any) {
    if (
      this.remembererObject[route] == undefined ||
      this.remembererObject[route][key] == undefined
    ) {
      return value;
    }
    return this.remembererObject[route][key];
  }
}
