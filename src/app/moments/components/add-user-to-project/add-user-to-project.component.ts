import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { MomentsService } from "src/app/core/services/moments.service";
import {  MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UsersService } from "../../../core/services/users.service";


declare var $;

@Component({
  selector: "app-add-user-to-project",
  templateUrl: "./add-user-to-project.component.html",
  styleUrls: ["./add-user-to-project.component.css"],
})
export class AddUserToProjectComponent implements OnInit {
  public createForm: FormGroup;
  public users: any[] = [];
  public project: any;
  public user: any;
  public disableSubmit: boolean = true;
  public usersArray: any[] = [];
  public userIndex: number;
  private language = "en";
  private week = "Week";
  public endDate: any;
  public dropdownSettings;
  public selectedUsers = [];
  public projectUsers = [];
  public removedUsers = [];
  public spinner: boolean = false;
  public initForm;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private projectsService: ProjectsService,
    private momentsService: MomentsService,
    public dialogRef: MatDialogRef<AddUserToProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private usersService: UsersService

  ) {

    this.projectUsers = this.modal_data.data.projectUsers;
    this.project = this.modal_data.data.project;

    this.initForm = this.modal_data.data.project;

    // if (this.language == "en") this.week = "Week";
    // else this.week = "Vecka";
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
  }

  getUsers() {
    this.spinner =true;
    this.usersService
      .getUsersWantToBeAddedOnProject(this.modal_data.data.project.id).subscribe((res: { data: any[], status: boolean })=>{
        if (res.status) {
          this.users = res.data;
          this.spinner =false;
        }
      });
  }

  ngOnInit() {

    this.getUsers();
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "fullname",
      selectAllText: this.translate.instant("Select All"),
      unSelectAllText: this.translate.instant("Unselect All"),
      itemsShowLimit: 0,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText:
        this.translate.instant("No data available"),
      searchPlaceholderText: this.translate.instant("Search"),
    };

    // this.users = this.route.snapshot.data["users"]["data"] || [];
    // this.projectUsers =
    //   this.route.snapshot.data["projectUsers"].data.map((user) => {
    //     return {
    //       id: user.UserID,
    //       fullname: user.Surname + " " + user.Lastname,
    //     };
    //   }) || [];
    this.selectedUsers = this.projectUsers;

    this.initForm["addedUsersPermit"] = this.modal_data.data.projectUsers;

    this.user = this.users[0];
    // this.project = this.route.snapshot.data["project"] || [];

    const pStartDate = new Date(this.project.StartDate.split(" ")[0]);
    const pEndDate = new Date(this.project.EndDate.split(" ")[0]);

    $("#dateSelectStartDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        startDate: pStartDate,
        endDate: pEndDate,
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) >
          Date.parse(this.createForm.value.EndDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Start date cannot be after end date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.StartDate;
          }, 0);
        } else {
          this.createForm.get("StartDate").patchValue(ev.target.value);
        }
      });

    $("#dateSelectEndDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        startDate: pStartDate,
        endDate: pEndDate,
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) <
          Date.parse(this.createForm.value.StartDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Due date cannot be before start date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.EndDate;
          }, 0);
        } else {
          this.createForm.get("EndDate").patchValue(ev.target.value);
          this.endDate = ev.target.value;
        }
      });

    this.createForm = this.fb.group({
      id: ["", []],
      ProjectID: [this.project.id, []],
      StartDate: ["", [Validators.required]],
      EndDate: ["", [Validators.required]],
      Color: [this.project.Color, []],
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

  getFilteredUsers() {
    return this.selectedUsers.filter((selectedUser) => {
      return !this.projectUsers.some(
        (projectUser) => projectUser.id === selectedUser.id
      );
    });


  }

  create() {

    if (this.project.status == 3) {
      this.toastr.error(
        this.translate.instant(
          "The action cannot be performed because the project is completed"
        ) + ".",
        this.translate.instant("Error")
      );
      return;
    }

    const data = this.createForm.value;
    data.users = this.getFilteredUsers();
    data.removedUsers = this.removedUsers;

    if (data.users.length < 1 && data.removedUsers.length < 1) {
      return;
    }

    if (data.users.length > 0 && this.createForm.invalid) {
      return;
    }

    data.users = this.setUserEndDates(data);

    this.projectsService.addUserToProjectFromPermit(data).then((response) => {
      if (response["status"]) {
        this.excuteCronTask();
        this.toastr.success(
          this.translate.instant(
            "You have successfully added User on Project!"
          ),
          this.translate.instant("Success")
        );
        this.router.navigate(["/projects/view/", this.project.id]);
      }
      this.close(true, 'submit');
    });
  }

  setUserEndDates(data) {
    const endDate = new Date(data.EndDate.split(" ")[0]);

    return data.users.map((user: any) => {
      const addedUser = this.users.find((us) => us.id == user.id);
      const addedUserEndDate =
        addedUser.endDate !== null ? new Date(addedUser.endDate) : false;

      if (addedUserEndDate !== false && endDate > addedUserEndDate) {
        user.endDate = addedUser.endDate;
      }

      user.startDate = addedUser.startDate;

      return user;
    });
  }

  excuteCronTask() {
    this.momentsService.excuteCronTask();
  }

  onItemSelect(item: any) {

    //Add User to Array
    this.selectedUsers = item;

    //For Remove User From Array
    this.removedUsers = this.projectUsers.filter(projectUser =>
      !item.some(user => user.id === projectUser.id)
    );

    // this.removedUsers = this.removedUsers.filter((item_) => {
    //   return item_.id == item.id;
    // });

  }

  // onItemDeSelect(item: any) {
  //   if (this.projectUsers.some((projectUser) => projectUser.id === item.id)) {
  //     this.removedUsers.push(item);
  //   }
  // }

  onSelectAll(items: any) {
    this.selectedUsers = items;
    // items.forEach((item) => {
    //   this.onItemSelect(item);
    // });
  }

  onDeSelectAll() {

    this.selectedUsers.forEach((user) => {
      this.removedUsers.push(user);
    });
    this.selectedUsers = [];

    // this.users
    //   .map((user) => {
    //     return {
    //       id: user.id,
    //       fullname: user.fullname,
    //     };
    //   })
    //   .forEach((item) => {
    //     this.onItemDeSelect(item);
    //   });
  }

  focusSearch() {
    const li = document.getElementsByClassName("filter-textbox")[0];
    const search: any = li.firstChild;
    search.focus();
  }

  close(parameter = false, from) {
    this.dialogRef.close(parameter);
    if(from == "submit"){
      window.location.reload();
    }
  }

  checkids(selected,initFormselected){
    if((selected.length != initFormselected.length)) return true;
    for(let i = 0; i<selected.length;i++){
      const element = selected.at(i)
      if(!initFormselected.some((el) => el.Id == element.Id))return true
    }
    return false;
  }
}
