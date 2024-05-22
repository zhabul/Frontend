import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";

@Component({
  selector: "app-notification-task-modal",
  templateUrl: "./notification-task-modal.component.html",
  styleUrls: ["./notification-task-modal.component.css"],
})
export class NotificationTaskModalComponent implements OnInit {
  public createForm: FormGroup;
  public note: any;
  public roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NotificationTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private timeRegistrationService: TimeRegistrationService
  ) {}

  ngOnInit() {
    this.initializeData();
    this.setValidation();
  }

  onChangeSetRole(roleId) {
    let role = this.roles.filter((value) => value.id == roleId)[0];
    this.createForm.get("RoleID").patchValue(role.id);
    this.createForm.get("RoleName").patchValue(role.roles);
  }

  create() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      this.timeRegistrationService
        .addRoleToNotificationTask(data)
        .subscribe((res) => {
          let obj = {
            id: res["id"],
            UserNotificationTasksID: data.id,
            RoleID: data.RoleID,
            Name: data.RoleName,
          };
          if (res["status"]) this.dialogRef.close(obj);
        });
    }
  }

  setValidation() {
    this.createForm = this.fb.group({
      id: [this.note.id, []],
      RoleID: [this.roles[0].id, [Validators.required]],
      RoleName: [this.roles[0].roles, []],
    });
  }

  initializeData() {
    this.roles = this.modal_data.roles;
    this.note = this.modal_data.note;
  }
}
