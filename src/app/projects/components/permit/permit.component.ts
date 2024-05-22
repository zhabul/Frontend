import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { UsersService } from "src/app/core/services/users.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "underscore";
import * as moment from "moment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { AddUserToProjectComponent } from "src/app/moments/components/add-user-to-project/add-user-to-project.component";
import { ActivatedRoute } from "@angular/router";
import { PermitEducationDialogComponent } from "../permit-education-dialog/permit-education-dialog.component";
declare var $;

@Component({
  selector: "app-permit",
  templateUrl: "./permit.component.html",
  styleUrls: ["./permit.component.css"],
})
export class PermitComponent implements OnInit, AfterViewInit {
  @Input() project: any;
  @Input() users: any;
  @Input("top_menu_status") set containerHeight(status) {
    if (status == true) {
      this.container_height = "calc(100vh - 2px - 550px)";
    } else {
      this.container_height = "calc(100vh - 4px - 170px)";
    }
  }
  public ResponsablePersonWhoHavePermision;
  public container_height = "calc(100vh - 4px - 170px)";
  public bgcol: any = "transparent"
  public bgcol1: any = "transparent"
  public indexP: any;
  public user_id: any;
  public user: any;
  public projectUserId: any;
  public gender = "male";
  public StartDate: any;
  public EndDate: any;
  public language = "en";
  public week = "Week";
  public userDetails: any;
  public originalUsers = [];
  public projectId: any;
  public activeUserID: any = 0;
  public oldStartDate: any;
  public oldEndDate: any;
  public today: any;
  public pEndDate: any;
  public pStartDate: any;
  public userIndex: any = 0;
  public responsiblePersons: any[] = [];
  public devName:any;
  public obj:any;
  searchText: string;
  lastActive: any = null;
  firstInactive: any = null;
  lenMax: number = 0;
  lenMaxForAll: number = 0;
  public currentClass = "title-new-project";


  public countFilterData: any = [];
  public existenceInactiveUsers : any = [];
  public allHidden : boolean= false;
  public checkInactive: any= [];
  public projectUsers: any =[];
  @ViewChild("tableWraperImag") tableWraperImag: ElementRef;

  @ViewChild("tableWraperImag2") tableWraperImag2: ElementRef;
  public langItem: any;
  constructor(
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private route: ActivatedRoute,
  ) {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
  }

  ngOnInit() {
    this.langItem = sessionStorage.getItem('lang');
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    if(this.langItem == 'en') this.devName = 'D'; else
    if(this.langItem == 'sw') this.devName = 'U';

    //  this.users = this.users.sort((a, b) =>(a.isActive < b.isActive ? 1 : -1) );

    this.sortUsersbyDateAndActive();

    this.originalUsers = JSON.parse(JSON.stringify(this.users));

    this.users.forEach((element) => {
      element.hidden = false
      if (element.isActive == 1){
        this.lastActive = element
      }
      if (element.isActive != 1 && this.firstInactive == null) {
        this.firstInactive = element;
        return;
      }
    });


    this.today = new Date();
    this.projectId = this.project.id;
    this.pEndDate = new Date(this.project.EndDate.split(" ")[0]);
    this.pStartDate = new Date(this.project.StartDate.split(" ")[0]);
    this.projectUsers =
    this.route.snapshot.data["projectUsers"].data.map((user) => {
      return {
        id: user.UserID,
        fullname: user.Surname + " " + user.Lastname,
      };
    }) || [];

  }

  sortUsersbyDateAndActive() {

    this.users.forEach(element => {

      this.users = this.users.sort((a, b) =>(a.EndDate < b.EndDate ? 1 : -1));
      this.users = this.users.sort((a, b) =>(a.isActive < b.isActive ? 1 : -1) );

    });
  }
  ngAfterViewInit() {
    this.initializeStartDate();
    this.initializeEndDate();
    this.getResponsiblePersons();
  }

  visualFix(event, user, key) {
    const userDate = user[key];
    const selectedDate = new Date(userDate.slice(0, 10));
    const value = new Date(event.target.value.slice(0, 10));

    if (selectedDate !== value) {
      event.target.value = userDate;
    }
  }

  initializeStartDate() {
    if (this.userDetails.create_project_Permit == 1) {
      for (let user of this.users) {
        const userStartDate = new Date(user.user_start_date.split(" ")[0]);
        const userEndDate = user.user_end_date;
        const currentDate= moment().format("YYYY-MM-DD");

        const date = $(".startDate-" + user.UserID).datepicker({
          format: "yyyy-mm-dd",
          weekStart: 1,
          calendarWeeks: true,
          autoclose: true,
          language: this.language,
          currentWeek: false,
          todayHighlight: true,
          currentWeekTransl: this.week,
          currentWeekSplitChar: "-",
          startDate:
            userStartDate > this.pStartDate ? userStartDate : this.pStartDate,
          endDate:
            userEndDate !== null && new Date(userEndDate) < this.pEndDate
              ? new Date(userEndDate)
              : this.pEndDate,
        });

        date.on("changeDate", (e) => {

          this.StartDate = e.target.value;
          if (
            Date.parse(this.EndDate.split(" ")[0]) <
            Date.parse(this.StartDate.split(" ")[0])
          ) {
            let className = ".input-group-" + this.userIndex;
            $(className).addClass("warring");
            setTimeout(() => {
              this.toastr.info(
                this.translate.instant("Start date cannot be after end date."),
                this.translate.instant("Info")
              );
              e.target.value = this.oldStartDate;
            }, 0);
          } else {


            this.oldStartDate = this.StartDate;
            this.users[this.userIndex].StartDate = this.oldStartDate;

             if(currentDate >= this.StartDate){
               this.users[this.userIndex].isActive = 1;
               //this.users = this.users.sort((a, b) => (a.isActive < b.isActive ? 1 : -1));
             }else{
               this.users[this.userIndex].isActive = 0;
               //this.users = this.users.sort((a, b) => (a.isActive < b.isActive ? 1 : -1));
             }

            this.sortUsersbyDateAndActive()
            let object = {
              type: "StartDate",
              value: e.target.value.split(" ")[0],
              ProjectUserScheduleDateId: this.activeUserID,
            };
            let className = ".input-group-" + this.userIndex;
            $(className).removeClass("warring");
            this.updateDate(object);

          }
        });
      }
    }
  }

  initializeEndDate() {
    if (this.userDetails.create_project_Permit == 1) {
      for (let user of this.users) {
        const userStartDate = new Date(user.user_start_date.split(" ")[0]);
        const userEndDate = user.user_end_date;
        const currentDate= moment().format("YYYY-MM-DD");

        const date = $(".endDate-" + user.UserID).datepicker({
          format: "yyyy-mm-dd",
          weekStart: 1,
          calendarWeeks: true,
          autoclose: true,
          language: this.language,
          currentWeek: false,
          todayHighlight: true,
          currentWeekTransl: this.week,
          currentWeekSplitChar: "-",
          startDate:
            userStartDate > this.pStartDate ? userStartDate : this.pStartDate,
          endDate:
            userEndDate !== null && new Date(userEndDate) < this.pEndDate
              ? new Date(userEndDate)
              : this.pEndDate,
        });

        date.on("changeDate", (ev) => {

          this.EndDate = ev.target.value;
          if (
            Date.parse(this.EndDate.split(" ")[0]) <
            Date.parse(this.StartDate.split(" ")[0])
          ) {
            let className = ".input-group-end-date-" + this.userIndex;
            $(className).addClass("warring");
            setTimeout(() => {
              this.toastr.info(
                this.translate.instant("End date cannot be before start date."),
                this.translate.instant("Info")
              );
              ev.target.value = this.oldEndDate;
            }, 0);
          } else {
            this.oldEndDate = this.EndDate;
            this.users[this.userIndex].EndDate = this.EndDate;

            if(currentDate <= this.EndDate){
              this.users[this.userIndex].isActive = 1;
              // this.users = this.users.sort((a, b) => (a.isActive < b.isActive ? 1 : -1));
            }else{
              this.users[this.userIndex].isActive = 0;
              // this.users = this.users.sort((a, b) => (a.isActive < b.isActive ? 1 : -1));
            }
            this.sortUsersbyDateAndActive();

            let className = ".input-group-end-date-" + this.userIndex;
            $(className).removeClass("warring");
            let object = {
              type: "EndDate",
              value: ev.target.value.split(" ")[0],
              ProjectUserScheduleDateId: this.activeUserID,
            };
            this.updateDate(object);
          }
        });

      }
    }
  }

  onCheckAllow($event, user, index) {
    let allow = $event.target.checked;
    this.usersService
      .allowUserOnProject(allow, user.id, this.project.id)
      .subscribe((response) => {
        if (allow == "1") {
          this.user = this.users[index].Allow = "1";
          this.users[index].VisualPoint = "1";
          this.users[index].StartDate.split(" ")[0];
        } else {
          this.user = this.users[index].Allow = "2";
          this.users[index].VisualPoint = "2";
        }
        this.sortUsers();
      });
    return this.users;
  }

  setProjectUserScheduleDate(user, index) {
    this.StartDate = user.StartDate;
    this.EndDate = user.EndDate;
    this.oldStartDate = user.StartDate;
    this.oldEndDate = user.EndDate;
    this.activeUserID = user.ProjectUserScheduleDateId;
    this.userIndex = index;
  }

  toggleUserFunction(
    subname,
    status,
    userId,
    startDate,
    endDate,
    ProjectUserScheduleDateId,
    user_type,
    index = null
  ) {
    if(status == false){
      status = 0;
    }else{
      status = 1;
    }

    if(index != null) {
        this.users[index][subname] = !this.users[index][subname]
    }


    this.usersService.patchPermitUserEditOptions({
      name: "project",
      type: "show",
      subname,
      id: userId,
      status,
      projectId: this.projectId,
      startDate,
      endDate,
      projectUserScheduleDateId: ProjectUserScheduleDateId,
      user_type: user_type,
    });
  }

  onChangeStartDate(date) {
    var user_id = this.user_id;
    this.usersService
      .addUserOnProjecStartDate(date, user_id, this.project.id)
      .subscribe(() => {});
  }

  onChangeStopDate(date) {
    var user_id = this.user_id;
    this.usersService
      .addUserOnProjecStopDate(date, user_id, this.project.id)
      .subscribe(() => {});
  }

  setUserId(user) {
    this.user = user;
    this.user_id = user.id;
    this.projectUserId = user.ProjectUserID;

    $(".dateSelectStartDateFromPermit")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        currentWeek: false,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        weekStart: 1
      })
      .on("changeDate", (e) => {
        if (
          e.target.value.length > 0 &&
          this.user_id &&
          e.target.value != this.StartDate
        ) {
          this.StartDate = e.target.value;
          user.StartDate = e.target.value ;
          this.onChangeStartDate(e.target.value);
        }
      });

    $(".dateSelectStopDateFromPermit")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        currentWeek: false,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        weekStart: 1
      })
      .on("changeDate", (e) => {
        if (
          e.target.value.length > 0 &&
          this.user_id &&
          e.target.value != this.EndDate
        ) {
          this.EndDate = e.target.value;
          user.EndDate = e.target.value ;
          this.onChangeStopDate(e.target.value);
        }
      });
  }

  checkDateValue(StartDate, StopDate) {
    if (StopDate !== null && StartDate !== null) return false;
    else return true;
  }

  removeProperty(user, index) {
    this.usersService
      .removeUserFromProject(user.id, this.project.id)
      .subscribe(() => {
        this.users[index].Allow = "3";
        this.users[index].VisualPoint = "2";
        this.sortUsers();
      });
  }

  onChangeTypePayment(payment) {
    this.projectsService.updatePaymentTypeToProject(payment, this.project);
  }

  onChangeUserPermission(arg) {
    let project = this.project;

    if (project.UserPermission != arg) {
      this.projectsService
        .updateUserPermissionToProject(arg, project)
        .then((response) => {
          if (this.project.UserPermission == "0")
            this.project.UserPermission = "1";
          else this.project.UserPermission = "0";

          if (response["status"] == true && arg == "1") {
            for (var i = this.users.length - 1; i >= 0; i--) {
              this.users[i];
              this.users[i].Allow = "1";
            }
          } else {
            for (var i = this.users.length - 1; i >= 0; i--) {
              this.users[i];
              this.users[i].Allow = "2";
            }
          }
        });
    }
  }

  sortUsers() {
    this.users.filter((o, i) => {

      let obj = this.users[i];
      if (obj) {
        this.users = _.sortBy(this.users, function (user) {
          if (user) {
            let allow = user["Allow"];
            let surname = user["Lastname"];
            let startDate = user["StopDate"];
            let endDate = user["EndDate"];
            return [allow, surname, startDate, endDate].join("_");
          }
        });
      }
    });
  }

  filterUsers(searchQuery) {
    this.countFilterData = [];
    this.existenceInactiveUsers = [];
    this.users.forEach((item) => {
      ["Surname", "Lastname", "StartDate", "EndDate"].some((property) =>
        item[property].toLowerCase().includes(searchQuery.toLowerCase())
      )
        ? (item.hidden = false)
        : (item.hidden = true);

        if(item.hidden == false) {
          this.countFilterData.push(item)
          const len = this.countFilterData.length
          this.allUserLenght(this.responsiblePersons, len)
        }
        if(item.hidden == true && item.isActive == 0){
          this.existenceInactiveUsers.push(item)
          const len = this.countFilterData.length
          this.allUserLenght(this.responsiblePersons, len)
        }
        this.inactiveEmpty(this.countFilterData);
    });
  }

  inactiveEmpty(countFilter){
    this.checkInactive = [];
    let num1 = countFilter;
       if(num1.length == 0)
       {
       this.allHidden = true;
       }else{
        num1.forEach(element => {
          if(element.isActive == 0){
            this.checkInactive.push(element);
          }
        });
          this.allHidden = false;
       }
       if(this.checkInactive.length == 0)
       {
        this.allHidden = true;
       }
  }

  updateDate(object) {
    this.projectsService.updateDateForPermit(object).then((res) => {
      if (res["status"])
        this.toastr.success(
          this.translate.instant("You have successfully updated date."),
          this.translate.instant("Success")
        );
    });
  }

  activityExpired(user) {
    return user.EndDate.split(" ")[0] < moment().format("YYYY-MM-DD");
  }

  getResponsiblePersons() {
    this.projectsService
      .getProjectInformationActiveCompanyWorkers(this.project.id)
      .then((response) => {
        this.responsiblePersons = response;
        this.allUserLenght(this.responsiblePersons, this.users.length);
      });
  }

  filterWhoCanClickDell(){
    this.ResponsablePersonWhoHavePermision =  this.responsiblePersons.filter(el =>
    el.Id === this.userDetails.user_id
    )
  }

  removeUser(type, user, i) {

  this.filterWhoCanClickDell()

  if(this.ResponsablePersonWhoHavePermision.length > 0 || this.userDetails.create_project_Permit){

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
          let object = {};

          if (type == "ResponsiblePerons") {
            object = {
              user_id: user["Id"],
              project_id: this.project.id,
              type: type,
            };
          } else {
            object = {
              user_id: user["UserID"],
              project_id: this.project.id,
              type: type,
            };
          }

          this.usersService.removeUserFromProjectByType(object).subscribe((res) => {
            if (res["status"]) {
              if (type == "ResponsiblePerons")
                this.responsiblePersons.splice(i, 1);
              else this.users.splice(i, 1);
              this.allUserLenght(this.responsiblePersons, this.users.length);
              this.toastr.success(
                this.translate.instant("TSC_SUCCESSFULLY_DELETED_USER"),
                this.translate.instant("Success")
              );
            }
          });
        }
      });
    }
  }

  removeResponsableUser(type, user, i) {

    this.filterWhoCanClickDell()

    if(this.ResponsablePersonWhoHavePermision.length > 0 && this.responsiblePersons.length > 1 && (this.ResponsablePersonWhoHavePermision[0].Id != user.Id)  || this.userDetails.create_project_Permit){
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
             let object = {};

             if (type == "ResponsiblePerons") {
               object = {
                 user_id: user["Id"],
                 project_id: this.project.id,
                 type: type,
               };
             } else {
               object = {
                 user_id: user["UserID"],
                 project_id: this.project.id,
                 type: type,
               };
             }

             this.usersService.removeUserFromProjectByType(object).subscribe((res) => {


               if (res["status"]) {
                 if (type == "ResponsiblePerons")
                   this.responsiblePersons.splice(i, 1);
                 else this.users.splice(i, 1);
                 this.allUserLenght(this.responsiblePersons, this.users.length);
                 this.toastr.success(
                   this.translate.instant("TSC_SUCCESSFULLY_DELETED_USER"),
                   this.translate.instant("Success")
                 );
               }
             });
           }

         });

       }
     }
  isInactive(user) {
    if (this.firstInactive != null) {
      if (user["UserID"] == this.firstInactive["UserID"]) return true;
    }
    return false;

  }
  isActiveFun(user) {
    if (this.lastActive != null) {
      if (user["UserID"] == this.lastActive["UserID"]) return true;
    }
    return false;
  }


  lenghtMax(num: number) {
    let i = 0;
    i = this.responsiblePersons.length;
    this.users.forEach((element) => {
      if (element.isActive == 1 && element.hidden == false) i++;
    });
    this.lenMax = i * 64 + num;
    return this.lenMax;
  }

  allUserLenght(person, len){
    let i= 0;
    let num = 38;
    i = person.length;
    i += len;
    this.lenMaxForAll = i * 63 + num;
    return this.lenMaxForAll;
  }

  enter() {
    this.currentClass = "title-new-project-hover";
  }

  leave() {
    this.currentClass = "title-new-project";
  }

  onImaginaryScroll(e: any) {
    this.tableWraperImag.nativeElement.scroll({left: e.target.scrollLeft});
  }

  onImaginaryScroll2(e: any) {
    this.tableWraperImag2.nativeElement.scroll({left: e.target.scrollLeft});
  }

  onCalendarEnter(index, type){
    if(type == "startD"){
      this.indexP = index;
      this.bgcol = '#FFEBDB';
    }else{
      this.indexP = index;
      this.bgcol1 = '#FFEBDB';
    }
  }

  onCalendarLeave(index, type){
      if(type == "startD"){
        this.bgcol = 'transparent'
        this.indexP = index;
      }else{
        this.indexP = index;
        this.bgcol1 = 'transparent';
      }
  }

  openModal() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    // diaolgConfig.width = "100%";
    diaolgConfig.data = {
    data: { projectUsers: this.projectUsers, project:this.project },
    };
    diaolgConfig.panelClass = "add-user-to-project";
    this.dialog.open(AddUserToProjectComponent, diaolgConfig)
        .afterClosed()
        .subscribe((response) => {
        if (response) {
        }
    });
  }

  openEducationDialog(user, type){
    user.type = type;

    this.dialog.open(PermitEducationDialogComponent,{
      position:{top:'30px', left:'150px'},
      disableClose: true,
      data: {'user': user, 'project_id': this.projectId},
      panelClass: "permit-education",
      autoFocus: false,
      restoreFocus: false
    })
  }

    clearSearchText(event) {
        event.preventDefault();
        (document.getElementById('searchInput') as HTMLInputElement).value = '';
    }

    get existString() {
        if (((document.getElementById('searchInput') as HTMLInputElement).value).length > 0)
            return true;
        else
            return false;
    }
}
