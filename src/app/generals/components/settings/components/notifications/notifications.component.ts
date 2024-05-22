import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { SettingsService } from "src/app/core/services/settings.service";
import { ToastrService } from "ngx-toastr";
import { TimeRole } from "../../interfaces/time-role";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements OnInit {
  format = 24;
  notifications: TimeRole[];
  loading = true;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.settingsService.getUserNotificationTasks().subscribe({
      next: (response) => {
        if (response.status) {
          this.notifications = response.data;
          this.loading = false;
        }
      },

      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  deleteTime(times, i) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "auto";
    dialogConfig.panelClass = "mat-dialog-confirmation";
    dialogConfig.data = {
      questionText: this.translate.instant(
        "Do you really want to delete this notification time?"
      ),
    };
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.deleteTimeReq(times, i);
        }
      });
  }

  timeSetToday(notification, event) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.loading = true;
    const newTime = {
      type: "Today",
      taskId: notification.id,
      time: event,
      id: "",
    };

    this.settingsService.createTimeForNotification(newTime).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(
            this.translate.instant("Notification time added.")
          );
          newTime.id = response.data;
          notification.TodayTimes.push(newTime);
          this.loading = false;
        }
      },
      error: () => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  timeSetTomorrow(notification, event) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.loading = true;
    const newTime = {
      type: "Yesterday",
      taskId: notification.id,
      time: event,
      id: "",
    };

    this.settingsService.createTimeForNotification(newTime).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(
            this.translate.instant("Notification time added")
          );
          newTime.id = response.data;
          notification.TomorowTimes.push(newTime);
          this.loading = false;
        }
      },
      error: () => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  deleteTimeReq(times: any, i: number) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.loading = true;
    this.settingsService.deleteTimeForNotification(times[i]).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(
            this.translate.instant("Notification time deleted.")
          );
          times.splice(i, 1);
          this.loading = false;
        }
      },

      error: () => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }
}
