import { Component, OnInit, Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

declare var $: any;

@Component({
  selector: "app-send-notification-to-user-for-timesheet",
  templateUrl: "./send-notification-to-user-for-timesheet.component.html",
  styleUrls: ["./send-notification-to-user-for-timesheet.component.css"],
})
export class SendNotificationToUserForTimesheetComponent implements OnInit {
  public summary: any[] = [];
  public userName: any;
  public user: any;
  public absences: any;
  public project_id: any;
  public date: any;
  public user_id: any;
  public message: string = "";
  public selectedTab = 0;
  public createForm: FormGroup;
  public endDate: any;
  public dateSelectEndDate = "";
  public dateSelectStartDate = "";
  public users: any;
  public selectedUsers = [];

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(
    private toastr: ToastrService,
    public translate: TranslateService,
    private timeRegistrationService: TimeRegistrationService,
    private timeRegService: TimeRegistrationService,
    public dialogRef: MatDialogRef<SendNotificationToUserForTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any
  ) {}

  ngOnInit() {
    this.user = this.modal_data.user;
    this.user_id = this.modal_data.user.id;
    this.date = this.modal_data.date;
    this.users = this.modal_data.users ? this.modal_data.users : null;

    this.userName = this.user.firstName + " " + this.user.lastName;

    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "firstName",
      selectAllText: this.translate.instant("Select All"),
      unSelectAllText: this.translate.instant("Unselect All"),
      itemsShowLimit: 3,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText:
        this.translate.instant("No data available"),
      searchPlaceholderText: this.translate.instant("Search"),
    };
  }

  onItemSelect(item: any) {}
  onSelectAll(items: any) {}

  sendNotification() {
    let object = {
      message: "Tidrapport " + this.date,
      user_id: this.user_id,
      type: "Tidrapport",
      webLink:
        "/timesheets/time-registration-users-registration?date=" + this.date,
      $mobileLink: "/timesheets/working-hour?date=" + this.date,
      date: this.date,
      messageText: this.message,
    };

    if (this.message) {
      this.timeRegistrationService
        .createNotification(object)
        .then((response) => {
          if (response && response["status"]) {
            if (response["status"] == true) {
              this.dialogRef.close();
            }
          }
        });
    } else {
      this.toastr.error(
        this.translate.instant("Message field required."),
        this.translate.instant("Error")
      );
    }
  }

  sendMessage(UserTimesheetsID, user_id, message) {
    let object = {
      content_type: "Timesheet",
      content_id: UserTimesheetsID,
      user_id: user_id,
      message: message,
      active: 1,
    };

    if (message) {
      this.timeRegistrationService
        .createUserMessage(object)
        .subscribe((response) => {});
    } else {
      this.toastr.error(
        this.translate.instant("Message field required."),
        this.translate.instant("Error")
      );
    }
  }

  changeSelectedTab(index) {
    this.selectedTab = index;
  }

  getDatesBetweenDates = (startDate, endDate) => {
    let dates = [];
    const theDate = new Date(startDate);
    while (theDate <= endDate) {
      dates = [...dates, moment(new Date(theDate)).format("YYYY-MM-DD")];
      theDate.setDate(theDate.getDate() + 1);
    }
    return dates;
  };

  lockForUsers(singleUser) {
    let dateArray;
    let Users;

    if (singleUser) {
      if (this.dateSelectStartDate == "" || this.dateSelectEndDate == "") {
        return this.toastr.error(
          this.translate.instant("Please select the date") + ".",
          this.translate.instant("Info")
        );
      }
      dateArray = this.getDatesBetweenDates(
        this.dateSelectStartDate,
        this.dateSelectEndDate
      );
      Users = [this.modal_data.user.id];
    } else {
      dateArray = [this.date];
      Users = [];
      this.selectedUsers.forEach((user) => {
        Users.push(user.id);
      });
      if (Users.length < 1) {
        return this.toastr.error(
          this.translate.instant("Please select at least one user") + ".",
          this.translate.instant("Info")
        );
      }
    }

    this.timeRegService
      .disapproveRaportingTimeForDay({ Users: Users, Dates: dateArray })
      .subscribe((response) => {
        this.dialogRef.close();
      });
  }
}
