import {
  Component,
  OnInit,
  Input,
  HostListener,
  SimpleChanges,
  SimpleChange,
} from "@angular/core";

@Component({
  selector: "app-main-login",
  templateUrl: "./main-login.component.html",
  styleUrls: ["./main-login.component.css"],
})
export class MainLoginComponent implements OnInit {
  @Input() isSelectedCompany;
  @Input() CompanyNames;
  @Input() userDetails;
  @Input() loadData;
  @Input() initProvider;
  @Input() authService;
  public selectId;
  public screenHeight: number;

  constructor() {
    this.screenHeight = window.innerHeight;
  }
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.screenHeight = window.innerHeight;
    this.ngOnChanges({
      screenHeight: new SimpleChange(null, this.screenHeight, false),
    });
  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {

  }

  selectCompany(i) {
    this.isSelectedCompany = true;
    if (this.isSelectedCompany === true) {
      document.getElementById("sidebar-wrapper").style.display = "block";
    }
    this.selectId = this.CompanyNames[i].id;
    let data = {
      company_id: this.CompanyNames[i].id,
    };
    this.authService.updateUserCompany(data).then((res) => {
      if (res) {
        window.location.reload();
      }
    });
  }
}
