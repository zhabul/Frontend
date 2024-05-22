import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { PrognosisTableService } from "../prognosis-table.service";

@Component({
  selector: "app-prognosis-property-ata",
  templateUrl: "./prognosis-property-ata.component.html",
  styleUrls: ["./prognosis-property-ata.component.css"],
})
export class PrognosisPropertyAtaComponent implements OnInit {
  @Input("_atas") set _atas(value) {
    if (value && value != this.atas) {
      this.atas = value;
    }
  }
  @Input("_projectDebit") set _projectDebit(value) {
    if (value != this.projectDebit) this.projectDebit = value;
  }
  @Input("_ataTotals") set _ataTotals(value) {
    if (value != this.ataTotals) this.ataTotals = value;
  }
  @Input("_totalOfAtas") set _totalOfAtas(value) {
    if (value != this.totalOfAtas) this.totalOfAtas = value;
  }

  @Input('isLocked') set setIsLocked(value: boolean) {
    if (this.isLocked !== value) this.isLocked = value;
  }

  @Input("activeAtaIndex") activeAtaIndex;
  @Output('findNewActiveIndex') findNewActiveIndex: EventEmitter<number> = new EventEmitter();

  @Input("index") index: number = -1;

  atas = [];
  areAtasOpen: boolean = true;
  atasHeight: string = "";
  projectDebit: number = -1;
  ataTotals;
  totalOfAtas;
  isLocked: boolean = false;

  constructor(public prognosisTableService: PrognosisTableService) {}

  ngOnInit(): void {
  }

  onOpenAtas() {
    this.areAtasOpen = !this.areAtasOpen;
  }

  setGridLayout(): string {
    return `auto 40px 80px 110px 110px 110px 110px 110px ${
      this.prognosisTableService.hasRiktpris ? "130px" : ""
    } ${this.prognosisTableService.hasRiktpris ? "140px" : "130px"} ${
      this.prognosisTableService.hasRiktpris ? "84px" : "66px"
    }`;
  }

  activeIndexListener(ataIndex) {
    this.findNewActiveIndex.emit(ataIndex);
  }
}
