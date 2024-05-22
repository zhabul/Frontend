import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-delete-error-modal",
  templateUrl: "./delete-error-modal.component.html",
  styleUrls: ["./delete-error-modal.component.css"],
})
export class DeleteErrorModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}
}
