import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-cal-confirmation-modal",
  templateUrl: "./cal-confirmation-modal.component.html",
  styleUrls: ["./cal-confirmation-modal.component.css"],
})
export class CalConfirmationModalComponent implements OnInit {
  @Input("modalInfo") modalInfo;
  @Output() confirm = new EventEmitter<any>();
  @Output() reject = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  confirmInput() {
    this.confirm.emit(this.modalInfo);
  }

  rejectInput() {
    this.reject.emit();
  }
}
