import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AtaService } from "src/app/core/services/ata.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import * as moment from "moment";
import * as printJS from "print-js";
import { UsersService } from "src/app/core/services/users.service";

@Component({
  selector: "app-ata-prognosis-show-table",
  templateUrl: "./ata-prognosis-show-table.component.html",
  styleUrls: ["./ata-prognosis-show-table.component.css"],
})
export class AtaPrognosisShowTableComponent implements OnInit {
  @ViewChild("floatingHeader") floatingHeader: ElementRef;

  public property_index;
  public project_id;
  public prognosis: any = [];
  public datas: any = [];
  public userDetails: any;
  public spinner: boolean = false;
  public objData: any = {};
  public activePrognosis;
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
  isShown: boolean = false;
  buttonToggle = false;
  public buttonName = "";
  iconDropdown: boolean = true;
  iconDropdownTable: boolean = true;
  public menuHeight = {
    result_overview: "auto",
  };
  public menuHeight1 = {
    result_overview: "auto",
  };
  prognos: any;
  public getting_prognogis = false;
  public lengthPrognos: number;
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
  public indexP: any;

  constructor(
    private route: ActivatedRoute,
    private ataService: AtaService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private projectsService: ProjectsService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.client_workers = this.route.snapshot.data["attest_client_workers"];
    this.originalPrognosis = JSON.parse(JSON.stringify(this.prognosis));
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.project_id = this.route.params["value"]["id"];
    this.get_prognosis();
    this.route.queryParamMap.subscribe((params) => {
      this.indexP = params.get('activePrognosis')
      this.activePrognosis = Number(params.get('activePrognosis'));
      this.activePrognosis = params.get("activePrognosis")
        ? params.get("activePrognosis") 
        : 0;
      this.property_index = params.get("property_index")
        ? params.get("property_index")
        : 0;
    });
    this.client_workers = this.route.snapshot.data["attest_client_workers"];
    this.originalPrognosis = JSON.parse(JSON.stringify(this.prognosis));
   
  }

 
  onScroll(e) {
    const c = document.getElementsByClassName("hiden-line-nav")[0];

    if (e.target.scrollTop < 318) {
      c.classList.remove("change-line-nav");
    }
    if (e.target.scrollTop >= 318) {
      c.classList.add("change-line-nav");
    }

    const mainContainer = e.target
      .querySelector("#scroll-container")
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
        this.prognosis[this.activePrognosis].properties[i].height != "auto"
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

        const offset = (mainContainer.top - eleRect.top - 17) * -1;

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

      if (bottom_offset < 0) {
        const offset = i == 0 ? 14 : 16;

        lastRow.style.setProperty("bottom", bottom_offset * -1 + offset + "px");
      } else {
        lastRow.style.setProperty("bottom", "0");
      }
    }
  }
 
  printValue(ata) {
    let prognos = "";
    if (ata.PaymentType != 5) {
      prognos = ata.prognosis;
    }
    return prognos;
  }

  updateAtaPrognosis(
    data,
    ataPrognosisiVal,
    property_index,
    ata_index,
    event_click
  ) {
    if (!ataPrognosisiVal || ataPrognosisiVal == "") {
      ataPrognosisiVal = "0,00";
    }

    this.prognosis[this.activePrognosis].properties[this.property_index].atas[
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
    }

    if (event_click == "on_enter") {
      let atas =
        this.prognosis[this.activePrognosis].properties[this.property_index]
          .atas;
      let atas_length = atas.length - 1;
      let properties = this.prognosis[this.activePrognosis].properties;

      if (ata_index == atas_length) {
        ata_index = 0;
        if (properties.length - 1 > this.property_index) {
          this.property_index++;
          ata_index = -1;
          atas =
            this.prognosis[this.activePrognosis].properties[this.property_index]
              .atas;
          atas_length = atas.length - 1;
        }
      }

      do {
        ata_index++;
        if (ata_index > atas_length) {
          ata_index = 0;

          if (properties.length - 1 > this.property_index) {
            this.property_index++;
            ata_index = 0;
          } else {
            return true;
          }
        }
      } while (atas[ata_index].Status != 2 || atas[ata_index].PaymentType != 1);

      let className =
        "sibling-" + this.property_index + "-" + Number(ata_index);
      const input: any = document.getElementById(className);
      input.focus();
      input.select();
    }
  }

  onFocusEvent(data, ataPrognosisiVal, property_index, ata_index) {
    if (!ataPrognosisiVal || ataPrognosisiVal == "") {
      ataPrognosisiVal = "0,00";

      this.prognosis[this.activePrognosis].properties[this.property_index].atas[
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

  setClass(ata, index) {
    let className = "orange-border prognos-color";
    if (
      this.prognosis[this.activePrognosis].locked ||
      ata.Status != 2 ||
      ata.PaymentType == 2 ||
      ata.PaymentType == 5
    ) {
      className = "disabled-input";
    }

    if (this.border_index == index) {
      className = className + " " + "td-input-prognos";
    }

    return className;
  }

  savePrognosis(type) {
    if (this.getting_prognogis === true) {
      return false;
    }

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

    if (type == "Saved") {
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
          this.get_prognosis();
          this.disabeButtons = false;
          this.spinner = false;
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
          this.get_prognosis();
          this.disabeButtons = false;
          this.spinner = false;
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
    const status = !this.statusObjectPrognosis[value];
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

  filterAtasOfPrognosis() {
    const properties = this.prognosis[this.activePrognosis].properties;

    properties.forEach((property_) => {
      if (!property_.all_atas) {
        property_.all_atas = property_.atas;
      }

      property_.atas = property_.all_atas.filter((ata) => {
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

  printTotal(prognosis, type = "") {
    const atas = prognosis.atas;

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
          Number(ata.prognosis && ata.PaymentType == 5 ? ata.prognosis : 0)
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
    const atas = property_.atas;
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

  changePropertyHeight(prognosis) {
    if (prognosis.height === "auto") {
      prognosis.height = "12px";
      return;
    }

    prognosis.height = "auto";
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
    let object = {
      emails: "radnik3radnik@outlkook.com",
      prognosis: this.prognosis[this.activePrognosis],
    };

    this.ataService.printSamastalingForPrognosisToClient(object).subscribe({
      next: (response) => {
        if (response["status"]) {
          printJS(response["pdf_url"]);
        } else {
          this.toastr.error(
            this.translate.instant("Couldn`t print pdf!"),
            this.translate.instant("Error")
          );
        }
      },
      error: (_) => {
        this.toastr.error(
          this.translate.instant("Couldn`t print pdf, please try again."),
          this.translate.instant("Error")
        );
      },
    });
  }

  onSearch(value) {
    this.prognosis = JSON.parse(JSON.stringify(this.originalPrognosis));
    this.prognosis.forEach(function (prognose, prognose_index) {
      prognose.properties.forEach(function (property, property_index) {
        property.atas = property.atas.filter((ata) =>
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

  get_prognosis(event = null) {
    this.getting_prognogis = true;
    this.ataService.getPrognosis(this.project_id).subscribe({
      next: (res) => {
        if (res["status"]) {
          this.getting_prognogis = false; 
          this.prognosis = res["data"];
          this.changePropertyHeight(this.prognosis);

          if (event && event == "new prognosis emitted") {
            this.activePrognosis = this.activePrognosis - 2;
          } else {
            this.activePrognosis =  this.activePrognosis ;
          }
          this.spinner = false;

          if (this.activePrognosis < 0) {
            this.activePrognosis = 0;
          }
        }
      },
      complete: () => {
        this.getUserPermissionTabs();
      },
    });
  }

  setActivePrognosis(index) {
    this.activePrognosis = index;
  }

  changePropertyTopBtn(index) {
    let z_index = 1;
    let temp_z_index = 2 * index;
    z_index += temp_z_index;
    if (index == this.activePrognosis) {
      z_index = 500;
    }
    const style = {
      "z-index": z_index,
      "margin-left": -2 + "px",
      "box-shadow": "2px 0 13px 0px #44484c",
    };
    return style;
  }

  setBorder(index) {
    this.border_index = index;
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
}
