import { Component, OnInit } from "@angular/core";
import { UsersService } from "src/app/core/services/users.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-new-role",
  templateUrl: "./new-role.component.html",
  styleUrls: ["./new-role.component.css"],
})
export class NewRoleComponent implements OnInit {
  public role: any;
  public roles = "";
  public reduction = "";
  public number = "";
  public sortingScheme = "";
  public status: any = true;
  public price = "";

  constructor(
    private usersService: UsersService,
    public dialogRef: MatDialogRef<NewRoleComponent>,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  create() {
    if (!this.roles) {
      this.toastr.error(
        this.translate.instant("Please input the name") + ".",
        this.translate.instant("Error")
      );
    } else {
      const data = {
        id: null,
        roles: this.roles,
        reduction: this.reduction,
        sortingScheme: this.sortingScheme,
        price: this.price,
        number: this.number,
        active: this.status ? 1 : 0,
      };
      this.usersService.createNewRole(data).subscribe((res) => {
        if (res["status"]) {
          data.id = res["id"];
          this.dialogRef.close(data);
        }
      });
    }
  }
}
