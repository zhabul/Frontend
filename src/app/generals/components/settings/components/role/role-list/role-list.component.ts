import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditRoleModalComponent } from "../edit-role-modal/edit-role-modal.component";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { TranslateService } from "@ngx-translate/core";
import { Role } from "../../../interfaces/role";
import { SettingsService } from "src/app/core/services/settings.service";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";

@Component({
  selector: "app-role-list",
  templateUrl: "./role-list.component.html",
  styleUrls: ["./role-list.component.css"],
})
export class RoleListComponent implements OnInit, OnDestroy {
  saveSubject: Subscription;
  presetColors: string[];
  updateArray: Role[] = [];
  @Input() openModalEmitter;
  @Input() roles;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getPrestColors();
    this.saveSubject = this.settingsService.saveSubject.subscribe((tab) => {
      if (tab == 2) {
        this.onSave();
      }
    });
  }

    changeColor(color, role) {

        role.changed = true;
        this.getPrestColors();
        this.saveRoleDetail(false);
    }

  getPrestColors() {
    this.presetColors = [];
    this.roles.forEach((role) => this.presetColors.push(role.color));
  }

  openEditModal(roleForEdit) {

    if (!this.userDetails.create_settings_Global) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { role: roleForEdit, modalAction: "Edit role" };

    const dialogRef = this.dialog.open(EditRoleModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      this.settingsService.isSavedSubject.next(false);
    });
  }

  openNewRoleModal() {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      role: {
        roles: "",
        reduction: "",
        number: "",
        sortingScheme: "",
        price: "",
        active: "0",
        color: "#FFFFFF",
        changed: true,
      },
      modalAction: "New role",
    };

    const dialogRef = this.dialog.open(EditRoleModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((newRole) => {
      if (newRole && newRole != false) {
        this.roles.push(newRole);
        this.settingsService.createDefaultRole(newRole).subscribe({
          next: (res) => {
            if (res.status) {
              newRole.id = res.data;
              newRole.allow_delete = true;
              this.toastr.success(
                this.translate.instant("You successfully created new role.")
              );
            }
          },
          error: (err) => {},
        });
      }
    });
  }

  deleteRole(i) {
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
        "Do you really want to delete this role?"
      ),
    };
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.settingsService.deleteDefaultRole(this.roles[i].id).subscribe({
            next: (res) => {
              if (res.status) {
                this.toastr.success(
                  this.translate.instant("You successfully deleted role.")
                );
                this.roles.splice(i, 1);
              }
            },
            error: (err) =>
              this.toastr.error(this.translate.instant("Server error")),
          });
        }
      });
  }

  onSave() {
    this.saveRoleDetail();
  }

  saveRoleDetail(msg = true) {
    this.updateArray = this.roles.filter((role) => role.changed == true);
    if (this.updateArray.length == 0) {
      this.toastr.info(this.translate.instant("Everything is up to date"));
    } else {
      this.updateArray.forEach((role, i) =>
        this.settingsService.updateDefaultRoles(role).subscribe({
          next: (response) => {
            if (response.status && msg) {
              this.toastr.success(
                this.translate.instant("You successfully updated the role.")
              );
              this.settingsService.isSavedSubject.next(true);
            }
          },
          error: (err) => {
            this.toastr.error(this.translate.instant("Server error"));
          },
        })
      );

      this.updateArray = [];
      this.roles.forEach((role) => (role.changed = false));
    }
  }

  ngOnDestroy() {
    this.saveSubject.unsubscribe();
  }
}
