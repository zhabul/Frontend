import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AtaService } from "src/app/core/services/ata.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import * as moment from "moment";
import * as printJS from "print-js";
import { Observable, Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { UsersService } from "src/app/core/services/users.service";
declare var $;

@Component({
  selector: "app-ata-prognosis",
  templateUrl: "./ata-prognosis.component.html",
  styleUrls: ["./ata-prognosis.component.css"],
})
export class AtaPrognosisComponent implements OnInit, OnDestroy {
  @ViewChild("floatingHeader") floatingHeader: ElementRef;


  @Input() project_id;
  @Input("prognosis") set setPrognosis(value) {
    if (this.prognosis !== value) {
      this.prognosis = value;
      this.filterAtasOfPrognosis();
      setTimeout(() => {
        const el = document.getElementById("scroll-container");
        el.scrollTo(window.scrollX, window.scrollY - 1);
        el.scrollTo(window.scrollX, window.scrollY + 1);
      }, 0);


    }
  }
  @Input() contacts;
  @Input("activePrognosis") set setActivePrognosis(value) {

    if (value !== this.activePrognosis) {
      this.activePrognosis = value;
      this.filterAtasOfPrognosis();
    }
  }
  @Input() spinner;
  @Output() newPrognosis = new EventEmitter<string>();
  @Input() onScrollEvent: Observable<any>;
  public userDetails: any;
  private onScrollEventSubscription: Subscription;
  public activePrognosis = 0;
  public saved_prognosis: any[] = [];
  public createForm: FormGroup;
  public totalInternalAtasRichCosts;
  public internalAtas = [];
  public totalInternalAtasAccruedCosts;
  public totalInternalAtasInvoicedCosts;
  public totalInternalAtasApprovedToInvoiceCosts;
  public totalInternalAtasNotApprovedToInvoiceCosts;
  public totalInternalAtasWorkedNotApprovedCosts;
  public totalRiktInternalAtasInvoicedCosts;
  public searchQuery = "";
  public setedIndex = "";
  public client_workers = [];
  public originalPrognosis: any;
  public disabeButtons: boolean = false;
  public previous_value: number = 0;
  public ata_prognosis_odbjects_for_update: any = [];
  public border_index: number = -1;
  public project_border_index: number = -1;
  isShown: boolean = false;
  buttonToggle = false;
  public buttonName = "";
  iconDropdown: boolean = true;
  iconDropdownTable: boolean = true;
  public objData: any = {};
  public menuHeight = {
    result_overview: "auto",
  };

  public objectStatusEnterLeave: any = {
    "hover": "#82a7e2",
    "nothover": "#d5e5fe"
  };
  public searchText: any = "";
  public colorTable: string;
  public lengthPrognos: number;
  public prognosis = [];
  public statusObjectPrognosis: any = {
    all: false,
    "2": false,
    "4": false,
    "0": false,
    "7": false,
    "5": false,
    "3": false,
    "6": false,
  };
  public allowToBeSee:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private ataService: AtaService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
    private projectsService: ProjectsService,
    private dialog: MatDialog,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.filterAtasOfPrognosis();
    this.getUserPermissionTabs();
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.client_workers = this.route.snapshot.data["attest_client_workers"];
    this.originalPrognosis = JSON.parse(JSON.stringify(this.prognosis));

    this.updateStickyTotalPosition();

    this.lengtgPrognosisStyle();
    // Use Enter key as Tab //
    document.addEventListener("keydown", function (event) {
        if (event.keyCode === 13 && event.target["form"]) {
            const form = event.target["form"];
            const index = Array.prototype.indexOf.call(form, event.target);
            const nextEl = form.elements[index + 1];
            if (nextEl) {
                if (nextEl.type == "fieldset") {
                    form.elements[index + 3].focus();
                } else if (nextEl.type == "hidden") {
                    form.elements[index + 2].focus();
                } else {
                    nextEl.focus();
                }
            }
          event.preventDefault();
        }
    });
  }

  updateStickyTotalPosition() {
    this.onScrollEventSubscription = this.onScrollEvent.subscribe((e) => {
      const mainContainer = e.target
        .querySelector(".border-wrapper")
        .getBoundingClientRect();

      const elements = e.target.querySelectorAll("#table-t");

      const targetRect = e.target.getBoundingClientRect();

      // floating header

      for (let i = 0; i < elements.length; i++) {
        const eleRect = elements[i].getBoundingClientRect();

        const top = eleRect.top - targetRect.top;
        const bottom = targetRect.top - eleRect.bottom + 40;

        if (
          (top > 0 && this.floatingHeader.nativeElement.style.display == "") ||
          (top < 0 && bottom > 0) ||
          (this.prognosis[this.activePrognosis].properties[i] && this.prognosis[this.activePrognosis].properties[i].height != "auto")
        ) {
          this.floatingHeader.nativeElement.style.setProperty(
            "display",
            "none",
            "important"
          );
          continue;
        }

        if (top < 0) {
          if (this.floatingHeader.nativeElement.style.display != "") {
            if (
              this.floatingHeader.nativeElement.getAttribute("data-index") != i
            ) {
              const oldThead =
                this.floatingHeader.nativeElement.querySelector("thead");

              if (oldThead) {
                this.floatingHeader.nativeElement.removeChild(oldThead);
              }

              const thead = elements[i].querySelector("thead");
              const theadClone = thead.cloneNode(true);
              this.floatingHeader.nativeElement.appendChild(theadClone);
            }

            this.floatingHeader.nativeElement.setAttribute("data-index", i);
            this.floatingHeader.nativeElement.style.removeProperty(
              "display",
              "",
              ""
            );
          }

          const offset = (mainContainer.top - eleRect.top) * -1;

          this.floatingHeader.nativeElement.style.setProperty(
            "top",
            offset + top * -1 + "px"
          );
          break;
        }
      }

        for (let i = 0; i < elements.length; i++) {
          const eleRect = elements[i].getBoundingClientRect();
          const bottom_offset = targetRect.bottom - eleRect.bottom;
          const lastRow = elements[i].querySelector(".sticky-total");

          let offset;

          if (bottom_offset < 0) {
            if(elements.length > 2){
              offset = i == 0 ? 16 : 32; //Problem sa pozicijom sticky sume. Prije je bilo 16:32px. Istražiti u slučaju buga
            }else{
              offset = i == 0 ? 16 : 12; //Problem sa pozicijom sticky sume. Prije je bilo 16:32px. Istražiti u slučaju buga
            }

              lastRow?.style.setProperty(
                  "bottom",
                  bottom_offset * -1 + offset + "px"
              );
          }else {
            lastRow?.style.setProperty("bottom", "0");
          }
        }
    });
  }

  lengtgPrognosisStyle(){
    this.lengthPrognos = this.prognosis[this.activePrognosis].properties.length
  }

  printValue(ata) {
    let prognos = "";
    if (ata.PaymentType != 5) {
      prognos = ata.prognosis;
    }
    return prognos;
  }

  ngOnDestroy(): void {
    if (this.onScrollEventSubscription) {
      this.onScrollEventSubscription.unsubscribe();
    }
  }

  updateAtaPrognosis(
    data,
    ataPrognosisiVal,
    project_index,
    ata_index,
    event_click
    ) {

    if (!ataPrognosisiVal || ataPrognosisiVal == "") {
      ataPrognosisiVal = "0,00";
    }

    this.prognosis[this.activePrognosis].properties[project_index].atas[
      ata_index
    ].prognosis = ataPrognosisiVal.replace(/\s/g, "").replace(",", ".");
    this.prognosis[this.activePrognosis].saved = false;

    let object = {
      ata_id: data.LastAtaId,
      prognosis: ataPrognosisiVal.replace(/\s/g, "").replace(",", "."),
    };
    let pom = [];
    pom = this.ata_prognosis_odbjects_for_update.filter(
      (obj) => obj.ata_id == object.ata_id
    );

    if (pom.length == 0) {
      this.ata_prognosis_odbjects_for_update.push(object);
    }else {
        const ata_prognosis_odbjects_for_update_index = this.ata_prognosis_odbjects_for_update.findIndex((obj) => obj.ata_id === data.LastAtaId);

        if(ata_prognosis_odbjects_for_update_index >  -1) {
            this.ata_prognosis_odbjects_for_update[ata_prognosis_odbjects_for_update_index] = object;
        }
    }

    if (event_click == "on_enter") {
        let atas = this.prognosis[this.activePrognosis].properties[project_index].atas;
        let atas_length = atas.length - 1;
        let properties = this.prognosis[this.activePrognosis].properties;

        if (ata_index == atas_length) {
            ata_index = -1;

            if (properties.length - 1 > project_index) {
                project_index++;
                ata_index = -1;
                atas = this.prognosis[this.activePrognosis].properties[project_index].atas;
                atas_length = atas.length - 1;
            }
        }

        do {
            ata_index++;
            if (ata_index > atas_length) {
              ata_index = 0;

              if (properties.length - 1 > project_index) {
                project_index++;
                ata_index = 0;
              } else {
                return true;
              }
            }
        } while (atas[ata_index].Status != 2 || atas[ata_index].PaymentType != 1);

        let className = "sibling-" + project_index + "-" + Number(ata_index);
        const input: any = document.getElementById(className);

        input.focus();
        input.select();
    }

    this.sumContractWork(project_index, 'ata');
  }

    setProjectPrognos(type = 'complete_prognosis', value, project_index) {

        if (!value || value == "") {
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals'].prognosis = "0,00";
        }

        let total = 0
         let class_name = '.tot-prog-' + project_index;;

        if( type == 'complete_prognosis' ) {

            let class_name = '.tot-prog-' + project_index;
            $(class_name).val(Number(value));
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals'].prognosis = Number(value);
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals_by_type']['project_du_totals_additional_work'].prognosis = 0;
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals_by_type']['project_du_totals_materials'].prognosis = 0;
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals_by_type']['project_du_totals_other_work'].prognosis = 0;
        }else {
            if ( type == 'adw_prognosis' ) {
                this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals_by_type']['project_du_totals_additional_work'].prognosis = Number(value);
            }else if ( type == 'material_prognosis' ) {
                this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals_by_type']['project_du_totals_materials'].prognosis = Number(value);
            }else {
                this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals_by_type']['project_du_totals_other_work'].prognosis = Number(value);
            }

            total = Number(this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals_by_type']['project_du_totals_additional_work'].prognosis) +
            Number(this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals_by_type']['project_du_totals_materials'].prognosis) +
            Number(this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals_by_type']['project_du_totals_other_work'].prognosis);
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals'].prognosis = Number(total);
            $(class_name).val(Number(total));
        }
        this.prognosis[this.activePrognosis].saved = false;
    }

    selectProjectPrognosVal(type = 'complete_prognosis', index) {

        let class_name = '';
        if(type == 'complete_prognosis') {
             class_name = '.tot-prog-' + index;
             $(class_name).val( this.prognosis[this.activePrognosis].properties[index]['project_du_totals'].prognosis );



        }else if(type == 'additionalWork') {
             class_name = '.adw-prog-' + index;
             $(class_name).val( this.prognosis[this.activePrognosis].properties[index]['project_du_totals_by_type']['project_du_totals_additional_work'].prognosis );

        }else if(type == 'material') {
             class_name = '.m-prog-' + index;
             $(class_name).val( this.prognosis[this.activePrognosis].properties[index]['project_du_totals_by_type']['project_du_totals_materials'].prognosis );

        }else {
            class_name = '.o-prog-' + index;
            $(class_name).val( this.prognosis[this.activePrognosis].properties[index]['project_du_totals_by_type']['project_du_totals_other_work'].prognosis );
        }

        $(class_name).select();
    }

    calculateBluredTypes(type) {

      const duTypeArray = [ 'additionalWork', 'material', 'other', 'totals' ];
      const duTypeObj = {
        additionalWork:'project_du_totals_additional_work',
        material: 'project_du_totals_materials',
        other:  'project_du_totals_other_work',
        totals: 'project_du_totals'
      };

      return duTypeArray.map((duType)=>{
        const key = duTypeObj[duType];
        let active = false;
        if (duType === type) {
          active = true;
        }
        return { key: key, active: active }
      });

    }

    onBlur(prognos, type){



      const bluredTypes = this.calculateBluredTypes(type);
      bluredTypes.forEach((type)=>{
        if (prognos['project_du_totals_by_type'][type.key]) {
         delete prognos['project_du_totals_by_type'][type.key].opacity ;
        } else {
          delete prognos[type.key].opacity ;
        }
      });
    }

    setBlured(prognos, type){
      const bluredTypes = this.calculateBluredTypes(type);
      bluredTypes.forEach((type)=>{
        if (prognos['project_du_totals_by_type'][type.key]) {
          prognos['project_du_totals_by_type'][type.key].opacity = type.active;
        } else {
          prognos[type.key].opacity = type.active;
        }
      });

    }

    sumContractWork(project_index, type = 'project') {

        if(type == 'ata') {
            let ata_total = 0;
            this.prognosis[this.activePrognosis].properties[project_index].atas.forEach((ata, i) => {
                if(ata['PaymentType'] != 5) {
                    ata_total += Number(ata['prognosis']);
                }
            });
            this.prognosis[this.activePrognosis].properties[project_index]['ata_totals'].ata_total_prognosis = ata_total;
        }

        this.prognosis[this.activePrognosis].properties[project_index].project_contract_amount_total = Number(this.prognosis[this.activePrognosis].properties[project_index]['ata_totals'].ata_total_prognosis) + Number(this.prognosis[this.activePrognosis].properties[project_index]['ata_totals'].richCostTotal_prognosis) + Number(this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals'].prognosis);
        let sum = 0;
        this.prognosis[this.activePrognosis].properties.forEach((property, i) => {
            sum += Number(property['project_contract_amount_total']);
        });
        this.prognosis[this.activePrognosis]['total'] = sum;
        return true;
    }

  onFocusEvent(data, ataPrognosisiVal, project_index, ata_index) {

    if (!ataPrognosisiVal || ataPrognosisiVal == "") {
      ataPrognosisiVal = "0,00";

      this.prognosis[this.activePrognosis].properties[project_index].atas[
        ata_index
      ].prognosis = ataPrognosisiVal;
    }
    this.previous_value = ataPrognosisiVal;
  }

  renderName(ata) {
    let name = "";

    if (ata.DeviationNumber) name = "U-" + ata.DeviationNumber;
    else if (ata.AtaInternalNumber) name = "";
    return name;
  }

    setBlurClass(opacity) {
      if (opacity === true) {
        return ' blured1';
      } else if (opacity === false) {
        return ' blured';
      } else {
        return '';
      }
    }

    setProjectClass(index, input_type, opacity) {
        let className = "orange-border prognos-color";
        let input_has_class = $(".input-prognos").hasClass(input_type);
        if (
            this.prognosis[this.activePrognosis].locked ||
            this.prognosis[this.activePrognosis]['properties'][index].project_debit == 2 ||
            this.prognosis[this.activePrognosis]['properties'][index].project_status != 2
        ) {
            className = "disabled-input";
        }

        if (this.project_border_index == index && this.border_index == -1 && input_has_class) {
            className = className + " orange-border " + "td-input-prognos";
        }

        return className + this.setBlurClass(opacity);
    }


    setProjectAdditionalWorkClass(index) {
        let className = "orange-border prognos-color";
        if (
            this.prognosis[this.activePrognosis].locked ||
            this.prognosis[this.activePrognosis]['properties'][index].project_debit == 2 ||
            this.prognosis[this.activePrognosis]['properties'][index].project_status != 2
        ) {
            className = "disabled-input";
        }

        if (this.project_border_index == index && this.border_index == -1) {
            className = className + " orange-border " + "td-input-prognos";
        }

        return className;
    }

  setClass(ata, project_index, index) {

    let className = "prognos-color";
    if (
      this.prognosis[this.activePrognosis].locked ||
      ata.Status != 2 ||
      ata.PaymentType == 2 ||
      ata.PaymentType == 5
    ) {
      className = "disabled-input";
    }

    if (this.border_index == index && this.project_border_index == project_index) {
      className = className + " orange-border " + "td-input-prognos";
    }

    return className;
  }

  savePrognosis(type) {
    if (this.ata_prognosis_odbjects_for_update.length > 0) {
      this.ataService
        .updateAtaPrognosis(this.ata_prognosis_odbjects_for_update)
        .subscribe((res) => {
          this.refresSavePrognosis(type);
        });
    } else {
      this.refresSavePrognosis(type);
    }
  }

  refresSavePrognosis(type) {
    this.disabeButtons = true;
    this.spinner = true;
    let date = new Date();
    this.prognosis[this.activePrognosis]["created_at"] =
      moment(date).format("YY-MM-DD");
    this.prognosis[this.activePrognosis]["from_ata_prognosis"] = true;
    let mesg = "new prognosis emitted";

    if (type == "Saved") {
      mesg = "update prognosis emitted";
      this.prognosis[this.activePrognosis]["saved"] = true;
      this.prognosis[this.activePrognosis]["locked"] = false;
    } else {
      this.prognosis[this.activePrognosis]["saved"] = true;
      this.prognosis[this.activePrognosis]["locked"] = true;
    }

    if (!this.prognosis[this.activePrognosis].id) {
      this.prognosis[this.activePrognosis]["prog_number"] =
        this.prognosis.length;
      this.projectsService
        .createDataAsJson(
          "project_ata_prognosis",
          this.project_id,
          this.prognosis[this.activePrognosis]
        )
        .then((res) => {
          this.newPrognosis.emit(mesg);
          this.disabeButtons = false;
          this.toastr.success(
            this.translate.instant(
              "TSC_You_have_successfully_created_prognosis"
            ),
            this.translate.instant("Success")
          );
        });
    } else {
      this.projectsService
        .updateDataAsJson(
          "project_ata_prognosis",
          this.project_id,
          this.prognosis[this.activePrognosis]
        )
        .then((res) => {
          this.disabeButtons = false;
          this.newPrognosis.emit(mesg);
          this.toastr.success(
            this.translate.instant(
              "TSC_You_have_successfully_updated_prognosis"
            ),
            this.translate.instant("Success")
          );
        });
    }
  }

  onStatusChangePrognosis(value) {
    const type = "Prognosis";
    var status = !this.statusObjectPrognosis[value];

    if (value == "all") {
      this.checkAllInternal(status);
    } else {
      if (!status) {
        this.statusObjectPrognosis["all"] = false;
      }
      this.statusObjectPrognosis[value] = status;
      this.createUserPermissionTabs(value, type, status);
      this.handleAllStatus("Prognosis");
    }

    this.filterAtasOfPrognosis();
    this.triggerScroll();
  }


  triggerScroll(scroll = true) {
    const el = document.getElementById('scroll-container');
    const v_scroll = scroll ? el.scrollTop : 0;
    el.scrollBy({top: v_scroll+1 });
    setTimeout(() => {el.scrollBy({top: v_scroll-1 });}, 0);
  }

  handleAllStatus(type) {
    const statusObject = this[`statusObject${type}`];
    const keys = Object.keys(statusObject);
    let flag = true;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!statusObject[key]) {
        flag = false;
        break;
      }
    }
    statusObject["all"] = flag;
  }

  getUserPermissionTabs() {
    this.usersService.getUserPermissionTabs().subscribe((res) => {
      const prognosis = res["data"]["Prognosis"];

      if (prognosis) {
        const keys_prognosis = Object.keys(prognosis);
        keys_prognosis.forEach((status) => {
          this.statusObjectPrognosis[status] = true;
          this.filterAtasOfPrognosis();
        });

        if (keys_prognosis.length === 7) {
          this.statusObjectPrognosis["all"] = true;
          this.filterAtasOfPrognosis();
        }
      }
    });
  }

  filterAtasOfPrognosis() {
    const properties = this.prognosis[this.activePrognosis].properties;

    properties.forEach((property_) => {
      property_.fil_atas = property_.atas.filter((ata) => {
        return ["AtaNumber", "Name", "PaymentTypeName"].some((property) => {
          return (
            (property == "PaymentTypeName"
              ? this.translate.instant(ata[property])
              : ata[property]
            )
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) &&
            this.statusObjectPrognosis[ata["Status"]]
          );
        });
      });
      property_.ata_totals = this.getTotals(property_);
    });

    setTimeout(() => {this.triggerScroll(false)}, 0);
  }

  checkAllInternal(status) {
    const keys = Object.keys(this.statusObjectPrognosis);

    keys.forEach((key) => {
      this.statusObjectPrognosis[key] = status;
      if (key !== "all") {
        this.createUserPermissionTabs(key, "Prognosis", status);
      }
    });

    this.sortAtasByNumber("internal");
  }

  createUserPermissionTabs(value, type, status) {
    this.objData = {
      user_id: this.userDetails.user_id,
      tab_name: value,
      type: type,
    };

    if (status) {
      this.usersService.createUserPermissionTabs(this.objData);
    } else {
      this.usersService.deleteUserPermissionTabs(this.objData);
    }
  }

  printTotal(prognos, type = "") {
    const atas = prognos.atas;

    if (type == "ata") {
      return atas.reduce((prev, ata) => {
        return (
          prev +
          Number(ata.prognosis && ata.PaymentType != 5 ? ata.prognosis : 0)
        );
      }, 0);
    } else if (type == "rikt") {
      return atas.reduce((prev, ata) => {
        return (
          prev +
          Number(ata.ata_total && ata.PaymentType == 5 ? ata.ata_total : 0)
        );
      }, 0);
    } else {
      return atas.reduce((prev, ata) => {
        return (
          prev +
          Number(ata.prognosis && ata.PaymentType != 5 ? ata.prognosis : 0)
        );
      }, 0);
    }
  }

  getTotals(property_) {
    const atas = property_.fil_atas;
    const ata_totals = property_.ata_totals;

    ata_totals.totallyWorkedUp_without_status = atas.reduce((prev, ata) => {
      return prev + Number(ata.Status == 3 ? 0 : ata.totallyWorkedUp);
    }, 0);

    ata_totals.workedButNotApproved_without_status = atas.reduce(
      (prev, ata) => {
        return prev + Number(ata.Status == 3 ? 0 : ata.workedButNotApproved);
      },
      0
    );

    //Calculate Internal Atas Invoiced Costs
    ata_totals.invoicedTotal_without_status = atas.reduce((prev, ata) => {
      return prev + Number(ata.invoicedTotal);
    }, 0);

    //Calculate Internal Atas Approved to Invoice Costs
    ata_totals.approvedForInvoice_without_status = atas.reduce((prev, ata) => {
      return prev + Number(ata.approvedForInvoice);
    }, 0);

    ata_totals.richCostTotal_without_status = atas.reduce((prev, ata) => {
      return prev + Number(ata.ata_total ? ata.ata_total : 0);
    }, 0);

    ata_totals.total_sent_wr_without_status = atas.reduce((prev, ata) => {
      return prev + Number(ata.total_sent_wr);
    }, 0);

    ata_totals.total_sent_wr = atas.reduce((prev, ata) => {
      return prev + Number(ata.Status == 3 ? 0 : ata.total_sent_wr);
    }, 0);

    ata_totals.total_prognosis_without_status = atas.reduce((prev, ata) => {
      return prev + Number(ata.Status == 3 ? 0 : Number(ata.prognosis));
    }, 0);

    return ata_totals;
  }

  sortAtasByNumber(type) {
    if (type === "internal" || type === "all") {
      this.internalAtas = this.internalAtas.sort((ata1, ata2) => {
        return Number(ata2.AtaNumber) - Number(ata1.AtaNumber);
      });
    }
  }
  get getFilteredInternalAtas() {
    return this.internalAtas.filter((ata) => {
      return ["AtaNumber", "Name", "PaymentTypeName"].some((property) => {
        return (
          (property == "PaymentTypeName"
            ? this.translate.instant(ata[property])
            : ata[property]
          )
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) &&
          this.statusObjectPrognosis[ata["Status"]]
        );
      });
    });
  }

  setMenuHeight(height, type) {
    this.iconDropdown = !this.iconDropdown;
    this.isShown = !this.isShown;

    const menu_height = this.menuHeight[type];

    if (menu_height === "auto") {
      this.menuHeight[type] = height;
      return;
    }

    this.menuHeight[type] = "auto";
  }

  changePropertyHeight(prognos, type) {

    if (prognos[`${type}height`] === "auto") {
      prognos[`${type}height`] = "12px";
      return;
    }

    prognos[`${type}height`] = "auto";
  }
  changePropertyMarginLeft(margin_left) {
    const style = {
      "margin-left": margin_left + "px",
    };

    return style;
  }

  getAtaStatusClass(status, index) {
    let rowClass = "";

    switch (status.toString()) {
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
        console.error("Your status (" + status + ") is NOT good, fix it.");
    }
    if (index === this.setedIndex) {
      rowClass = rowClass + " " + "active";
    }

    return rowClass;
  }
  printSamastalingForPrognosisToClient() {
    this.spinner = true;
    const object = {
      emails: "radnik3radnik@outlkook.com",
      prognosis: this.prognosis[this.activePrognosis],
    };

    this.ataService.printSamastalingForPrognosisToClient(object).subscribe({
      next: (response) => {
        this.spinner = false;
        if (response["status"]) {
          printJS(response["pdf_url"]);
        } else {
          this.toastr.error(
            this.translate.instant("Couldn`t print pdf!"),
            this.translate.instant("Error")
          );
        }
      },
      error: () => {
        this.toastr.error(
          this.translate.instant("Couldn`t print pdf, please try again."),
          this.translate.instant("Error")
        );
      },
    });
  }

  sendSamastalingForPrognosisToClient(contacts) {

    if (contacts.length < 1) {
      return this.toastr.info(
        this.translate.instant(
          "You first need to select an email where to send atas"
        ) + ".",
        this.translate.instant("Info")
      );
    }

    let emails = "";
    const additionalEmailList = [];
    contacts.forEach((contact, index) => {
      contact.email = this.client_workers.find((x) => x.Id == contact.Id).email;
      additionalEmailList.push(contact);
      if (emails.length > 0)
        emails = emails + ", " + (contact.email ? contact.email : contact.Name);
      else emails = emails + (contact.email ? contact.email : contact.Name);
    });

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
      questionText:
        this.translate.instant("Are you sure you want to send email to:") +
        " " +
        emails +
        " ?",
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          let object = {
            emails: additionalEmailList,
            prognosis: this.prognosis[this.activePrognosis],
            userName: this.userDetails.firstname + " " +this.userDetails.lastname
          };
          this.spinner = true;
          this.ataService
            .sendSamastalingForPrognosisToClient(object)
            .subscribe({
              next: (response) => {
                this.spinner = false;
                if (response["status"]) {
                  this.toastr.success(
                    this.translate.instant("You have successfully sent email!"),
                    this.translate.instant("Success")
                  );
                } else {
                  this.toastr.error(
                    this.translate.instant(
                      "Couldn`t send the email, please try again."
                    ),
                    this.translate.instant("Error")
                  );
                }
              },
              error: () => {
                this.toastr.error(
                  this.translate.instant(
                    "Couldn`t send the email, please try again."
                  ),
                  this.translate.instant("Error")
                );
              },
            });
        }
      });
  }

  buttonNameSummary(worker = null) {
    if (worker) {
      this.buttonToggle = true;
      if (
        this.contacts.some((selectedWorker) => selectedWorker.Id == worker.Id)
      ) {
        this.contacts.splice(this.contacts.indexOf(worker), 1);
      } else {
        this.contacts.push(worker);
      }
    } else {
      this.buttonToggle = !this.buttonToggle;
      if (this.buttonToggle == true) {
        this.buttonName = "Hide";
      } else {
        this.buttonName = "";
      }
    }
  }

    checkIfContactSelected(contact) {
        if (
          this.contacts.some((selectedWorker) => selectedWorker.Id == contact.Id)
        ) {
          return true;
        } else return false;
    }

    onSearch(value) {
        this.prognosis.forEach(function (prognose, prognose_index) {
          prognose.properties.forEach(function (property, property_index) {
            property.fil_atas = property.atas.filter((ata) =>
              ["AtaNumber", "PaymentTypeName", "Name"].some((prop) => {
                if (ata[prop]) {
                  return ata[prop].toLowerCase().includes(value.toLowerCase());
                } else {
                  return false;
                }
              })
            );
          });
        });
    }

    edit(ata) {
        this.router.navigate(["/projects/view/ata/modify-ata/", ata.id], {
          queryParams: { type: "external", projectId: ata.ProjectID, from: 'forecast'},
        });
    }

    myTabFocusChange(index, ata_index) {
        this.setBorder(index, ata_index);
    }

    setBorder(index, ata_index) {
        this.project_border_index = index;
        this.border_index = ata_index;
    }

    setProjectBorder(index, class_name = '') {
        this.project_border_index = index;
        this.border_index = -1;

        $(".input-prognos").removeClass('totals');
        $(".input-prognos").removeClass('additionalWork');
        $(".input-prognos").removeClass('material');
        $(".input-prognos").removeClass('other');
        $(".input-prognos").addClass(class_name);
    }

    allowSeen() {
        this.allowToBeSee = !this.allowToBeSee;
    }

    myTabProjectFocusChange(index, class_name = '') {
        this.setProjectBorder(index, class_name);
    }

    onMouseEnter(index){
        let class_name = '.project-wrapp' + index;
        $(class_name).addClass("hovered");
    }
    onMouseLeave(index){
        let class_name = '.project-wrapp' + index;
        $(class_name).removeClass("hovered")
    }


    setProjectTotal(type = 'complete_prognosis1', value, project_index) {

      let total = 0;
      if( type == 'complete_prognosis1' ) {

            let class_name = '.tot-prog1-' + project_index;
            $(class_name).val(Number(value));
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals']['total'] = Number(value);
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals']['additional_work'] = 0;
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals']['material'] = 0;
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals']['other'] = 0;

      }else {
        if ( type == 'adw_prognosis1' ) {
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals']['additional_work'] = Number(value);
        }else if ( type == 'material_prognosis1' ) {
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals']['material'] = Number(value);
        }else {
            this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals']['other'] = Number(value);
        }
        total =
            Number(this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals']['additional_work']) +
            Number(this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals']['material']) +
            Number(this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals']['other']);
       this.prognosis[this.activePrognosis].properties[project_index]['project_du_totals']['total'] = Number(total);
      }
      this.prognosis[this.activePrognosis].saved = false;
    }

    selectProjectPrognosVal1(type = 'complete_prognosis1', index) {

        let class_name = '';
        if(type == 'complete_prognosis1') {
             class_name = '.tot-prog1-' + index;
             $(class_name).val( this.prognosis[this.activePrognosis].properties[index]['project_du_totals']['total'] );

        }else if(type == 'additionalWork') {
             class_name = '.adw-prog1-' + index;
             $(class_name).val( this.prognosis[this.activePrognosis].properties[index]['project_du_totals']['additional_work'] );

        }else if(type == 'material') {
             class_name = '.material_prognosis1-' + index;
             $(class_name).val( this.prognosis[this.activePrognosis].properties[index]['project_du_totals']['material'] );

        }else {
            class_name = '.other_prognosis1-' + index;
            $(class_name).val( this.prognosis[this.activePrognosis].properties[index]['project_du_totals']['other'] );
        }

        $(class_name).select();
    }

    clearSearchText(event) {
        event.preventDefault();
        (document.getElementById('searchInput') as HTMLInputElement).value = '';
    }

    get existString() {
        if (((document.getElementById('searchInput') as HTMLInputElement).value).length > 0)
            return true;
        else
            return false;
    }
}
