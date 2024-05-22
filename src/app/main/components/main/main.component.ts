import { Component,OnInit,} from "@angular/core";
import { InitProvider } from "src/app/initProvider";
import { AppService } from "src/app/core/services/app.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/core/services/auth.service";
import { NotSeenMessagesService } from "../../../not-seen-messages.service";

declare var $: any;
@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent implements OnInit {
    public userDetails;
    public previousRoute: string;
    public userScalableToggle;
    public loadData = false;
    public isSelectedCompany = false;
    public selectId;

    constructor(
        public initProvider: InitProvider,
        private router: Router,
        private appService: AppService,
        private toastr: ToastrService,
        private translate: TranslateService,
        private authService: AuthService,
        private notSeenMessagesService: NotSeenMessagesService
    ) {}

    ngOnInit() {
        this.userScalableToggle = document.querySelector("meta[name='viewport']");
        this.userScalableToggle.content = "width=device-width, initial-scale=1.0, user-scalable=no";
        this.previousRoute = "/home";
        this.appService.setBackRoute(this.previousRoute);
        this.appService.setShowAddButton = false;
        this.notSeenMessagesService.getNotSeenMessages();
        if (sessionStorage.getItem("userDetails") === null) {
            window.location.reload();
        } else {
            this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
            this.loadData = true;
        }
        this.getUserCompanies();
    }

  initializeHtml() {
    if(this.userDetails.selected_company) {
      this.isSelectedCompany = true;
    }

    if (this.isSelectedCompany === true) {
      document.getElementById("sidebar-wrapper").style.display = "block";
    }else {
      document.getElementById("sidebar-wrapper").style.display = "none";
    }
    const hightComapnyBox = document.getElementById("companyList");
    if(hightComapnyBox) {
      const contentHeight = hightComapnyBox.scrollHeight;
      if (contentHeight <= 500) {
        document.getElementById("verline").style.display = "none";
      } else {
        var heightToStringData = contentHeight.toString();
        document.getElementById("verline").style.height = heightToStringData + "px";
      }
    }

    this.selectId = this.userDetails.company_id;
  }

  routeToProjects() {
    if (this.authService.projectsRoute) {
      this.router.navigate([this.authService.projectsRoute]);
    } else {
      this.toastr.info(
        this.translate.instant(
          "You are not assigned to any project at the moment."
        ),
        this.translate.instant("Info")
      );
    }
  }

  logout() {
    this.authService.logoutUser().then((res) => {
      sessionStorage.removeItem("userDetails");
      this.initProvider.setLoggedIn = false;
      if (localStorage.getItem("isApp") != undefined) {
        window.location.href = "http://app.action.logout/";
      } else {
        this.router.navigate(["/login"]);
      }
    });
  }

  public CompanyNames: any = [];

  public getUserCompanies() {

    this.authService.getUserCompanies().then((result) => {

      if(result['status']) {
        this.CompanyNames = result['data'];
        if(this.CompanyNames.length == 1) {
          this.selectId = this.CompanyNames[0].id;
          this.isSelectedCompany = true;
        }
        this.initializeHtml();
      }
    });
  }
}