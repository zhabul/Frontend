import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GeneralService } from "src/app/core/services/general.service";
@Component({
  selector: "app-setup-basic-data",
  templateUrl: "./setup-basic-data.component.html",
  styleUrls: ["./setup-basic-data.component.css"],
})
export class SetupBasicDataComponent implements OnInit {
  public email: any;
  public token: any;
  public user_id: any;
  public company_id: any;
  public createForm: FormGroup;
  public generals: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private generalService: GeneralService
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.params["email"];
    this.token = this.route.snapshot.params["token"];
    this.getUserForSetupDetails();
  }

  getUserForSetupDetails() {
    this.authService
      .getUserForSetupDetails(this.email, this.token)
      .subscribe((res) => {
        if (res["status"]) {
          this.user_id = res["data"]["user_id"];
          this.company_id = res["data"]["company_id"];
          this.generals = res["data"]["generals"];
          this.initializeFOrm();
        } else {
          this.router.navigate(["/external/response/fail"]);
        }
      });
  }

  initializeFOrm() {
    this.createForm = this.fb.group({
      generals: this.fb.group({
        working_hours: [this.generals["Working hours"], [Validators.required]],
        vat: [this.generals["VAT"], [Validators.required]],
        Fortnox_Api_Key: [this.generals["Fortnox_Api_Key"], []],
        Multiplication_constant_for_social_security_contributions: [
          this.generals[
            "Multiplication constant for social security contributions"
          ],
          [Validators.required],
        ],
        Company_VAT_number: [this.generals["Company_VAT_number"], []],
        Company_Bank_Account: [this.generals["Company_Bank_Account"], []],
        Company_Address: [this.generals["Company_Address"], []],
        Company_Mobile: [this.generals["Company_Mobile"], []],
        Company_Zip: [this.generals["Company_Zip"], []],
        Company_Site: [this.generals["Company_Site"], []],
        Company_Email: [this.generals["Company_Email"], [Validators.required]],
        Company_Name: [this.generals["Company_Name"], [Validators.required]],
        Company_Phone: [this.generals["Company_Phone"], []],
        Company_City: [this.generals["Company_City"], [Validators.required]],
        Logo: [this.generals["Logo"], []],
      }),
    });
  }

  updateGenerals() {
    const data = this.createForm.value;

    if (this.createForm.valid) {
      this.generalService.updateGeneralInformation(data).subscribe((res) => {});
    }
  }
}
