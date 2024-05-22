import { Component, OnInit, Inject } from "@angular/core";
import { UsersService } from "src/app/core/services/users.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "add-education-modal",
  templateUrl: "./add-education-modal.component.html",
  styleUrls: ["./add-education-modal.component.css"],
})
export class AddEducationModal implements OnInit {
  name = "";
  sending = false;
  nameError = false;

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    public dialogRef: MatDialogRef<AddEducationModal>
  ) {}

  ngOnInit() {}

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

    this.userService
      .addEducation(data)
      .subscribe({
        next: (res: any) => {
          this.sending = false;

          if (res.status) {
            this.name = "";
            data.id = res.id;

            this.dialogRef.close(data);
          }
        },
        error: (e) => {
          this.toastr.error(
            this.translate.instant("Server Error."),
            this.translate.instant("Error")
          );
        }
      });
  }
}
