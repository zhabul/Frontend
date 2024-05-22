import {
  Component,
  /*ElementRef,*/
  EventEmitter,
  /*HostListener,*/
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { PROGNOSIS_LAYOUT_LEFT_TABS } from "./prognosis-layout-tabs";
import {
  FILTER_EATING,
  FILTER_PROJECT,
} from "./prognosis-layout-filter-options";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { PrognosisTableService } from "../prognosis-table/prognosis-table.service";
import * as moment from "moment";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AtaService } from "src/app/core/services/ata.service";
import * as printJS from "print-js";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
declare var $;

@Component({
  selector: "app-prognosis-layout",
  templateUrl: "./prognosis-layout.component.html",
  styleUrls: ["./prognosis-layout.component.css"],
})
export class PrognosisLayoutComponent implements OnInit, OnDestroy {
  @Input("_prognosis") set _prognosis(value) {
    if (value != this.prognosis) this.onSettingPrognosis(value);
  }
  @Input('leftTabs') leftTabs: string[] = PROGNOSIS_LAYOUT_LEFT_TABS;
  @Input('heightForWrapper') heightForWrapper: string = '85vh';

  @Output("newPrognosis") newPrognosis = new EventEmitter<string>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private prognosisTableService: PrognosisTableService,
    private projectsService: ProjectsService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private ataService: AtaService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.setPrognosisTotalsByTypeFun();
    this.getAttestClientWorkers();
    this.onUpdateAtaPrognosis();
  }

  rightTabs: string[] = [];
  filterEating = FILTER_EATING;
  filterProject = FILTER_PROJECT;
  disabeButtons: boolean = false;
  spinner: boolean = false;
  client_workers = [];

  prognosis;
  selectedPrognosis;
  selectedPrognosisCloneUnfiltered;
  selectedPrognosisCloneFiltered;
  projectId;

  selectedPrognosisSub: Subscription | undefined;
  setPrognosisTotalsByTypeSub: Subscription | undefined;

  onSettingPrognosis(value) {
    this.prognosis = value;
    this.generateRightTabs(this.prognosis);
    this.setSelectedPrognosis(this.prognosis);
  }

  getAttestClientWorkers() {
    this.client_workers =
      this.activatedRoute.snapshot.data["attest_client_workers"];
  }

  generateRightTabs(prognosis) {
    this.rightTabs = [];
    for (let prognos of prognosis) {
      let tab: string = "";
      if (prognos.locked) {
        tab = `
          <div style="
            display: flex;
            flex-direction: column;
            line-height: 0.9;
            height: 0.9rem;
          ">
          <span>P-${prognos.prog_number}</span>
          <span style="font-size: 8px;">${prognos.created_at}</span>
          </div>
      `;
      } else {
        tab = `
          <span>P-${prognosis.length}</span>
        `;
      }
      this.rightTabs.push(tab);
    }
  }

  setSelectedPrognosis(prognosis) {
    this.selectedPrognosisSub = this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (!params || !params.rightTabIndex || !params.leftTabIndex) return;
        this.resetFilters();
        this.selectedPrognosis = prognosis[parseInt(params.rightTabIndex)];
        this.selectedPrognosisCloneUnfiltered = structuredClone(
          this.selectedPrognosis
        );
        this.selectedPrognosisCloneFiltered = structuredClone(
          this.selectedPrognosisCloneUnfiltered
        );
        this.calculateRiktTotal(this.selectedPrognosis);
        this.calculateAtaTotal(this.selectedPrognosis);
        if (params.leftTabIndex == "0") {
          this.openUrlInNewTab();
        }
      },
    });
  }

  resetFilters() {
    this.filterEating.map(x => x.checked = true);
    this.filterProject.map(x => x.checked = true);
  }

  openUrlInNewTab() {
    const rightTabIndex = this.activatedRoute.snapshot.queryParams.rightTabIndex;
    this.projectId = this.activatedRoute.snapshot.params['id'];
    if (!rightTabIndex || !this.projectId) return;

    window.open(`/#/projects/viewFullPrognosis/${this.projectId}?leftTabIndex=1&rightTabIndex=${rightTabIndex}`, "_blank");
    const queryParams: Params = { leftTabIndex: 1 };
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: "merge",
    });
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

  calculateRiktTotal(prognosis) {
    for (let property of prognosis.properties) {
      property.riktTotal = this.printTotal(property, "rikt");
    }
  }

  calculateAtaTotal(prognosis) {
    for (let property of prognosis.properties) {
      property.ataTotal = this.printTotal(property, "ata");
    }
  }

  initPrognosis(type = "complete_prognosis", value, project_index, predicted_total = false) {

    if (!value || value == "") {
      this.selectedPrognosis.properties[project_index][
        "project_du_totals"
      ].prognosis = "0,00";
    }

    let total = 0;
    let class_name = ".tot-prog-" + project_index;

    if (type == "complete_prognosis") {
      let class_name = ".tot-prog-" + project_index;
      $(class_name).val(Number(value));
      this.selectedPrognosis.properties[project_index][
        "project_du_totals"
      ].prognosis = Number(value);
      this.selectedPrognosis.properties[project_index][
        "project_du_totals_by_type"
      ]["project_du_totals_additional_work"].prognosis = 0;
      this.selectedPrognosis.properties[project_index][
        "project_du_totals_by_type"
      ]["project_du_totals_materials"].prognosis = 0;
      this.selectedPrognosis.properties[project_index][
        "project_du_totals_by_type"
      ]["project_du_totals_other_work"].prognosis = 0;
    } else {
      if (type == "adw_prognosis") {
        this.selectedPrognosis.properties[project_index][
          "project_du_totals_by_type"
        ]["project_du_totals_additional_work"].prognosis = Number(value);
      } else if (type == "material_prognosis") {
        this.selectedPrognosis.properties[project_index][
          "project_du_totals_by_type"
        ]["project_du_totals_materials"].prognosis = Number(value);
      } else {
        this.selectedPrognosis.properties[project_index][
          "project_du_totals_by_type"
        ]["project_du_totals_other_work"].prognosis = Number(value);
      }

      total =
        Number(
          this.selectedPrognosis.properties[project_index][
            "project_du_totals_by_type"
          ]["project_du_totals_additional_work"].prognosis
        ) +
        Number(
          this.selectedPrognosis.properties[project_index][
            "project_du_totals_by_type"
          ]["project_du_totals_materials"].prognosis
        ) +
        Number(
          this.selectedPrognosis.properties[project_index][
            "project_du_totals_by_type"
          ]["project_du_totals_other_work"].prognosis
        );
      this.selectedPrognosis.properties[project_index][
        "project_du_totals"
      ].prognosis = Number(total);
      $(class_name).val(Number(total));
    }
  }

  initPredictedData(type, value, project_index, predicted_total) {

    if ( type == 'adw_prognosis' ) {
        this.selectedPrognosis.properties[project_index]['project_du_totals']['additional_work'] = Number(value);
    }else if ( type == 'material_prognosis' ) {
        this.selectedPrognosis.properties[project_index]['project_du_totals']['material'] = Number(value);
    }else {
        this.selectedPrognosis.properties[project_index]['project_du_totals']['other'] = Number(value);
    }
    let total =
        Number(this.selectedPrognosis.properties[project_index]['project_du_totals']['additional_work']) +
        Number(this.selectedPrognosis.properties[project_index]['project_du_totals']['material']) +
        Number(this.selectedPrognosis.properties[project_index]['project_du_totals']['other']);
    this.selectedPrognosis.properties[project_index]['project_du_totals']['total'] = Number(total);
  }

  setProjectPrognos(type = "complete_prognosis", value, project_index, predicted_total = false) {

    if(predicted_total) {
      this.initPredictedData(type, value, project_index, predicted_total);
    }else {
      this.initPrognosis(type, value, project_index, predicted_total);
    }

    this.selectedPrognosis.saved = false;
  }

  setPrognosisTotalsByTypeFun() {
    this.setPrognosisTotalsByTypeSub =
      this.prognosisTableService.setPrognosisTotalsByType.subscribe({
        next: (result) => {
          if (!result) return;
          this.setProjectPrognos(result.type, result.value, result.index, result.predicted_data);
        },
      });
  }

  trigetUpdateTotalAtasSub: Subscription | undefined;


  onUpdateAtaPrognosis() {
    this.prognosisTableService.updateAtaPrognos.subscribe({
      next: result => {
        this.updateAtaPrognosis(result.data, result.value, result.projectIndex, result.ataIndex, result.eventClick);
      }
    });
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

    /* this.prognosis.properties[project_index].atas[
      ata_index
    ].prognosis = ataPrognosisiVal.replace(/\s/g, "").replace(",", "."); */
    this.prognosis.saved = false;

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

    /* if (event_click == "on_enter") {
        let atas = this.prognosis.properties[project_index].atas;
        let atas_length = atas.length - 1;
        let properties = this.prognosis.properties;

        if (ata_index == atas_length) {
            ata_index = -1;

            if (properties.length - 1 > project_index) {
                project_index++;
                ata_index = -1;
                atas = this.prognosis.properties[project_index].atas;
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
    } */

  }

  ata_prognosis_odbjects_for_update = [];
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
    const project_id = this.activatedRoute.snapshot.params.id;
    this.disabeButtons = true;
    this.spinner = true;
    let date = new Date();
    this.selectedPrognosis["created_at"] = moment(date).format("YY-MM-DD");
    this.selectedPrognosis["from_ata_prognosis"] = true;
    let mesg = "new prognosis emitted";

    if (type == "Saved") {
      mesg = "update prognosis emitted";
      this.selectedPrognosis["saved"] = true;
      this.selectedPrognosis["locked"] = false;
    } else {
      this.selectedPrognosis["saved"] = true;
      this.selectedPrognosis["locked"] = true;
    }

    if (!this.selectedPrognosis.id) {
      this.selectedPrognosis["prog_number"] = this.prognosis.length;
      this.projectsService
        .createDataAsJson(
          "project_ata_prognosis",
          project_id,
          this.selectedPrognosis
        )
        .then((res) => {
          this.newPrognosis.emit(mesg);
          this.ata_prognosis_odbjects_for_update = [];
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
          project_id,
          this.selectedPrognosis
        )
        .then((res) => {
          this.disabeButtons = false;
          this.spinner = false;
          this.ata_prognosis_odbjects_for_update = [];
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

  onSavePrognosis(e) {
    this.savePrognosis("Saved");
    this.prognosisTableService.saveButtonStatus.next(true);
  }

  onLockPrognosis(e) {
    this.savePrognosis("locked");
  }

  onAllProjectFilter(isAllSelected) {
    if (isAllSelected) {
      for (let filterProjectObj of this.filterProject) {
        filterProjectObj.checked = true;
      }
    } else {
      for (let filterProjectObj of this.filterProject) {
        filterProjectObj.checked = false;
      }
    }

    this.checkForAtaFilter();
  }

  onItemProjectFilter(item) {
    for (let filterProjectObj of this.filterProject) {
      if (filterProjectObj.id == item.id)
        filterProjectObj.checked = item.checked;
    }
    this.checkForAtaFilter();
  }

  onAllAtaFilter(isAllSelected) {
    if (isAllSelected) {
      for (let filterAtaObj of this.filterEating) {
        filterAtaObj.checked = true;
      }
    } else {
      for (let filterAtaObj of this.filterEating) {
        filterAtaObj.checked = false;
      }
    }

    this.checkForAtaFilter();
  }

  onItemAtaFilter(item) {
    for (let filterAtaObj of this.filterEating) {
      if (filterAtaObj.id == item.id) filterAtaObj.checked = item.checked;
    }

    this.checkForAtaFilter();
  }

  checkForProjectFilter() {
    this.selectedPrognosisCloneFiltered = structuredClone(
      this.selectedPrognosisCloneUnfiltered
    );
    let filteredProjects = [];
    for (let property of this.selectedPrognosisCloneFiltered.properties) {
      for (let filterProjectObj of this.filterProject) {
        if (
          property.project_status == filterProjectObj.id &&
          filterProjectObj.checked
        ) {
          filteredProjects.push(property);
        }
      }
    }
    this.selectedPrognosisCloneFiltered.properties = filteredProjects;
  }

  checkForAtaFilter() {
    this.checkForProjectFilter();
    for (let property of this.selectedPrognosisCloneFiltered.properties) {
      property.atas = property.atas.filter((ata) => {
        let status = this.filterEating.find((sts) => sts.id == ata.Status);
        if (status.checked) return ata;
      });
    }
    this.selectedPrognosis = structuredClone(
      this.selectedPrognosisCloneFiltered
    );

    this.calculateAtaTotal(this.selectedPrognosis);
  }

  onSearch(searchQuerty) {
    if (searchQuerty === "") {
      this.selectedPrognosis = structuredClone(
        this.selectedPrognosisCloneFiltered
      );
    }
    let newProperties = [];
    for (let property of this.selectedPrognosis.properties) {
      if (
        property.project_name.toLowerCase().includes(searchQuerty.toLowerCase())
      ) {
        newProperties.push(property);
        continue;
      }
      for (let ata of property.atas) {
        if (
          ata.Name.toLowerCase().includes(searchQuerty.toLowerCase()) ||
          (ata.labeling_requirements &&
            ata.labeling_requirements
              .toLowerCase()
              .includes(searchQuerty.toLowerCase()))
        ) {
          newProperties.push(property);
        }
      }
    }
    this.selectedPrognosis.properties = newProperties;
  }

  printSamastalingForPrognosisToClient() {
    this.spinner = true;
    const object = {
      emails: "radnik3radnik@outlkook.com",
      prognosis: this.selectedPrognosis,
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

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "";
    dialogConfig.data = {
      questionText:
        this.translate.instant("Are you sure you want to send email to:") +
        " " +
        emails +
        " ?",
    };
    dialogConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          let object = {
            emails: additionalEmailList,
            prognosis: this.selectedPrognosis
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


  focusElementIndex: number = 0;
  key;
/*
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
    if (this.key === 'Enter') {
      this.prognosisTableService.inputElementsId.sort();
      const selectedId = this.prognosisTableService.inputElementsId[this.focusElementIndex];
      const inputElement: ElementRef = this.prognosisTableService.inputElements.find(x => x.nativeElement.id === selectedId);
      inputElement.nativeElement.focus()
      this.focusElementIndex++;
      console.log(this.prognosisTableService.inputElementsId);

    }

  }*/




  ngOnDestroy(): void {
    this.selectedPrognosisSub?.unsubscribe();
    this.setPrognosisTotalsByTypeSub?.unsubscribe();
    this.trigetUpdateTotalAtasSub?.unsubscribe();
  }
}
