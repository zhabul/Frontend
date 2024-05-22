import { Component, OnInit, Inject } from "@angular/core";
import { UsersService } from "src/app/core/services/users.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-edit-role",
  templateUrl: "./edit-role.component.html",
  styleUrls: ["./edit-role.component.css"],
})
export class EditRoleComponent implements OnInit {
  public role: any;
  public roles = "";
  public reduction = "";
  public number = "";
  public sortingScheme = "";
  public status: any = true;
  public price = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private userService: UsersService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<EditRoleComponent>
  ) {}

  ngOnInit() {
    this.role = this.modal_data.role;
    this.roles = this.role.roles;
    this.reduction = this.role.reduction;
    this.number = this.role.number;
    this.sortingScheme = this.role.sortingScheme;
    this.status = this.role.active;
    this.price = this.role.price;
  }

  update() {
    if (!this.roles) {
      this.toastr.error(
        this.translate.instant("Please input the name") + ".",
        this.translate.instant("Error")
      );
    } else {
      const data = {
        id: this.role.id,
        Name: this.roles,
        Reduction: this.reduction,
        SortingScheme: this.sortingScheme,
        Price: this.price,
        Number: this.number,
        Active: this.status ? 1 : 0,
      };

      this.userService.updateRole(data).subscribe((res) => {
        if (res["status"]) {
          this.role.roles = this.roles;
          this.role.reduction = this.reduction;
          this.role.number = this.number;

          this.role.sortingScheme = this.sortingScheme;
          this.role.active = this.status;
          this.dialogRef.close(this.role);
        }
      });
    }
  }
}
