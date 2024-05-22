import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { PrognosisTableService } from "../../prognosis-table.service";
import { PrognosisTabEnterService } from "../../prognosis-tab-enter.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-prognosis-property-ata-row",
  templateUrl: "./prognosis-property-ata-row.component.html",
  styleUrls: ["./prognosis-property-ata-row.component.css"]
})
export class PrognosisPropertyAtaRowComponent implements OnInit, OnDestroy {
  @Input("_ata") set _ata(value) {
    if (value != this.ata) this.ata = value;
  }
  @Input("_projectDebit") set _projectDebit(value) {
    if (value != this.projectDebit) this.projectDebit = value;
  }
  @Input("projectIndex") projectIndex: number = -1;
  @Input("ataIndex") ataIndex: number = -1;
  @Input('isLocked') set setIsLocked(value: boolean) {
    if (this.isLocked !== value) this.isLocked = value;
  }

  @Output('findNewActiveIndex') findNewActiveIndex: EventEmitter<number> = new EventEmitter();

  @ViewChild('inputElement') inputElement: ElementRef;

  ata;
  projectDebit: number = -1;
  prognosisHaveBorder: boolean = false;
  isLocked: boolean = false;
  userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  
  constructor(
    private router: Router,
    public prognosisTableService: PrognosisTableService,
    private prognosisTabEnterService: PrognosisTabEnterService
  ) {}

  ngOnInit(): void {
    this.setFocusOnInput();
    this.getValue();
  }


  edit() {
    if (!this.ata) return;
    this.router.navigate(["/projects/view/ata/modify-ata/", this.ata.id], {
      queryParams: {
        type: "external",
        projectId: this.ata.ProjectID,
        from: "forecast",
      },
    });
  }

  getAtaStatusClass() {
    if (!this.ata) return "";
    let rowClass = "";
    switch (this.ata.Status.toString()) {
      case "0":
        rowClass = "wemax-yellow1";
        break;
      case "2":
        rowClass = "wemax-green1";
        break;
      case "3":
        rowClass = "wemax-red1";
        break;
      case "4":
        rowClass = "wemax-purple1";
        break;
      case "5":
        rowClass = "wemax-white1";
        break;
      case "6":
        rowClass = "wemax-aborted1";
        break;
      case "7":
        rowClass = "wemax-clear1";
        break;
      default:
        console.error(
          "Your status (" + this.ata.status + ") is NOT good, fix it."
        );
    }

    return rowClass;
  }

  printValue() {
    if (!this.ata) return "";
    let prognos = "";
    if (this.ata.PaymentType != 5) prognos = this.ata.prognosis;
    return prognos;
  }

  getValue() {
    this.inputValue = this.printValue();
  }

  onBlur(e) {
    e.stopPropagation();
    this.prognosisHaveBorder = false;
    const value = e.target.value;
    this.prognosisTableService.onBlurAtaPrognos.next({
      data: this.ata,
      value: value,
      ataIndex: this.ataIndex,
      projectIndex: this.projectIndex,
    });
  }

  onChange(e) {
    e.stopPropagation();
    const value = e.target.value;
    this.prognosisTableService.updateAtaPrognos.next({
      data: this.ata,
      value: value,
      projectIndex: this.projectIndex,
      ataIndex: this.ataIndex,
      eventClick: "on_change",
    });
  }

  onKeyUp(e) {
    e.stopPropagation();
    const value = e.target.value;
    this.prognosisTableService.updateAtaPrognos.next({
      data: this.ata,
      value: value,
      projectIndex: this.projectIndex,
      ataIndex: this.ataIndex,
      eventClick: "on_enter",
    });
  }

  updateAtaPrognosis(e) {
    const value = e.target.value;
    this.prognosisTableService.saveButtonStatus.next(false);
    this.ata.prognosis = value === "" ? 0 : value;
    this.prognosisTableService.trigetUpdateTotalAtas.next(this.ata);
    this.getValue();
  }

  setGridLayout(): string {
    return `75px auto 40px 80px 110px 110px 110px 110px 110px ${
      this.prognosisTableService.hasRiktpris ? "130px" : ""
    } ${this.prognosisTableService.hasRiktpris ? "140px" : "130px"} ${
      this.prognosisTableService.hasRiktpris ? "84px" : "66px"
    }`;
  }

  phantomEnterBehavious(event) {
    const key = event.key;
    if (key === 'Enter') {
      event.preventDefault();
      this.findNewActiveIndex.emit(this.ataIndex);
      //emit
    }
  }


  focusOnInputSub: Subscription | undefined;
  setFocusOnInput() {
    this.focusOnInputSub = this.prognosisTabEnterService.activeDuAtaIndex$.subscribe({
      next: (activeDuAtaIndex: {duIndex: number; ataIndex: number}) => {
        if (this.ataIndex == activeDuAtaIndex.ataIndex && this.projectIndex == activeDuAtaIndex.duIndex) {
          if (!this.inputElement) return;
          this.inputElement.nativeElement.focus();
          this.inputElement.nativeElement.select();
        }

      }
    })
  }


  inputValue: string = '0';
  /* onFocus() {
    this.prognosisHaveBorder = true;
    if (this.inputValue === '0' || this.inputValue === '0.00') {
      this.inputValue = '';
    }
  } */

  ngOnDestroy(): void {
    this.focusOnInputSub?.unsubscribe();
  }
}
