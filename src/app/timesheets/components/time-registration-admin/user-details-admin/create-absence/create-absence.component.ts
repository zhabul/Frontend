import { Component, OnInit, Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-create-absence",
  templateUrl: "./create-absence.component.html",
  styleUrls: ["./create-absence.component.css"],
})
export class CreateAbsenceComponent implements OnInit {
  public dateSelectEndDate = "";
  public dateSelectStartDate = "";
  public userId;
  public day;
  public detail;
  public absenceTypes: any = [];
  public absences: any[] = [];
  public selectedAbsenceID;
  public absenceName = "";

  constructor(
    private toastr: ToastrService,
    public translate: TranslateService,
    private timeRegistrationService: TimeRegistrationService,
    private timeRegService: TimeRegistrationService,
    public dialogRef: MatDialogRef<CreateAbsenceComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any
  ) {}

  ngOnInit() {
    this.userId = this.modal_data.userId;
    this.day = this.modal_data.day;
    this.detail = this.modal_data.detail;
    this.dateSelectStartDate = this.day.date;
    this.dateSelectEndDate = this.day.date;
    this.getAbsenceType(this.timeRegService);
    this.getAbsences();
  }

  createAbsence() {
    if (!this.dateSelectEndDate || !this.dateSelectStartDate) {
      this.toastr.info(
        this.translate.instant(
          "Please select the start date and the end date"
        ) + ".",
        this.translate.instant("Info")
      );
      return;
    }

    let endDate: any = new Date(this.dateSelectEndDate);
    let startDate: any = new Date(this.dateSelectStartDate);

    let daysOfAbsence =
      Math.floor(endDate.valueOf() - startDate.valueOf()) / 86400000;

    if (
      endDate.getDay() == 6 ||
      endDate.getDay() == 0 ||
      startDate.getDay() == 6 ||
      startDate.getDay() == 0
    ) {
      this.toastr.info(
        this.translate.instant("End date or start date cannot be on weekend") +
          ".",
        this.translate.instant("Info")
      );
      return;
    }

    endDate = moment(new Date(this.dateSelectEndDate)).format("YYYY-MM-DD");
    startDate = moment(new Date(this.dateSelectStartDate)).format("YYYY-MM-DD");
    this.dateSelectStartDate = startDate;
    this.dateSelectEndDate = endDate;

    if (startDate > endDate) {
      this.toastr.info(
        this.translate.instant("End date cannot be before start date."),
        this.translate.instant("Info")
      );
      return;
    }

    const object = {
      user_id: this.userId,
      comment: "Created absence",
      days: daysOfAbsence,
      width: 160,
      AbsenceType: this.selectedAbsenceID,
      Description: "Created absence",
      StartDate: startDate,
      EndDate: endDate,
      MinutesAbsence: "",
      HoursAbsence: "",
      StartDateChngRqst: "",
      EndDateChngRqst: "",
    };

    let absenceInterferes = false;
    this.absences.forEach((absence) => {
      absence.dates.pop();
      absence.dates.forEach((date) => {
        if (date == endDate || date == startDate) {
          absenceInterferes = true;
          return;
        }
      });
    });

    if (absenceInterferes) {
      return this.toastr.error(
        this.translate.instant(
          "This absence interferes with existing absence!"
        ),
        this.translate.instant("Info")
      );
    } else {
      this.timeRegService.setAbsenceForUser(object).subscribe((response) => {
        if (response && response["status"]) {
          if (response["status"] == true) {
            this.toastr.success(
              this.translate.instant("You have successfully added Absence!"),
              this.translate.instant("Success")
            );
            response["startDate"] = this.dateSelectStartDate;
            response["endDate"] = this.dateSelectEndDate;
            response["dates"] = this.getDatesBetweenDates(
              this.dateSelectStartDate,
              this.dateSelectEndDate
            );
            response["typeID"] = this.selectedAbsenceID;
            response["absenceName"] = this.absenceName;
            this.dialogRef.close(response);
          }
        }
      });
    }
  }

  getAbsenceType(timeRegistrationService) {
    timeRegistrationService
      .getAbsenceTypes()
      .then((response) => {
        this.absenceTypes = response["data"];
        this.absenceTypes.forEach((type) => {
          if (type.Name == this.detail.key) {
            this.selectedAbsenceID = type.AbsenceTypeID;
            this.absenceName = type.Name;
          }
        });
      })
      .catch((err) => {
        return { status: false };
      });
  }

  getAbsences() {
    this.timeRegistrationService.getTimesheetsAbsences().subscribe((response) => {
      if (response["data"]) {
        this.absences = response["data"].filter((x) => x.invisible != 1);
      }
    });
  }

  getDatesBetweenDates = (startDate, endDate) => {
    let dates = [];
    const theDate = new Date(startDate);
    while (theDate <= new Date(endDate)) {
      dates = [...dates, moment(new Date(theDate)).format("YYYY-MM-DD")];
      theDate.setDate(theDate.getDate() + 1);
    }
    return dates;
  };
}
