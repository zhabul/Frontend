import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-chat-buble-arrow-for-app-module",
  templateUrl: "./chat-buble-arrow-for-app-module.component.html",
  styleUrls: ["./chat-buble-arrow-for-app-module.component.css"],
})
export class ChatBubleArrowForAppModuleComponent implements OnInit {
  @Input("type") type;

  public arrowStyle: any = {
    bottom: "-2px",
    left: "-8px",
  };

  constructor() {}

  ngOnInit() {
    if (this.type === "admin-chat") {
      this.arrowStyle = {
        bottom: "-2px",
        right: "-8px",
      };
    }
  }
}
