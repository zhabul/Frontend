import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { PrognosisTableService } from "../../prognosis-table.service";

@Component({
  selector: "app-prognosis-totals-by-type",
  templateUrl: "./prognosis-totals-by-type.component.html",
  styleUrls: ["./prognosis-totals-by-type.component.css"],
})
export class PrognosisTotalsByTypeComponent implements OnInit {

  @Input("name") name: string = "";
  @Input("_totalByType") set _totalByType(value) {
    if (value != this.totalByType){
      this.totalByType = value;
      this.resetValue++;
    } 

  }
  @Input()project_status;
  @Input('isLocked') set setIsLocked(value: boolean) {
    if (this.isLocked !== value) {
      this.isLocked = value;
    }
  }
  @Input("_predicted_total") set _predicted_total(value) {
    if (value != this.predicted_total) {
      this.predicted_total = value;
      this.resetPredictedValue++;
    }
  }
  @Input('isDisabled') set setIsDisabled(value: boolean) {
    this.isDisabled = value;
  }

  @Input("index") index: number = 0;
  @Output() returnedNumber = new EventEmitter<any>();
  totalByType;
  predicted_total;
  prognosisHaveBorder: boolean = false;
  resetValue: number = -1;
  resetPredictedValue: number = -1;
  isLocked: boolean = false;
  isDisabled: boolean = false;
  userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(public prognosisTableService: PrognosisTableService) {}

  ngOnInit(): void {
  }

  setProjectPrognos(e, predicted_data = false) {
    const value = e.target.value;
    this.prognosisTableService.saveButtonStatus.next(false);
    if (predicted_data)
      this.predicted_total = e.target.value;
    let type: string = "adw_prognosis";
    switch (this.name) {
      case "Material":
        type = "material_prognosis";
        break;
      case "UE/Other":
        type = "other_prognosis";
        break;
      default:
        type = "adw_prognosis";
    }

    this.prognosisTableService.setPrognosisTotalsByType.next({
      type: type,
      value: value,
      index: this.index,
      predicted_data: predicted_data
    });

    let obj = {
      'value': value,
      'predicted_data': predicted_data
    }
    this.returnedNumber.emit(obj);
  }

  setGridLayout(): string {
    return `auto 120px 110px 110px 110px 110px 110px ${
      this.prognosisTableService.hasRiktpris ? "130px" : ""
    } ${this.prognosisTableService.hasRiktpris ? "140px" : "130px"} ${
      this.prognosisTableService.hasRiktpris ? "84px" : "66px"
    }`;
  }


}
