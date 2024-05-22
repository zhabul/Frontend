import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { InitProvider } from "src/app/initProvider";

@Component({
  selector: "app-project-purchases-root",
  templateUrl: "./project-purchases-root.component.html",
  styleUrls: ["./project-purchases-root.component.css"],
})
export class ProjectPurchasesRootComponent implements OnInit {
  public project: any;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public orderAccess = false;

  constructor(
    private route: ActivatedRoute,
    public initProvider: InitProvider,
    private router: Router,
  ) {}

  ngOnInit() {
    this.project = this.route.snapshot.data["project"];
    this.orderAccess = this.userDetails.show_project_Purchases && this.initProvider.hasComponentAccess('orders');
    this.redirectIfHasNoAccess();
  }

  redirectIfHasNoAccess() {
    if (!this.orderAccess) {
      this.router.navigate(["/"]);
    }
  }
}
