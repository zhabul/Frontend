import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MomentsService } from "src/app/core/services/moments.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { SetTimeComponent } from "src/app/timesheets/components/set-time/set-time.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-project-moments",
  templateUrl: "./project-moments.component.html",
  styleUrls: ["./project-moments.component.css"],
})
export class ProjectMomentsComponent implements OnInit {
  public createForm: FormGroup;
  public project: any;
  public momentIndex: any;
  public language = "en";

  public deleteMessage: any;
  public week: any;
  public moments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private momentService: MomentsService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.language = sessionStorage.getItem("lang");
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit() {
    this.project = this.route.snapshot.data["project"];
    this.moments = this.route.snapshot.data["moments"]["data"] || [];

    this.createForm = this.fb.group({
      id: ["", []],
      ProjectID: [this.project.id, []],
      Name: ["", [Validators.required]],
      Hours: ["", [Validators.required]],
      status: ["new", []],
    });
  }

  createProjectMoment() {
    let data = this.createForm.value;

    if (this.createForm.valid) {
      this.momentService.createProjectMoment(data).subscribe((response) => {
        if (
          response["moment_id"] &&
          response["type"] &&
          response["type"] == "new"
        ) {
          data.id = response["moment_id"];
          this.moments.push(data);
          this.toastr.success(
            this.translate.instant("You have successfully created Moment."),
            this.translate.instant("Moment")
          );
        } else {
          this.moments[this.momentIndex].Name = data.Name;
          this.moments[this.momentIndex].Hours = data.Hours;
          this.createForm.get("status").patchValue("new");
          this.toastr.success(
            this.translate.instant("You have successfully updated Moment."),
            this.translate.instant("Moment")
          );
        }

        this.createForm.get("Name").patchValue("");
        this.createForm.get("Hours").patchValue("");
        this.createForm.get("id").patchValue("");
      });
    }
  }

  editMoment(index, moment) {
    this.createForm.get("Name").patchValue(moment["Name"]);
    this.createForm.get("Hours").patchValue(moment["Hours"]);
    this.createForm.get("id").patchValue(moment["id"]);
    this.createForm.get("status").patchValue("edit");
    this.momentIndex = index;
  }

  deleteMoment(i, moment) {
    this.momentService.deleteMoment(moment.id).subscribe((response) => {
      if (response["status"]) {
        this.moments.splice(i, 1);
        this.toastr.success(
          this.translate.instant("You have successfully deleted Moment."),
          this.translate.instant("Deleted Moment")
        );
      }
    });
  }

  openModal() {
    const data = this.createForm.value;
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { data: data };
    this.dialog
      .open(SetTimeComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        this.createForm.get("Hours").patchValue(diaolgConfig["data"]["Hours"]);
      });
  }
}
