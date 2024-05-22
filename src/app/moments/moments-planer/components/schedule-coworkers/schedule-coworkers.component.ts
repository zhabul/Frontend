import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MomentsService } from "src/app/core/services/moments.service";
import { TranslateService } from "@ngx-translate/core";
import { cloneDeep } from "lodash";

import * as moment from "moment";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

declare var $;

@Component({
  selector: "app-schedule-coworkers",
  templateUrl: "./schedule-coworkers.component.html",
  styleUrls: ["./schedule-coworkers.component.css"],
})
export class ScheduleCoworkersComponent implements OnInit {
  public createForm: FormGroup;
  private startDate: any;
  private endDate: any;
  public project: any;
  public timeframe: any = "week";
  public target: any;
  public projectMomentIndex: any;
  public arbitraryDates: any[] = [];
  public coworkersArray: any[] = [];
  public allowEndDate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ScheduleCoworkersComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private momentsService: MomentsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.project = this.modal_data["project"];
    this.startDate = this.project["StartDate"].split(" ")[0];

    this.projectMomentIndex = this.modal_data["index"];
    this.arbitraryDates = this.modal_data["arbitraryDates"];

    this.createForm = this.fb.group({
      StartDate: [this.startDate, []],
      NumberOfCoworkers: ["", [Validators.required]],
      EndDate: [this.endDate, []],
      Days: ["", []],
      Color: [this.project["Color"], []],
      timeframe: [this.timeframe, []],
      ProjectID: [this.project["id"], []],
      Left: ["", []],
      Top: ["", []],
      Bottom: ["", []],
      Width: ["", []],
      coworkersArray: [this.coworkersArray, []],
    });
  }

  onChangeSetTimeframe(object) {
    if (object == "day") {
      this.timeframe = 1;
      this.endDate = this.startDate;
      this.allowEndDate = false;
    } else if (object == "week") {
      this.timeframe = +this.arbitraryDates[0]["Value"];
      this.countEndDate();
      this.allowEndDate = false;
    } else if (object == "sprint") {
      this.timeframe = +this.arbitraryDates[2]["Value"];
      this.allowEndDate = false;
      this.countEndDate();
    } else if (object == "month") {
      let date = moment();
      this.timeframe = date.daysInMonth();
      this.allowEndDate = false;
      this.countEndDate();
    } else if (object == "year") {
      this.timeframe = 365;
      this.countEndDate();
      this.allowEndDate = false;
    } else if (object == "arbitraryDate") {
      this.timeframe = "arbitraryDate";
    }
  }

  countEndDate() {
    if (this.timeframe != "arbitraryDate") {
      let dayNumber = +this.timeframe - 1;
      var new_date = moment(this.startDate, "YYYY-MM-DD");
      var nextDate = new_date.add(dayNumber, "days").format("YYYY-MM-DD");
    }

    this.endDate = nextDate;
    this.createForm.get("EndDate").patchValue(this.endDate);
  }

  create() {
    if (this.createForm.valid) {
      let numberOfWeeks = this.ensureProjectNumberOfWeeks();
      this.onChangeSetTimeframe(this.timeframe);

      let projectClassName = "table-calendar-day-" + this.startDate;

      const data = this.createForm.value;
      let startDate = this.startDate;
      let className = "table-calendar-day-" + startDate;
      var left;
      var projectLeft;

      if (
        document.getElementsByClassName(className) &&
        document.getElementsByClassName(className)[0] &&
        document.getElementsByClassName(projectClassName) &&
        document.getElementsByClassName(projectClassName)[0]
      ) {
        let element: any = document.getElementsByClassName(className)[0];
        left = element.offsetLeft;

        let projectElement: any =
          document.getElementsByClassName(projectClassName)[0];
        projectLeft = projectElement.offsetLeft;

        left = Math.abs(left - projectLeft);
      }

      var width;
      var days;
      var arrayOfObejcts = [];

      data["Left"] = 0;
      data["StartDate"] = startDate;
      data["EndDate"] = this.endDate;
      data["Top"] = -3;
      data["Bottom"] = -3;

      let dates = [];

      if (data["timeframe"] == "week") {
        data["EndDate"] = this.ensureEndDateOfWeekNumberOfWorkers(dates);

        days = this.numberOfDays(data["StartDate"], data["EndDate"]);
        data["Days"] = days;
        width = days * 20;
        data["Width"] = width;

        let dataObject = cloneDeep(data);
        dataObject["Days"] = 7;
        dataObject["Width"] = dataObject["Days"] * 20;

        arrayOfObejcts = this.ensureArrayOfObjects(
          numberOfWeeks,
          dataObject,
          data
        );
        arrayOfObejcts.unshift(data);

        let objectLangth = arrayOfObejcts.length - 1;
        let object = arrayOfObejcts[objectLangth];

        let lastObject = this.ensureLastObjectInArray(object);

        arrayOfObejcts.push(lastObject);
      } else if (data["timeframe"] == "day") {
        data["Width"] = 20;
        data["EndDate"] = data["StartDate"];
        data["Days"] = 1;

        let dataObject = cloneDeep(data);

        arrayOfObejcts = this.ensureArrayOfObjects(dates, dataObject, data);
        arrayOfObejcts.pop();
        arrayOfObejcts.unshift(data);
      }

      this.momentsService
        .createProjectPlanCoworker(arrayOfObejcts)
        .subscribe((response) => {
          if (response["status"]) {
            this.toastr.info(
              this.translate.instant(
                "You have successfully added number of coworkers."
              ),
              this.translate.instant("Info")
            );
            this.dialogRef.close(true);
          }
        });
    }
  }

  ensureProjectNumberOfWeeks() {
    let array = [];
    let unique = Array.from(new Set(array));
    return unique;
  }

  ensureLastObjectInArray(object) {
    let object2 = cloneDeep(object);

    object2["EndDate"] = this.project["EndDate"].split(" ")[0];
    object2["StartDate"] = this.ensureStartDate(object["EndDate"]);
    object2["Days"] = this.numberOfDays(
      object2["StartDate"],
      object2["EndDate"]
    );
    object2["Width"] = object2["Days"] * 20;
    object2["Left"] = object["Left"] + object["Width"];

    return object2;
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  ensureWidthOfWeekNumberOfWorkers(dates) {
    let lengthOfArray = dates.findIndex((date) => date[1] == "Sun");
    let width = 20 * lengthOfArray;
    return width;
  }

  ensureEndDateOfWeekNumberOfWorkers(dates) {
    let object = dates.filter((date) => date[1] == "Sun");
    let endDate = object[0][0];
    return endDate;
  }

  numberOfDays(firstDate, secondDate) {
    var startDay = new Date(firstDate);
    var endDay = new Date(secondDate);
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = startDay.getTime() - endDay.getTime();
    var days = Math.abs(millisBetween / millisecondsPerDay) + 1;
    return days;
  }

  ensureArrayOfObjects(numberOfWeeks, data, firstObject) {
    let arrayOfObject = [];

    let object = {
      StartDate: data["StartDate"],
      EndDate: data["EndDate"],
      NumberOfCoworkers: data["NumberOfCoworkers"],
      Days: data["Days"],
      Color: data["Color"],
      timeframe: data["timeframe"],
      Left: data["Left"],
      Top: data["Top"],
      Bottom: data["Bottom"],
      Width: data["Width"],
      coworkersArray: data["coworkersArray"],
      ProjectID: data["ProjectID"],
    };

    var object2 = cloneDeep(object);
    numberOfWeeks.forEach((number, index) => {
      object2 = cloneDeep(object2);

      let days = +object2.Days;
      let objectLeft = +object2.Left;

      object2.StartDate = this.ensureStartDate(object2.EndDate);
      object2.EndDate = this.ensureEndDate(object2.StartDate, days);
      if (index == 0)
        object2.Left = this.ensureNewLeft(objectLeft, +firstObject["Days"]);
      else object2.Left = this.ensureNewLeft(objectLeft, days);

      arrayOfObject.push(object2);
    });
    return arrayOfObject;
  }

  ensureEndDate(startDate, days) {
    let dayNumber = days - 1;
    var new_date = moment(startDate, "YYYY-MM-DD");
    return new_date.add(dayNumber, "days").format("YYYY-MM-DD");
  }

  ensureStartDate(endDate) {
    var new_date = moment(endDate, "YYYY-MM-DD");
    return new_date.add(1, "days").format("YYYY-MM-DD");
  }

  ensureNewLeft(left, days) {
    let newLeft = left + 20 * days;
    return newLeft;
  }

  AddToArray() {
    this.onChangeSetTimeframe(this.timeframe);

    if (this.createForm.get("NumberOfCoworkers").value != "") {
      this.onChangeSetTimeframe(this.timeframe);

      let projectStartDate = this.project["StartDate"].split(" ")[0];
      let projectClassName = "table-calendar-day-" + projectStartDate;

      const data = this.createForm.value;
      let startDate = data["StartDate"].split(" ")[0];
      let className = "table-calendar-day-" + startDate;
      var left;
      var projectLeft;

      if (
        document.getElementsByClassName(className) &&
        document.getElementsByClassName(className)[0] &&
        document.getElementsByClassName(projectClassName) &&
        document.getElementsByClassName(projectClassName)[0]
      ) {
        let element: any = document.getElementsByClassName(className)[0];
        left = element.offsetLeft;

        let projectElement: any =
          document.getElementsByClassName(projectClassName)[0];
        projectLeft = projectElement.offsetLeft;

        left = Math.abs(left - projectLeft);
      }

      var width;
      var days;

      if (this.allowEndDate) {
        this.endDate = this.endDate.split(" ")[0];
        days = this.numberOfDays(startDate, this.endDate);
        width = days * 20;
      } else {
        days = +this.timeframe;
        width = days * 20;
      }

      data["Width"] = width;
      data["Left"] = left;
      data["Days"] = days;
      data["StartDate"] = startDate;
      data["EndDate"] = this.endDate;
      data["Top"] = -3;
      data["Bottom"] = -3;

      let object = {
        Bottom: data["Bottom"],
        Color: data["Color"],
        Days: data["Days"],
        EndDate: data["EndDate"],
        Left: data["Left"],
        NumberOfCoworkers: data["NumberOfCoworkers"],
        ProjectID: data["ProjectID"],
        StartDate: data["StartDate"],
        Top: data["Top"],
        Width: data["Width"],
        timeframe: data["timeframe"],
      };
      this.coworkersArray.push(object);
    }
  }

  removeFromArray(index) {
    this.coworkersArray.splice(index, 1);
  }
}
