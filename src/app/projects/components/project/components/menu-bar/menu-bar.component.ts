import { Component, OnInit, Input } from "@angular/core";
import { ClientsService } from "src/app/core/services/clients.service";
import { Router } from "@angular/router";
import { RemembererService } from "src/app/core/services/rememberer.service";

@Component({
  selector: "menu-bar",
  templateUrl: "./menu-bar.component.html",
  styleUrls: ["./menu-bar.component.css"],
})
export class MenuBarComponent implements OnInit {
  public customVar: boolean = false;
  public userDetails: any;
  @Input() project_id: any;
  @Input() project: any;
  public currentTab: any;

  constructor(
    private clientsService: ClientsService,
    private remembererService: RemembererService,
    private router: Router
  ) {}

  ngOnInit() {
  
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.currentTab = this.remembererService.getState(
      this.router.url,
      "projectTab",
      0
    );
    
  }

  openComponentDetail(e) {
    e.preventDefault();
    this.clientsService.setComponentVisibility(1);
  }
}
