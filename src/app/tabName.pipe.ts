import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({
  name: "tabName",
})
export class TabNamePipe implements PipeTransform {
  transform(value: any): any {
    let tab = value;
    switch (tab) {
      case "0":
        tab = "No tab";
        break;
      case "1":
        tab = "Time Attest";
        break;
      case "2":
        tab = "Attachment And Documents";
        break;
      case "3":
        tab = "ATA";
        break;
      case "4":
        tab = "Deviation";
        break;
      case "5":
        tab = "Permit";
        break;
      case "6":
        tab = "Project plan";
        break;
      case "7":
        tab = "Quality Control";
        break;
      case "8":
        tab = "Weekly Report";
        break;
      case "9":
        tab = "Logs";
        break;
    }
    return tab;
  }
}
