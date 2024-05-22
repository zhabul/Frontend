import { Component, OnInit } from "@angular/core";
import { TimeRegistrationService } from "../../../core/services/time-registration.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { NewPublicHolidaysComponent } from "src/app/generals/components/public-holidays/modals/new-public-holidays/new-public-holidays.component";
import { EditPublicHolidaysComponent } from "src/app/generals/components/public-holidays/modals/edit-public-holidays/edit-public-holidays.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-public-holidays",
  templateUrl: "./public-holidays.component.html",
  styleUrls: ["./public-holidays.component.css"],
})
export class PublicHolidaysComponent implements OnInit {
  public language = "en";
  public week = "Week";
  public holidays: any[] = [];
  public spinner: boolean = false;

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {
    this.language = sessionStorage.getItem("lang");
    if (this.language == "en") {
      this.week = "Week";
    } else if (this.language == "hr") {
      this.week = "Tjedan";
    } else {
      this.week = "Vecka";
    }
  }

  ngOnInit() {
    this.getDefaultHolidays();
  }

  openModal() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = {};

    this.dialog
      .open(NewPublicHolidaysComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.holidays.push(response);
          this.toastr.success(
            this.translate.instant("You successfully added public holiday."),
            this.translate.instant("Success")
          );
        }
      });
  }

  openEditModal(holiday, i) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { holiday: holiday };

    this.dialog
      .open(EditPublicHolidaysComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.holidays[i] = response;
          this.toastr.success(
            this.translate.instant("You successfully updated public holiday."),
            this.translate.instant("Success")
          );
        }
      });
  }

  getDefaultHolidays() {
    this.timeRegistrationService.getDefaultHolidays().subscribe((res) => {
      if (res["status"]) {
        this.holidays = res["data"];
      }
    });
  }

  removeHoliday(id, i) {
    this.spinner = true;
    this.timeRegistrationService.removeDefaultHolidays(id).subscribe((res) => {
      this.spinner = false;
      if (res["status"]) {
        this.holidays.splice(i, 1);
        this.toastr.success(
          this.translate.instant("You successfully deleted public holiday."),
          this.translate.instant("Success")
        );
      }
    });
  }
}
