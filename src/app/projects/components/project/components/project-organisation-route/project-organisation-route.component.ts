import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ClientsService } from "src/app/core/services/clients.service";

@Component({
  selector: "app-project-organisation-route",
  templateUrl: "./project-organisation-route.component.html",
  styleUrls: ["./project-organisation-route.component.css"],
})
export class ProjectOrganisationRouteComponent implements OnInit {
  public projects: any;
  public project: any;
  public projectId: number;
  public showClientComponent = false;
  public client: any;
  public componentVisibility: number = 0;
  public showNotification: boolean;
  public roles: any[] = [];
  public supplierWorkers: any[];
  public client_workers: any[] = [];
  public registers: any[] = [];
  clientCategories: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService
  ) {}

  ngOnInit() {
    this.clientCategories =
      this.route.snapshot.data["clientCategories"]["data"] || [];
    this.registers = this.route.snapshot.data.registers;
    this.roles = this.route.snapshot.data["roles"];

    this.client_workers = this.route.snapshot.data["client_workers"];

    this.route.params.subscribe((params) => {
      this.projectId = params.id;
    });
    this.projects = this.route.snapshot.data["projects"];
    this.project = this.route.snapshot.data["project"];

    this.clientsService.client.subscribe((response) => {
      if (response) {
        this.showClientComponent = true;
        this.client = response;
      }
    });

    this.clientsService.showNewClientForm.subscribe((val) => {
      this.componentVisibility = val;
    });
  }
  goBack() {
    this.router.navigate(["projects/view", this.projectId]);
  }

  saveForm() {
    //console.log("Save");
  }

  public onCloseClick() {
    if (this.componentVisibility == 1) {
      this.clientsService.setComponentVisibility(0);
    } else if (this.componentVisibility == 4) {
      this.clientsService.setComponentVisibility(0);
    } else if (this.componentVisibility == 5) {
      this.clientsService.setComponentVisibility(0);
    } else if (this.componentVisibility == 6) {
      this.clientsService.setComponentVisibility(0);
    } else if (this.componentVisibility == 7) {
      this.clientsService.setComponentVisibility(0);
    } else if (this.componentVisibility > 1) {
      this.clientsService.setComponentVisibility(1);
    }
  }
}
