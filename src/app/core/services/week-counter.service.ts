import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class WeekCounterService {
  public numberOfWeek: any;
  public firstThursday: number;

  constructor() {}

  countWeek(date, week) {
    var dt = new Date(date);
    var numberOfWeek = moment(dt, "MM-DD-YYYY").week();
    return date + " " + numberOfWeek + " " + week;
  }
}
