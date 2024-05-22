import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";
import { SetTimeComponent } from "src/app/timesheets/components/set-time/set-time.component";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

declare var $;

@Component({
  selector: "user-calendar-role",
  templateUrl: "./user-calendar-role.component.html",
  styleUrls: ["./user-calendar-role.component.css"],
})
export class UserCalendarRoleComponent implements OnInit {
  @Input() scheduleRoles: any[] = [];

  public language = "en";
  public createForm: FormGroup;
  public week = "Week";
  public StartDate: any;
  public EndDate: any;
  public orderTime: any;
  public roleId: any = "";
  public userRoles = [];
  public days: any;
  public dateSelected: boolean;
  public messageDelete: any;
  public id: any;
  public list: any;
  public DaysBeforeToday: any = "";
  public DaysAfterToday: any = "";
  public modalHour: any;
  public allowSet = true;
  public deletedTimes = [];

  constructor(
    private toastr: ToastrService,
    private timeRegistrationService: TimeRegistrationService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
  }

  ngOnInit() {
    this.scheduleRoles = this.route.snapshot.data["scheduleRoles"];
    console.log(this.scheduleRoles);

    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);

    $("#timeSelect")
      .timepicker({
        showMeridian: false,
        defaultTime: this.orderTime,
      })
      .on("changeTime.timepicker", (e) => {
        if (e.target.value.length > 0) {
          this.orderTime = e.target.value;
        }
      });
  }

  updateRoles() {
    this.timeRegistrationService
      .updateUserScheduleRole({
        deletedTimes: this.deletedTimes,
        sheduleRoles: this.scheduleRoles,
      })
      .subscribe((response) => {
        this.toastr.success(
          this.translate.instant("Updated user schedule role") + ".",
          this.translate.instant("Success")
        );
      });
  }

  openModal(index) {
    const data = this.orderTime;
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { data: data };
    this.dialog
      .open(SetTimeComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (this.scheduleRoles[index].times === null) {
          this.scheduleRoles[index].times = [];
        }
        this.scheduleRoles[index].times.push({
          time: diaolgConfig["data"]["Hours"],
        });
      });
  }

  removeTime(roleIndex, timeIndex) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async (response) => {
        if (response.result) {
          if (this.scheduleRoles[roleIndex].times[timeIndex].time_id) {
            this.deletedTimes.push(
              this.scheduleRoles[roleIndex].times[timeIndex].time_id
            );
          }
          this.scheduleRoles[roleIndex].times.splice(timeIndex, 1);
        }
      });
  }
}
