import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "additional-work-pdf",
  templateUrl: "./additional-work-pdf.component.html",
  styleUrls: ["./additional-work-pdf.component.css"],
})
export class AdditionalWorkPdfComponent implements OnInit {
  @Input("moments") set setMoments(value) {
    if (value !== this.moments) {
      this.moments = value;
      this.generateUsers();
    }
  }
  @Input() formValues;
  @Input("currentWeeklyReport") set setCurrentWeeklyReport(value) {
    if (value !== this.currentWeeklyReport) {
      this.currentWeeklyReport = value;
    }
  }
  @Input() project;
  @Input() typeKSorDU;
  @Input() generalImage;
  @Input() reminderCheckboxDU;
  @Input() get_last_email_log_but_first_client_wr;
  @Output() emitNewAtaChanged = new EventEmitter<any>();

  public generals = [];
  public AtaTypes = [];
  public users = [];
  public moments = [];
  public totalHours = 0;
  public totalAcceptedHours;
  public currentWeeklyReport;
  public current_user: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public current_user_full_name;
  public zoomButton: any = 0;

  zoom = {
    scale: 1,
    panning: false,
    pointX: 0,
    pointY: 0,
    start: { x: 0, y: 0 },
  };


  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.AtaTypes = this.route.snapshot.data["type_atas"];
    this.generals = this.route.snapshot.data["generals"] || [];
    this.formatWRNumber();
    this.generateUsers();
    this.current_user_full_name =
      this.current_user.firstname + " " + this.current_user.lastname;
  }


  generateUsers() {
    this.users = [];
    this.moments.forEach((moment) => {
      moment.users.forEach((user) => {
        this.users.push(user);
      });
    });
  }

  getAcceptedTotal() {

    if (this.moments.length > 0) {
      this.totalHours = this.moments[0].totalAcceptedHoursPerProjects;
    } else {
      this.totalHours = 0;
    }

    return this.totalHours;
  }

  getDeclinedTotal() {
    if (this.moments.length > 0) {
      this.totalHours = this.moments[0].totalDeclinedHoursPerProjects;
    } else {
      this.totalHours = 0;
    }

    return this.totalHours;
  }

  getAtaType(id) {
    const type = this.AtaTypes.find((type) => type.id == id);
    if (type) {
      return type.Name;
    }
  }

  formatWRNumber() {
    if (this.currentWeeklyReport && this.currentWeeklyReport.name) {
      this.currentWeeklyReport.formatWRNumber = this.currentWeeklyReport.name;
    } else {
      this.currentWeeklyReport.formatWRNumber = "";
    }
  }

  formatMomentType(momentType) {
    if (momentType == 2) {
      return "Skilled Worker";
    } else {
      return "Worker";
    }
  }

  commentEligibility(moment) {
    let comment;
    if (moment["commentActive"] == 1 || moment["moment_type"] == "Manual") {
      comment = moment["comment"];
    }

    return comment;
  }

  getString(moment) {
    if (moment["moment_type"] == "Manual") {
      return moment["moment"];
    }
    return moment["moment"];
  }

  userMoments(moments) {
    let status = true;
    moments.forEach((m) => {
      if (m.ClientStatus != 1) {
        status = false;
        return status;
      }
    });
    return status;
  }

  sumTime(time1, time2) {
    return time1 + time2;
  }

  getTotalTime() {
    let totalHours = "";
    if (this.moments.length > 0) {
      totalHours = this.sumTime(
        this.moments[0].totalAcceptedHoursPerProjects,
        this.moments[0].totalDeclinedHoursPerProjects
      );
    } else {
      totalHours = "00:00";
    }

    return totalHours;
  }

  formatWRNumber2(number) {
    if (number) {
      return number.split("-")[1];
    } else {
      return "";
    }
  }

  checkDisplayText() {
    let displayText = "";

    if (this.reminderCheckboxDU) {
      if (this.currentWeeklyReport.timesReminderSentDU <= 1) {
        displayText = "Påminnelse";
      } else {
        displayText =
          "Påminnelse - " + this.currentWeeklyReport.timesReminderSentDU;
      }
    } else {
      displayText = "- Tidsammanställning " + this.currentWeeklyReport.name;
    }

    return displayText;
  }
  checkDisplayTextDU() {
    return "Tidsammanställning " + this.currentWeeklyReport.name;
  }

  getBackground(user) {
    let index = this.users.findIndex(
      (us) =>
        us.name == user.name && us.UserTimesheetsID == user.UserTimesheetsID
    );
    return index % 2 != 0 ? "bg-table" : "";
  }
  formatItemDate(datum) {
    if (datum) {
      return datum.substring(datum.indexOf(" ") + 1);
    } else {
      return "";
    }
  }
  checkDU(nameDU) {
    return nameDU.includes("DU");
  }

  generatePdf(from) {
    this.emitNewAtaChanged.emit({
      type: "AdditionalWork",
      from: from,
    });
  }

  zoomBy(scale){

    this.zoomButton = this.zoomButton + scale
  }
}
