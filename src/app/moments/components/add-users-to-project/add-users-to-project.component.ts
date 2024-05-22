import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { cloneDeep } from "lodash";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-add-users-to-project",
  templateUrl: "./add-users-to-project.component.html",
  styleUrls: ["./add-users-to-project.component.css"],
})
export class AddUsersToProjectComponent implements OnInit {
  public createForm: FormGroup;
  public users: any[] = [];
  public project: any;
  public user: any;
  public disableSubmit: boolean = true;
  public usersArray: any[] = [];
  public userIndex: number;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddUsersToProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.project = this.modal_data["project"];
    this.users = this.modal_data["users"];
    this.usersArray = cloneDeep(this.project.users);

    this.createForm = this.fb.group({
      id: ["", []],
      ProjectUserId: ["", [Validators.required]],
      firstname: ["", []],
      lastname: ["", []],
      ProjectID: [this.project["id"], []],
      userArray: [this.users[0], []],
    });
  }

  removeFromArray(index) {
    this.project.users.splice(index, 1);
    let user = this.usersArray.splice(index, 1)[0];

    this.projectsService
      .removeUserFromProject(user, this.project)
      .then((response) => {
        if (response["status"]) {
          this.users.push(user);
        }
      });

    if (this.project.users.length == 0) this.disableSubmit = true;
  }

  onChangeSetUser(user_id) {
    this.user = this.users.filter((value) => value.id == user_id)[0];
    this.userIndex = this.users.findIndex((value) => value.id == user_id);
  }

  addToArray() {
    if (this.user) {
      this.user.oldUser = false;
      this.user.projectId = this.project.id;
      this.usersArray.push(this.user);
      this.users.splice(this.userIndex, 1);
      this.disableSubmit = false;
      this.user = null;
      this.userIndex = null;

      console.log(this.project.users);
    } else
      this.toastr.info(
        this.translate.instant("Please select user") + ".",
        this.translate.instant("Info")
      );
  }

  create() {
    let objects = this.usersArray;

    this.projectsService.addUsersOnProject(objects).then((response) => {
      let result = {
        status: response["status"],
        users: response["data"],
        project: this.project,
      };
      this.dialogRef.close({ result });
    });
  }
}
