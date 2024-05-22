import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import { CompanyDetails } from "../../interfaces/company-details";
import { SettingsService } from "src/app/core/services/settings.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ClientsService } from "src/app/core/services/clients.service";
declare var $;
@Component({
  selector: "app-company-details",
  templateUrl: "./company-details.component.html",
  styleUrls: ["./company-details.component.css"],
})
export class CompanyDetailsComponent implements OnInit {
  @Input("generals") generals: any;
  @ViewChild("fileInput") fileInput: ElementRef;
  companyDetails = {} as CompanyDetails;
  companyDetailsArray = [];
  updateArray = [];
  loading = false;
  logoName = "";
  showLogo = false;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public payment_systems: any[] = [];
  public sps_languages: any[] = [];
  public sps_currencies: any[] = [];
  private languageIndex = -1;

  constructor(
    private clientsService: ClientsService,
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getSalarySystems();
    this.getSpsLanguages();
    this.getSpsCurrencies();

    this.dataHandler();
    if (
      this.companyDetails.logo.length > 0 &&
      this.companyDetails.logo != "logo"
    ) {
      this.showLogo = true;
      this.logoName = "Default logo";
    } else {
      this.showLogo = false;
    }

    if (this.userDetails.create_settings_Global) {
       $("input").removeAttr('disabled');
    }else {
      $("input").attr('disabled','disabled');
    }
  }



  onSubmit(form: NgForm) {
    this.loading = true;
    let values = form.value;

    this.companyDetails = {
      companyName: values.companyName,
      companyCity: values.companyCity,
      companyMobileNumber: values.companyMobileNumber,
      companyEmail: values.companyEmail,
      companyZip: values.companyZip,
      companyPhone: values.companyPhone,
      companyWebsite: values.companyWebsite,
      companyAddress: values.companyAddress,
      companyBankAccount: values.companyBankAccount,
      companyVatNumber: values.companyVatNumber,
      companyVat: values.companyVat,
      multiplicationConstant: values.multiplicationConstant,
      Internal_costs: values.Internal_costs,
      logo: this.companyDetails.logo,
      Language: this.languageIndex != -1 ? this.sps_languages.at(this.languageIndex).name : values.Language,
      Currency: values.Currency,
      SalarySystem: values.SalarySystem
    };

    for (const key in this.companyDetails) {
      let companyDetail = this.companyDetailsArray.filter(
        (detail) => key in detail
      )[0];

      if (this.companyDetails[key] != companyDetail[key]) {
        this.updateArray.push({
          id: companyDetail.id,
          value: this.companyDetails[key] ? this.companyDetails[key] : null,
          isImage: companyDetail.isImage,
        });
      }
    }

    if (this.updateArray.length == 0) {
      this.toastr.info(this.translate.instant("Everything is up to date"));
      this.loading = false;
      return;
    }


    this.settingsService.updateAllGenerals(this.updateArray).subscribe({
      next: (response) => {
        if (response.status) {
        //  this.loading = false;
          this.toastr.success(this.translate.instant("Successfully updated"));
          this.updateArray = [];
          this.companyDetailsArray = [];
          this.getGenerals();
        }
      },
      error: (err: any) => {
        this.toastr.error(err);
      },
    });
  }

  dataHandler() {
    this.changeKey("Company_Name", "companyName", false);
    this.changeKey("Company_City", "companyCity", false);
    this.changeKey("Company_Mobile", "companyMobileNumber", false);
    this.changeKey("Company_Email", "companyEmail", false);
    this.changeKey("Company_Zip", "companyZip", false);
    this.changeKey("Company_Phone", "companyPhone", false);
    this.changeKey("Company_Site", "companyWebsite", false);
    this.changeKey("Company_Address", "companyAddress", false);
    this.changeKey("Company_Bank_Account", "companyBankAccount", false);
    this.changeKey("Company_VAT_number", "companyVatNumber", false);
    this.changeKey("VAT", "companyVat", false);
    this.changeKey(
      "Multiplication constant for social security contributions",
      "multiplicationConstant",
      false
    );
    this.changeKey("Internal_costs", "Internal_costs", false);
   // this.changeKey("Working hours", "workingHours", false);
   // this.changeKey("Worker Attest Time", "workerAttestTime", false);
   // this.changeKey("Project Manager Attest Time", "managerAttestTime", false);
    //this.changeKey("Fortnox_Api_Key", "fortnoxApiKey", false);
    //this.changeKey("Fortnox_Secret_Key", "fortnoxSecretKey", false);
    this.changeKey("Logo", "logo", true);
    this.changeKey("Language", "Language", false);
    this.changeKey("Currency", "Currency", false);
    this.changeKey("SalarySystem", "SalarySystem", false);
  }

  changeKey(key: string, newKey: string, isImage: boolean) {

    let filteredValue = this.generals.filter((detail) => detail.key == key)[0];
    this.companyDetails[newKey] = filteredValue.value
      ? filteredValue.value
      : "";

    this.companyDetailsArray.push({
      [newKey]: filteredValue.value ? filteredValue.value : "",
      id: filteredValue.id,
      isImage: isImage ? true : false,
    });
  }

  openFileExplorer(input: HTMLInputElement) {
    input.click();
  }

  changeLogo(event: any) {
    const reader = new FileReader();
    event.target;
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.showLogo = true;
        this.companyDetails.logo = reader.result as string;
        this.logoName = file.name;
      };
    }
  }

  removeLogo() {
    this.showLogo = false;
    this.logoName = "";
    this.companyDetails.logo = "logo";
    let logo = this.companyDetailsArray.filter(
      (detail) => detail.isImage == true
    );
    if (logo.length > 0) {
      (logo[0].logo = ""), (logo[0].isImage = false);
    }
  }

  formtMobileNumber(mobile_number,name) {
    this.clientsService.formatMobileNumber({'mobile_number': mobile_number}).subscribe((res:any) => {
      if(res.status) {
      if(name == 'mobile') this.companyDetails.companyMobileNumber = res['result'];
      if(name == 'phone') this.companyDetails.companyPhone = res['result'];
      }
    });
  }
  setPayment(event:any) {
    this.companyDetails.SalarySystem = event;
  }

  getSalarySystems() {
    this.settingsService.getSalarySystems().subscribe((response) => {
        if (response.status) {
            this.payment_systems = response.data;
        }
    });
  }

  getSpsLanguages() {
    this.settingsService.getSpsLanguages().subscribe((response) => {
        if (response.status) {
            this.sps_languages = response.data;
        }
    });
  }

  setLanguage(languageIndex) {
    this.companyDetails.Language = this.sps_languages.at(languageIndex).name;
    this.languageIndex = languageIndex;
  }

  setCurrency(event) {
    this.companyDetails.Currency =event;
  }

  getGenerals() {
    this.settingsService.getAllGenerals().subscribe((response) => {
        if (response.status) {
            this.generals = response.data.data;
            this.dataHandler();
            this.loading = false;
        }
    });
  }

  getSpsCurrencies() {

    this.settingsService.getSpsCurrencies().subscribe((response) => {
        if (response.status) {
            this.sps_currencies = response.data;
        }
    });
  }
}
