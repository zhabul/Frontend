import { Component, OnInit } from "@angular/core";
import { NewActivityComponent } from "./modals/new-activity/new-activity.component";
import { EditActivityComponent } from "./modals/edit-activity/edit-activity.component";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-activity-plan",
  templateUrl: "./activity-plan.component.html",
  styleUrls: ["./activity-plan.component.css"],
})
export class ActivityPlanComponent implements OnInit {
  public activities = [];

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectsService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.projectService.getAllActivities().then((res) => {
      if (res["status"]) {
        this.activities = res["data"];
      }
    });
  }

  openModal() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = {
      activities: this.getNotDeletedActivities(this.activities),
    };

    this.dialog.open(NewActivityComponent, diaolgConfig);
  }

  openEditModal(activity) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { activity };

    this.dialog
      .open(EditActivityComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          activity.description = response.description;
          activity.status = response.status;
        }
      });
  }

  async deleteActivity(activity) {
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
          const response = await this.projectService.deleteActivity(
            activity.id
          );

          if (response["status"]) {
            this.toastr.success(
              this.translate.instant("You have successfully deleted activity."),
              this.translate.instant("Success")
            );
            this.setDeletedPropertyForActivityAndChildren(activity);
          }
        }
      });
  }

  setDeletedPropertyForActivityAndChildren(activity) {
    activity.deleted = true;

    activity.activities.forEach((ac) => {
      this.setDeletedPropertyForActivityAndChildren(ac);
    });
  }

  toggleChildActivitiesExpanded(activity) {
    activity.expandChildActivities = !activity.expandChildActivities;
  }

  getNotDeletedActivities(activities) {
    return activities.filter((activity) => !activity.deleted);
  }
}
