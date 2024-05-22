import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MomentsService } from "src/app/core/services/moments.service";

@Component({
  selector: "app-pdf-generator",
  templateUrl: "./pdf-generator.component.html",
  styleUrls: ["./pdf-generator.component.css"],
})
export class PdfGeneratorComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private momentService: MomentsService
  ) {}

  public users: any[] = [];
  public userId: any;
  public startDate: any;
  public endDate: any;
  public checked: boolean = true;
  public logo: string;
  public spinner = false;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

  ngOnInit() {

    this.users = (this.route.snapshot.data["users"]["users"] && this.route.snapshot.data["users"]["users"]['users']) || []; 
    this.route.params.subscribe((params) => {
      this.userId = params.id;
      this.startDate = params.startDate;
      this.endDate = params.endDate;
    });
  }

  allCheckChange(e) {
    this.users = this.users.map((x) => {
      x["checked"] = e.target.checked;
      return x;
    });
    if (e.target.checked) this.checked = true;
    else this.checked = false;
  }

  generatePdf() {
    this.spinner = true;
    this.momentService
      .generatePdf(this.startDate, this.endDate, this.users)
      .subscribe((response) => {
        if (response["status"]) {
          this.goToLink(response["url"]);
          this.spinner = false;
        }
      });
  }

  goToLink(url: string) {
    window.location.href = url;
  }

  goToPreviousPage() {
    if (this.userId)
      this.router.navigate([
        "/timesheets/time-registration-admin/user-detail/",
        this.userId,
        this.startDate,
      ], { queryParamsHandling: "preserve" }); 
    else
      this.router.navigate(["/moments/time-registration-admin"], {
        queryParamsHandling: "preserve"
      });
  }
}
