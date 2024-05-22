import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { UsersService } from "src/app/core/services/users.service";
import { AbstractControl, FormControl } from "@angular/forms";
import { EditRoleComponent } from "./edit-role/edit-role.component";
import { NewRoleComponent } from "./new-role/new-role.component";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-role-colors",
  templateUrl: "./role-colors.component.html",
  styleUrls: ["./role-colors.component.css"],
})
export class RoleColorsComponent implements OnInit {
  public roles = [];

  public color = "#000000";
  public colorControl: AbstractControl = new FormControl(null);

  constructor(
    private userService: UsersService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userService.getRoles().subscribe((roles: any) => {
      this.roles = roles;
      console.log(this.roles);
    });
    this.translate.use(sessionStorage.getItem("lang"));
  }

  colorChanged(color, roleId) {
    this.userService.updateRoleColor(roleId, color).subscribe((res) => {
      if (res["status"]) {
        this.toastr.success(
          this.translate.instant("Successfully updated role color!"),
          this.translate.instant("Success")
        );
      }
    });
  }

  openEditModal(role, i) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { role: role };

    this.dialog
      .open(EditRoleComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.roles[i] = response;
          this.toastr.success(
            this.translate.instant("You successfully updated the role."),
            this.translate.instant("Success")
          );
        }
      });
  }

  openModal() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = {};

    this.dialog
      .open(NewRoleComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.roles.push(response);
          this.toastr.success(
            this.translate.instant("You successfully created new role."),
            this.translate.instant("Success")
          );
        }
      });
  }

  removeRole(role, id) {
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
          this.userService.deleteRole(role.id).subscribe((res) => {
            if (res["status"]) {
              if (res["status"] === "Role has users.") {
                this.toastr.error(
                  this.translate.instant("TSC_ROLE_CANT_DELETE"),
                  this.translate.instant("Error")
                );
              } else {
                this.roles.splice(id, 1);
                this.toastr.success(
                  this.translate.instant("You successfully deleted role."),
                  this.translate.instant("Success")
                );
              }
            }
          });
        }
      });
  }
}
