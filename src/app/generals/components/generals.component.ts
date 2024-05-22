import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "src/app/core/services/app.service";
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { GeneralsService } from "src/app/core/services/generals.service";
//import { UsersService } from "src/app/core/services/users.service";

@Component({
  selector: "app-generals",
  templateUrl: "./generals.component.html",
  styleUrls: ["./generals.component.css"],
})
export class GeneralsComponent implements OnInit {
  public generals: any[];
  public userDetails: any;
  public accounts: any[] = [];
  public allAccounts = [];
  public loading = false;
  public showCreateFile = false;
  public uploadMessage: any;
  public file: any;
  public fileName: any;
  public canPressSave = true;
  public messages: object;
  public lang: string;
  public belongsTo: any;
  public scheduleRoles: any[] = [];
  public userRoles = [];
  public theSpinner = false;
  public moments: any[] = [];
  public selectedTab = "company-details";

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private fortnoxApi: FortnoxApiService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private generalsService: GeneralsService,
   // private userService: UsersService
  ) {}

  ngOnInit() {


    /*this.userService.getRoles().subscribe((res: any) => {
      this.userRoles = res;
      this.scheduleRoles = this.route.snapshot.data["scheduleRoles"].map(
        (x) => {
          x["role"] = res.find((y) => y.id === x.roleId).roles;
          return x;
        }
      );
    });*/

    this.moments = this.route.snapshot.data["moments"] || [];
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.translate.use(sessionStorage.getItem("lang"));
    this.appService.setBackRoute("/home");
    this.appService.setShowAddButton = false;
    this.generals = this.route.snapshot.data["generals"];
    this.filterGenerals();
    this.fortnoxApi.getAllAccounts().subscribe((res) => {
      this.accounts = res;
      this.allAccounts = JSON.parse(JSON.stringify(this.accounts));
    });
  }

  filterGenerals() {
    this.filterWageType();
    this.filterStartDate();
    this.filterEndDate();
    this.filterOB1();
    this.filterOB2();
    this.filterOB3();
  }

  filterWageType() {
    this.generals = this.generals.filter((general)=>{
      return general.key !== 'Wage Type';
    });
  }

  filterStartDate() {

    this.generals = this.generals.filter((general)=>{
      return general.key !== 'Regular Start Date';
    });
  }

  filterEndDate() {
    this.generals = this.generals.filter((general)=>{
      return general.key !== 'Regular End Date';
    });
  }

  filterOB1() {
    this.generals = this.generals.filter((general)=>{
      return general.key !== 'OB1';
    });
  }

  filterOB2() {
    this.generals = this.generals.filter((general)=>{
      return general.key !== 'OB2';
    });
  }

  filterOB3() {
    this.generals = this.generals.filter((general)=>{
      return general.key !== 'OB3';
    });
  }

  swipeLeft($e) {}

  swipeRight($e) {
    this.theSpinner = true;
  }

  swipeUp() {}

  swipeDown() {}

  toggleTab(tab: string) {
    this.selectedTab = tab;
  }

  toggleAccountEnabled(index) {
    if (this.accounts[index].Enabled == "1") {
      this.accounts[index].Enabled = "0";
    } else {
      this.accounts[index].Enabled = "1";
    }

    this.fortnoxApi
      .toggleAccountEnabled(
        this.accounts[index].Number,
        this.accounts[index].Enabled
      ).subscribe((res:any) => {
        if (this.accounts[index].Enabled == 0)
          this.accounts[index].FixedCost = 0;
      });
  }

  toggleAccountFixedCost(index) {
    if (this.accounts[index].FixedCost == "1") {
      this.accounts[index].FixedCost = "0";
    } else {
      this.accounts[index].FixedCost = "1";
    }

    this.fortnoxApi.toggleAccountFixedCost(
      this.accounts[index].Number,
      this.accounts[index].FixedCost
    ).subscribe();
  }

  refreshAccountingPlan() {
    this.loading = true;
    this.fortnoxApi.refreshAccountingPlan().then((res) => {
      if (res) {
        this.toastr.success(
          this.translate.instant("Successfully fetched data from Fortnox."),
          this.translate.instant("Success")
        );
        this.accounts = res;
      } else {
        this.toastr.error(
          this.translate.instant(
            "There was an error while trying to fetch data from Fortnox."
          ),
          this.translate.instant("Error" + ".")
        );
      }
      this.loading = false;
    });
  }

  toggleCreateFile(e) {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }

      this.showCreateFile = !this.showCreateFile;
      this.uploadMessage = null;
      this.file = null;
    }
  }
  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      this.uploadMessage = event.target.files[0].name;

      reader.onload = () => {
        this.file = reader.result;
        this.fileName = event.target.files[0].name;
      };
    }
  }
  async addNewFile() {
    if (!this.canPressSave) {
      return;
    }

    this.canPressSave = false;

    if (!this.file) {
      this.toastr.error(
        this.messages[this.lang][7],
        this.messages[this.lang][0]
      );
      this.canPressSave = true;
      return;
    }
    const res = await this.generalsService.addNewFile({
      name: this.fileName,

      file: this.file,
    });

    if (!res["status"]) {
      this.toastr.error(
        this.messages[this.lang][6],
        this.messages[this.lang][0]
      );
      this.canPressSave = true;
      return;
    }

    this.showCreateFile = false;
    this.toastr.success(
      this.messages[this.lang][5],
      this.messages[this.lang][1]
    );
    this.canPressSave = true;
  }

  onSearch(searchQuery) {
    this.accounts = this.allAccounts.filter((account) =>
      ["Number", "Description", "SRU"].some((property) =>
        account[property].toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }
}
