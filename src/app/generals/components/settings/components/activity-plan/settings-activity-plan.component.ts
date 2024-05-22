import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { EditActivityComponent } from "./edit-activity/edit-activity.component";
import { ToastrService } from "ngx-toastr";
import { SettingsService } from "src/app/core/services/settings.service";
import { Activity } from "../../interfaces/activity";

@Component({
  selector: "app-settings-activity-plan",
  templateUrl: "./settings-activity-plan.component.html",
  styleUrls: ["./settings-activity-plan.component.css"],
})
export class ActivityPlanSettingsComponent implements OnInit {
  activities: Activity[];
  loading = true;
  editingData = false;
  level = 0;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.settingsService.getActivities().subscribe({
      next: (res) => {
        if (res.status) {
          this.activities = res.data;
          this.loading = false;
          this.activities.forEach((activity) => (activity.toggle = false));
        }
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  editActivity(activity) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "auto";
    dialogConfig.data = {
      activityToEdit: activity,
      action: this.translate.instant("Edit activity"),
    };
    this.dialog
      .open(EditActivityComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response && response != false) {
          this.updateActivity(activity);
        }
      });
  }

  openNewActivityModal() {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "auto";
    dialogConfig.data = {
      activityToEdit: {
        description: "",
        status: false,
        activities: [],
        number: "",
        parent: "0",
        toggle: false,
      },
      action: this.translate.instant("New activity"),
    };
    this.dialog
      .open(EditActivityComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response && response != false) {
          this.postNewActivity(response);
        }
      });
  }

  removeActivity(activityWithIndex) {
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
        "Do you really want to delete this activity?"
      ),
    };
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.deleteActivity(activityWithIndex);
        }
      });
  }

  postNewActivity(newActivity) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.editingData = true;
    this.settingsService.createActivity(newActivity).subscribe({
      next: (response) => {
        if (response.status) {
          newActivity.id = response.data;
          this.activities.push(newActivity);
          this.toastr.success(this.translate.instant("New activity added"));
          this.editingData = false;
        }
      },

      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  updateActivity(activity) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.settingsService.updateActivity(activity, activity.id).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(
            this.translate.instant("You have successfully updated activity.")
          );
        }
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  deleteActivity(activityWithIndex) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    let activity = activityWithIndex.activities[activityWithIndex.index];
    this.editingData = true;
    this.settingsService.deleteActivity(activity.id).subscribe({
      next: (response) => {
        if (response.status) {
          this.editingData = false;
          activityWithIndex.activities.splice(activityWithIndex.index, 1);
          this.toastr.success(
            this.translate.instant("You have successfully deleted activity.")
          );
        }
      },

      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }
}
