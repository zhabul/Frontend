import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-wrapper-with-tabs",
  templateUrl: "./wrapper-with-tabs.component.html",
  styleUrls: ["./wrapper-with-tabs.component.css"],
})
export class WrapperWithTabsComponent implements OnInit {
  @Input("leftTabs") leftTabs: string[] = [
    "<span>Prvi</span>",
    "<span>Drugi</span>",
    "<span>treci</span>",
  ];
  @Input("rightTabs") rightTabs: string[] = [
    "<span>cetvrti</span>",
    "<span>peti</span>",
    "<span>sesti</span>",
  ];
  @Input('height') height: string = '85vh';

  constructor() {}

  ngOnInit(): void {}
}
