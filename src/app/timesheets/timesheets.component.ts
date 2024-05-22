import { Component, OnInit } from "@angular/core";
import { InputAutocompleteModule } from "src/app/utility/input-autocomplete/input-autocomplete.module";

@Component({
  selector: "app-timesheets",
  templateUrl: "./timesheets.component.html",
  styleUrls: ["./timesheets.component.css"],
  providers: [InputAutocompleteModule],
})
export class TimesheetsComponent implements OnInit {
  public userDetails: any;

  constructor() {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  }
}
