import { Component, OnInit } from "@angular/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ActivatedRoute } from "@angular/router";
declare var $;

@Component({
  selector: "app-weekly-reports",
  templateUrl: "./weekly-reports.component.html",
  styleUrls: ["./weekly-reports.component.css"],
})
export class WeeklyReportsComponent implements OnInit {
  public reports: any[];
  public project;
  public showWeekyReports = true;
  public showDetails = false;
  public projectWeeklyReports: any[] = [];
  public sumAllTotallyWorkedUp: number = 0;
  public sumAllWorkedButNotApproved: number = 0;
  public sumAllApprovedForInvoice: number = 0;
  public sumAllInvoicedTotal: number = 0;
  public sumAllSentWr: number = 0;
  public userDetails;

  constructor(
    private projectService: ProjectsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    this.project = this.route.snapshot.data["project"];
    this.projectService
      .getAcceptedWeeklyReports(this.route.snapshot.params.id)
      .then((reports) => {
        this.reports = reports;
      });

    this.getAllProjectWeeklyReports();
  }

  setContent(arg) {
    if (arg == "details") {
      this.showDetails = true;
      this.showWeekyReports = false;
      $(".btn-approved").addClass("active");
      $(".btn-all").removeClass("active");
    } else {
      this.showDetails = false;
      this.showWeekyReports = true;
      $(".btn-all").addClass("active");
      $(".btn-approved").removeClass("active");
    }
  }

  getAllProjectWeeklyReports() {
    this.projectService
      .getAllProjectWeekyReports(this.project.id)
      .then((res) => {
        if (res["status"]) {
          const weeks = Object.keys(res["data"]);
          this.projectWeeklyReports = weeks.map((week) => {
            const report = res["data"][week];
            this.sumAllTotallyWorkedUp += parseFloat(report["totallyWorkedUp"]);
            this.sumAllWorkedButNotApproved += parseFloat(
              report["workedButNotApproved"]
            );
            this.sumAllSentWr += parseFloat(report["total_sent"]);
            this.sumAllApprovedForInvoice += parseFloat(
              report["approvedForInvoice"]
            );
            this.sumAllInvoicedTotal += parseFloat(report["invoicedTotal"]);
            return report;
          });
          this.projectWeeklyReports = Object.values(this.projectWeeklyReports);
        }
      });
  }

  calculateWeeklyReport() {
    if (this.projectWeeklyReports && this.projectWeeklyReports.length > 0) {
      this.sumAllTotallyWorkedUp = this.projectWeeklyReports.reduce(
        (prev, week) => {
          return prev + parseFloat(week["totallyWorkedUp"]);
        },
        0
      );
      this.sumAllWorkedButNotApproved = this.projectWeeklyReports.reduce(
        (prev, week) => {
          return prev + parseFloat(week["workedButNotApproved"]);
        },
        0
      );
      this.sumAllApprovedForInvoice = this.projectWeeklyReports.reduce(
        (prev, week) => {
          return prev + parseFloat(week["approvedForInvoice"]);
        },
        0
      );
      this.sumAllInvoicedTotal = this.projectWeeklyReports.reduce(
        (prev, week) => {
          return prev + parseFloat(week["invoicedTotal"]);
        },
        0
      );
    }
  }
}
