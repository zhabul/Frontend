import { Component, OnInit } from "@angular/core";
import { InitProvider } from "../initProvider";
import { Router } from "@angular/router";

@Component({
  selector: "app-planning",
  templateUrl: "./planning.component.html",
  styleUrls: ["./planning.component.css"],
})
export class PlanningComponent implements OnInit {

  public userDetails: any;
  //public plannerAccess = false;
  //public timeTableAccess = false;

  constructor(
    public initProvider: InitProvider,
    private router: Router
    ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  //  this.plannerAccess = this.userDetails.show_planning_resource_planning && this.initProvider.hasComponentAccess('planning');
  //  this.timeTableAccess = this.userDetails.show_planning_project && this.initProvider.hasComponentAccess('timeTable');
  }

  redirectIfHasNoAccess() {
    if (!this.userDetails.show_planning_resource_planning && !this.userDetails.show_planning_project) {
      this.router.navigate(["/"]);
    }
  }
}