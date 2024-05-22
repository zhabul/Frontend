import { Component, OnInit } from "@angular/core";
import { UsersService } from "src/app/core/services/users.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { AddEducationModal } from "./add-education-modal/add-education-modal.component";

@Component({
  selector: "add-education",
  templateUrl: "./add-education.component.html",
  styleUrls: ["./add-education.component.css"],
})
export class AddEducation implements OnInit {
  name = "";
  sending = false;
  educations = [];
  nameError = false;
  fetchError = false;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.getEducations();
  }

  addEducation() {
    if (this.sending) {
      return false;
    }

    if (this.name === "" || this.name.length > 50) {
      this.nameError = true;
      return false;
    }

    this.sending = true;
    this.nameError = false;

    const data = {
      name: this.name,
      id: "",
    };

    this.userService.addEducation(data).subscribe({
      next: (res: any) => {
        this.sending = false;

        if (res.status) {
          this.name = "";
          data.id = res.id;
          this.educations.push(data);
          this.toastr.success(
            this.translate.instant("Education added."),
            this.translate.instant("Success")
          );
        }
      },
      error: (e) => {
        this.toastr.error(
          this.translate.instant("Server Error."),
          this.translate.instant("Error")
        );
      },
    });
  }

  removeEducation(education) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.removeEducationCall(education);
        }
      });
  }

  openInputModal() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "500px";
    this.dialog
      .open(AddEducationModal, diaolgConfig)
      .afterClosed()
      .subscribe((education) => {
        if (education) {
          this.educations.push(education);
          this.toastr.success(
            this.translate.instant("Education added."),
            this.translate.instant("Success")
          );
        }
      });
  }

  removeEducationCall(education) {
    if (this.sending) {
      return false;
    }

    this.sending = true;

    this.userService.removeEducation(education).subscribe((res: any) => {
      this.sending = false;

      if (res.status) {
        this.removeEducationResponse(res, education);
      } else {
        this.toastr.error(
          this.translate.instant("Server Error."),
          this.translate.instant("Error")
        );
      }
    });
  }

  removeEducationResponse(res, education) {
    if (res.message === "removed") {
      this.educations = this.educations.filter((education_) => {
        return education.id != education_.id;
      });
      this.toastr.success(
        this.translate.instant("Education deleted."),
        this.translate.instant("Success")
      );
    } else if (res.message === "in_use") {
      this.toastr.info(
        this.translate.instant("Education in use."),
        this.translate.instant("Info")
      );
    }
  }

  getEducations() {
    if (this.sending) {
      return false;
    }

    this.sending = true;

    this.userService.getEducations().subscribe((res: any) => {
      this.sending = false;
      if (res.status) {
        this.educations = res.data;
      } else {
        this.fetchError = true;
      }
    });
  }
}
