import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PrognosisTableService } from "../../prognosis-table/prognosis-table.service";

@Component({
  selector: "app-prognosis-layout-yellow-table",
  templateUrl: "./prognosis-layout-yellow-table.component.html",
  styleUrls: ["./prognosis-layout-yellow-table.component.css"],
})
export class PrognosisLayoutYellowTableComponent implements OnInit {
  /* @Input("_prognosis") set _prognosis(value) {
    if (value != this.prognosis) this.prognosis = value;
  } */
  @Input("_disabeButtons") set _disabeButtons(value) {
    if (value != this.disabeButtons) this.disabeButtons = value;
  }
  @Input("_spinner") set _spinner(value) {
    if (value != this.spinner) this.spinner = value;
  }

  @Input('_prognosis') set setPrognosis(value){
    if (this.prognosis !== value) {
      this.prognosis = value;
    }
  };

  @Output("savePrognosis") savePrognosis = new EventEmitter<string>();
  @Output("lockPrognosis") lockPrognosis = new EventEmitter<string>();

  disabeButtons: boolean = false;
  spinner: boolean = false;
  prognosis;
  userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private prognosisTableService: PrognosisTableService
  ) {}

  ngOnInit(): void {
    this.onSaveButtonStatus();
  }

  onSavePrognosis() {
    if(!this.userDetails.create_project_Forecast) {
      return;
    }
    this.savePrognosis.emit("save");
  }

  onLockPrognosis() {
    if(!this.userDetails.create_project_Forecast) {
      return;
    }
    this.lockPrognosis.emit("lock");
  }

  onSaveButtonStatus() {
    this.prognosisTableService.saveButtonStatus.subscribe({
      next: result => {
        this.prognosis.saved = result;
      }
    });
  }

}
