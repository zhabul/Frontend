import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-chat-bubble-arrow",
  templateUrl: "./chat-bubble-arrow.component.html",
  styleUrls: ["./chat-bubble-arrow.component.css"],
})
export class ChatBubbleArrowComponent implements OnInit {
  @Input("type") type;

  public arrowStyle: any = {
    bottom: "-7px",
    left: "-8px",
  };

  constructor() {}

  ngOnInit() {
    if (this.type === "admin-chat") {
      this.arrowStyle = {
        bottom: "-7px",
        right: "-8px",
      };
    }
  }
}
