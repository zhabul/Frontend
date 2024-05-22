import { Input, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-send-icon",
  templateUrl: "./send-icon.component.html",
  styleUrls: ["./send-icon.component.css"],
})
export class SendIconComponent implements OnInit {
  @Input() emailLog;
  fill = "#DDD";
  constructor() {}

  ngOnInit(): void {
    this.setIconColor();
  }

  setIconColor() {
    switch (this.emailLog.Status) {
      case "0":
          this.fill = "#858585";
        break;
      case "1":
        // this.fill = "#82A7E2";

        if(this.emailLog.reminder){
          if (this.emailLog.active === "1" && this.emailLog.reminder === "0") {
            this.fill = "#82A7E2"; // Postavite plavu boju send i aktivno jos uvijek
          } else if ( this.emailLog.active === "0" && this.emailLog.reminder === "0") {
            this.fill = "#858585"; // Postavite sivu boju send ali nije ni otvoreno ni odgovoreno
          } else if ( this.emailLog.active === "0" && this.emailLog.reminder === "1") {
            this.fill = "#858585"; // Postavite sivu boju send ali nije ni otvoreno ni odgovoreno
          } else if(this.emailLog.reminder !== "0"){
            this.fill = "#FF7000";
          }
        }else{
          this.emailLog.active === "1" ? this.fill = "#82A7E2" : this.fill = "#858585";
        }
        break;
      case "7":
        this.fill = "#858585";
        break;
      case "5":
        this.fill = "#858585";
        break;
      case "4":
        this.fill = "#858585";
        break;
      case "6":
        this.fill = "#858585";
        break;
    }
  }
}
