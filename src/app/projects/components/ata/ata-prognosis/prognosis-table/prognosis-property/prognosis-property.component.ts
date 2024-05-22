import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { PrognosisTableService } from "../prognosis-table.service";
import { Subscription } from "rxjs";
import { ProjectsService } from "src/app/core/services/projects.service";
import { PrognosisTabEnterService } from "../prognosis-tab-enter.service";

@Component({
  selector: "app-prognosis-property",
  templateUrl: "./prognosis-property.component.html",
  styleUrls: ["./prognosis-property.component.css"],
})
export class PrognosisPropertyComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input("_property") set _property(value) {
    if (value != this.property) {
      this.mainFunctionOnSetter(value);
    }
  }
  @Input("_isLocked") set _isLocked(value) {
    if (value != this.isLocked) this.isLocked = value;
  }
  @Input("index") index: number = -1;

  /* @Input("activeDuIndex") set setActiveDuIndex(value) {
    if (this.index == value && this.inputElement) {
      this.inputElement.nativeElement.focus();
    }
  } */

  @Output("findNextDu") findNextDu = new EventEmitter<number>();

  @ViewChild("inputElement") inputElement: ElementRef;
  @ViewChild("inputPredictedElement") inputPredictedElement: ElementRef;

  isOpenTotalsByType: boolean = false;
  isTopLevel: boolean = false;
  prognosisHaveBorder: boolean = false;
  property;
  isLocked: boolean = false;
  totalOfAtas;
  userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  areTotalsByTypeDisabled: boolean = false;

  onBlurTotalAtaSub: Subscription | undefined;
  trigetUpdateTotalAtasSub: Subscription | undefined;

  constructor(
    // private prognosisTable: PrognosisTableService,
    public prognosisTableService: PrognosisTableService,
    private projectService: ProjectsService,
    private prognosisTabEnterService: PrognosisTabEnterService
  ) {}

  ngOnInit(): void {
    this.onBlurTotalAta();
    this.trigetUpdateTotalAtasFun();
    this.setFocusOnInput();
  }

  ngAfterViewInit(): void {
    if (this.inputElement.nativeElement.disabled) return;
    //this.prognosisTableService.inputElements.push(this.inputElement);
    //this.prognosisTableService.inputElementsId.push(this.inputElement.nativeElement.id);
  }

  inputValue: string = "0";
  project_total: number = 0;

  mainFunctionOnSetter(value) {
    this.property = value;
    this.totalOfAtas = this.printTotal();
    this.property.kalkyleratPris =
      this.printTotalRikt() + this.property.project_contract_amount;
    this.getPropertyResursKonto();
    this.isTopLevel = this.property.level == 0 ? true : false;
    this.inputValue = `${this.property.project_du_totals.prognosis}`;
    this.project_total = this.property.project_du_totals.total;
    this.areTotalsByTypeDisabled = this.areTotalsDisabled();
  }

  areTotalsDisabled() {
    if (
      this.isLocked ||
      this.property.project_debit == 2 ||
      this.property.project_status != 2 ||
      !this.userDetails.create_project_Forecast
    )
      return true;
    else return false;
  }

  setProjectPrognos(e) {
    const value = e.target.value;
    this.prognosisTableService.saveButtonStatus.next(false);
    this.property.project_du_totals.prognosis =
      value === "" ? 0 : parseFloat(value);

    this.property.project_du_totals_by_type.project_du_totals_additional_work.prognosis = 0;
    this.property.project_du_totals_by_type.project_du_totals_materials.prognosis = 0;
    this.property.project_du_totals_by_type.project_du_totals_other_work.prognosis = 0;

    // da trigeruje input u child komponenti
    this.property.project_du_totals_by_type.project_du_totals_additional_work =
      {
        ...this.property.project_du_totals_by_type
          .project_du_totals_additional_work,
      };
    this.property.project_du_totals_by_type.project_du_totals_materials = {
      ...this.property.project_du_totals_by_type.project_du_totals_materials,
    };
    this.property.project_du_totals_by_type.project_du_totals_other_work = {
      ...this.property.project_du_totals_by_type.project_du_totals_other_work,
    };
  }

  setProjectPrognosTotal(e) {
    const value = e.target.value;
    this.prognosisTableService.saveButtonStatus.next(false);
    this.property.project_du_totals.total =
      value === "" ? 0 : parseFloat(value);

    this.property.project_du_totals.additional_work = "0";
    this.property.project_du_totals.material = "0";
    this.property.project_du_totals.other = "0";
  }

  setGridLayout(): string {
    return `auto 120px 110px 110px 110px 110px 110px ${
      this.prognosisTableService.hasRiktpris ? "130px" : ""
    } ${this.prognosisTableService.hasRiktpris ? "140px" : "130px"} ${
      this.prognosisTableService.hasRiktpris ? "84px" : "66px"
    }`;
  }

  printTotal() {
    const atas = this.property.atas;
    return atas.reduce((prev, ata) => {
      return (
        prev + Number(ata.prognosis && ata.PaymentType != 5 ? ata.prognosis : 0)
      );
    }, 0);
  }

  printTotalRikt() {
    const atas = this.property.atas;
    return atas.reduce((prev, ata) => {
      return (
        prev + Number(ata.ata_total && ata.PaymentType == 5 ? ata.ata_total : 0)
      );
    }, 0);
  }

  onBlurTotalAta() {
    this.onBlurTotalAtaSub =
      this.prognosisTableService.onBlurAtaPrognos.subscribe({
        next: (result) => {
          if (!result) return;
          this.totalOfAtas = this.printTotal();
        },
      });
  }

  trigetUpdateTotalAtasFun() {
    this.trigetUpdateTotalAtasSub =
      this.prognosisTableService.trigetUpdateTotalAtas.subscribe({
        next: (ata) => {
          if (!ata) return;
          this.totalOfAtas = this.printTotal();
          this.property.ataTotal = this.totalOfAtas;
        },
      });
  }

  getPropertyResursKonto() {
    this.projectService.getProject(this.property?.project_id).then((result) => {
      this.property.duResursKonto = result.resursKonto1;
    });
  }

  public activeAtaIndex = -1;
  resetActiveAta(e) {
    e.target.select();
    this.activeAtaIndex = -1;
    this.prognosisTabEnterService.setActiveDuIndex(this.index);
    this.prognosisTabEnterService.setActiveAtaIndex(this.activeAtaIndex);
  }

  phantomEnterBehavious(event) {
    const key = event.key;
    if (key === "Enter") {
      event.preventDefault();
      this.setActiveAtaIndex();
    }
  }

  setActiveAtaIndex(activeAtaIndex = this.activeAtaIndex) {
    this.activeAtaIndex = this.findActiveAta(activeAtaIndex);
    this.prognosisTabEnterService.setActiveAtaIndex(this.activeAtaIndex);
    if (this.activeAtaIndex !== -1)
      this.prognosisTabEnterService.setActiveDuIndex(this.index);
    else this.findNextDu.emit(this.index);
  }

  findActiveAta(activeAtaIndex) {
    return this.property.atas.findIndex((ata, index) => {
      if (index <= activeAtaIndex) return false;
      return ata.Status == 2 && ata.PaymentType == 1;
    });
  }

  activeIndexListener(ataIndex) {
    this.setActiveAtaIndex(ataIndex);
  }

  focusOnInputSub: Subscription | undefined;
  setFocusOnInput() {
    this.focusOnInputSub =
      this.prognosisTabEnterService.activeDuAtaIndex$.subscribe({
        next: (activeDuAtaIndex: { duIndex: number; ataIndex: number }) => {
          if (
            activeDuAtaIndex.ataIndex === -1 &&
            activeDuAtaIndex.duIndex == this.index
          ) {
            if (!this.inputElement) return;
            this.inputElement.nativeElement.focus();
            this.inputElement.nativeElement.select();
          }
        },
      });
  }

  onFocus(type = "inputValue") {
    if (type == "inputValue") {
      this.prognosisHaveBorder = true;
      if (this.inputValue === "0" || this.inputValue === "0.00") {
        this.inputValue = "";
      }
    }
  }

  ngOnDestroy(): void {
    this.onBlurTotalAtaSub?.unsubscribe();
    this.trigetUpdateTotalAtasSub?.unsubscribe();
    this.focusOnInputSub?.unsubscribe();
  }

  resetPredictedValue: number = -1;

  resetInputValue: number = -1;
  setTotalResult(data) {
    if (data.predicted_data) {
      this.resetPredictedValue = this.property.project_du_totals.total;
      this.project_total = this.property.project_du_totals.total;
    } else {
      this.resetInputValue = this.property.project_du_totals.prognosis;
      this.inputValue = `${this.property.project_du_totals.prognosis}`;
    }
  }
}
