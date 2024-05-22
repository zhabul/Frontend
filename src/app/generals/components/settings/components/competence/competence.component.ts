import { Component, OnInit } from "@angular/core";
import { SettingsService } from "src/app/core/services/settings.service";
import { Competence } from "../../interfaces/competence";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-competence",
  templateUrl: "./competence.component.html",
  styleUrls: ["./competence.component.css"],
})
export class CompetenceComponent implements OnInit {
  competences: Competence[];
  newCompetence = "";
  loading = true;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  constructor(
    private settingService: SettingsService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.settingService.getEducations().subscribe({
      next: (res) => {
        if (res.status) {
          this.competences = res.data;
          this.loading = false;
        }
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  addCompetence() {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    if (this.newCompetence.length > 0)
      this.settingService.addEducation(this.newCompetence).subscribe({
        next: (response) => {
          if (response.status) {
            this.toastr.success(this.translate.instant("Education added."));
            this.competences.push({
              name: this.newCompetence,
              id: response.data,
            });
            this.newCompetence = "";
          }
        },
        error: (err) => {
          this.toastr.error(this.translate.instant("Server error"));
        },
      });
  }

  deleteCompetenceModal(i: number) {
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
        "Are you sure you want to delete this training?"
      ),
    };
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.deleteCompetence(i);
        }
      });
  }

  deleteCompetence(i: number) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.settingService.deleteEducation(this.competences[i].id).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(this.translate.instant("Education deleted."));
          this.competences.splice(i, 1);
        }
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }
}
