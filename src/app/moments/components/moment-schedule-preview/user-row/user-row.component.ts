import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { UserMomentsDetailComponent } from "src/app/moments/component/user-moments-detail/user-moments-detail.component";
import { LockedDaysComponent } from "src/app/moments/components/locked-days/locked-days.component";
import { SendNotificationToUserForTimesheetComponent } from "src/app/moments/components/send-notification-to-user-for-timesheet/send-notification-to-user-for-timesheet.component";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";

declare var $: any;

@Component({
  selector: "app-user-row",
  templateUrl: "./user-row.component.html",
  styleUrls: [
    "./user-row.component.css",
    "../moment-schedule-preview.component.css",
  ],
})
export class UserRowComponent implements OnInit {
  @Input("calendar") calendar;
  @Input("user") user;
  @ViewChild("userrow") userrow;
  @Input("scrollwindow") scrollwindow;

  public visible = true;
  public client_height = 0;

  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public loggedUser: any;

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loggedUser = JSON.parse(sessionStorage.getItem("userDetails"));
  }

  initIntersectionObserver() {
    const options = {
      root: this.scrollwindow,
      rootMargin: "0px",
      threshold: this.buildThresholdList(),
    };

    const observer = new IntersectionObserver(
      this.checkIfElementIsVisible.bind(this),
      options
    );

    observer.observe(this.userrow.nativeElement);
  }

  checkIfElementIsVisible(entries, observer) {
    entries.forEach((entry) => {
      this.visible = entry.isIntersecting;
    });
  }

  buildThresholdList() {
    let thresholds = [];
    let numSteps = 20;

    for (let i = 1.0; i <= numSteps; i++) {
      let ratio = i / numSteps;
      thresholds.push(ratio);
    }

    thresholds.push(0);
    return thresholds;
  }

  setAbsenceValue(user, day) {
    if (user.absences[day.date]) {
      if (user.absences[day.date].length == 1)
        return user.absences[day.date][0]["absenceHours"];
      const timeDecimal = user.absences[day.date]
        .filter((x) => x.isRejected != 1)
        .reduce((a, b) => a + this.timeStringToFloat(b["absenceHours"]), 0);

      return this.timeFloatToString(timeDecimal);
    }
    return "";
  }

  setTimeValue(user, day) {
    if (!user.moments[day.date]) {
      return "";
    }

    if (
      user.moments[day.date]["time"] != "00:00" &&
      user.moments[day.date]["Type"] == "Moments"
    ) {
      return user.moments[day.date]["time"];
    }

    if (user.moments[day.date]["Type"] == "Moments") {
      return "Need attest";
    }
  }

  setValue(user, day) {
    if (user.moments[day.date]) {
      return user.moments[day.date];
    }
    return "";
  }

  setStyle(user, day) {
    let style = {
      display: "flex",
      background: "transparent",
      opacity: 1,
    };

    if (
      user.moments &&
      user.moments[day.date] &&
      user.moments[day.date].AtestStatus == "1"
    ) {
      style = {
        display: "flex",
        background: "#98FB98",
        opacity: 1,
      };
      return style;
    }

    if (
      user.absences &&
      user.absences[day.date] &&
      user.absences[day.date].length > 0 &&
      user.absences[day.date][0].isAnswered &&
      user.absences[day.date][0].isRejected != 1
    ) {
      if (user.absences[day.date][0].Approved == 0) {
        const className = "." + day.date;
        $(className).find(".approve-absence-area").addClass("border-red");
        style = {
          display: "block",
          background: user.absences[day.date][0].Color,
          opacity: 0.5,
        };
        return style;
      }

      style = {
        display: "block",
        background: user.absences[day.date][0].Color,
        opacity: 1,
      };
      return style;
    }

    return style;
  }

  private timeStringToFloat(time) {
    const hoursMinutes = time.split(/[.:]/);
    const hours = parseInt(hoursMinutes[0], 10);
    const minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  }

  private timeFloatToString(num) {
    const hours = parseInt(num).toString().padStart(2, "0");
    const minutes = Math.round((num % 1) * 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  goToUserMomentDetail(user, date) {
    if (
      user.notApprovedAbsences[date] &&
      user.notApprovedAbsences[date].length > 0
    ) {
      return false;
    }

    user.show_callendar_Unlockdays = this.userDetails.show_callendar_Unlockdays;

    if (user.absences[date]) {
      if (user.absences[date][0].Approved == 1) {
        this.createModal(
          UserMomentsDetailComponent,
          { user, date: date },
          (_) => {}
        );
        return;
      }

      if (user.absences[date][0].isRejected == 1) {
        if (
          user.moments[date] &&
          user.moments[date].Type != "userRaportStatus"
        ) {
          this.createModal(
            UserMomentsDetailComponent,
            { user, date: date },
            (_) => {}
          );
          return;
        } else if (
          user.moments[date] &&
          user.moments[date].Type == "userRaportStatus" &&
          user.show_callendar_Unlockdays
        ) {
          if (this.loggedUser.show_callendar_Unlockdays) {
            this.createModal(
              LockedDaysComponent,
              { user, date: date },
              (res) => {
                if (res && res.status) user.moments[date] = null;
              }
            );
          }
          return;
        }

        this.createModal(
          SendNotificationToUserForTimesheetComponent,
          { user, date: date },
          (res) => {
            if (res && res.status) user.moments[date] = null;
          }
        );
      }
    } else {
      if (user.moments[date] && user.moments[date].Type != "userRaportStatus") {
        this.createModal(
          UserMomentsDetailComponent,
          { user, date: date },
          (_) => {}
        );
        return;
      } else if (
        user.moments[date] &&
        user.moments[date].Type == "userRaportStatus"
      ) {
        if (this.loggedUser.show_callendar_Unlockdays) {
          this.createModal(LockedDaysComponent, { user, date: date }, (res) => {
            if (res && res.status) user.moments[date] = null;
          });
        }
        return;
      }

      this.createModal(
        SendNotificationToUserForTimesheetComponent,
        { user, date: date },
        (res) => {
          if (res && res.status) user.moments[date] = null;
          this.toastr.success(
            this.translate.instant("Action successful."),
            this.translate.instant("Success")
          );
        }
      );
    }
  }

  private createModal(component, data, callback) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = data;

    this.dialog
      .open(component, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (callback) {
          callback(res);
        }
      });
  }
}
