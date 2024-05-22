import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-checked-icon",
  templateUrl: "./checked-icon.component.html",
  styleUrls: [
    "./checked-icon.component.css",
    "../calendar-header.component.css",
  ],
})
export class CheckedIconComponent implements OnInit {
  @Input("condition") set setCondition(value) {
    if (value !== this.condition) {
      this.condition = value;
    }
  }
  @Input("color") set setColor(value) {
    if (value !== this.color) {
      this.color = value;
    }
  }

  public condition = false;
  public color = false;

  constructor() {}

  ngOnInit() {}
}
