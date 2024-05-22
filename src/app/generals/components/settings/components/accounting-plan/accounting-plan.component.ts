import { Component, OnInit } from "@angular/core";
import { SettingsService } from "src/app/core/services/settings.service";
import { Account } from "../../interfaces/account";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-accounting-plan",
  templateUrl: "./accounting-plan.component.html",
  styleUrls: ["./accounting-plan.component.css"],
})
export class AccountingPlanComponent implements OnInit {
  accounts: Account[];
  loading = true;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.settingsService.getAllAccounts().subscribe((res) => {
      this.loading = false;
      this.accounts = res.data;
    });
  }

  isEnabled(account: Account) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    account.Enabled = account.Enabled == "1" ? "0" : "1";
    this.settingsService
      .toggleAccountEnabled(account.Number, account.Enabled)
      .subscribe({
        next: (res) => {
          if (res.status) {
            if (account.Enabled == "1") {
              this.toastr.success(this.translate.instant("Account enabled"));
            } else {
              this.toastr.success(this.translate.instant("Account disabled"));
              account.FixedCost = "0";
            }
          }
        },
        error: (err) => {
          account.Enabled = account.Enabled == "1" ? "0" : "1";
          this.toastr.error(this.translate.instant("Server error"));
        },
      });
  }

  changeFixedCost(account: Account) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    account.FixedCost = account.FixedCost == "1" ? "0" : "1";
    this.settingsService
      .toggleAccountFixedCost(account.Number, account.FixedCost)
      .subscribe({
        next: (res) => {
          if (res.status) {
            if (account.FixedCost == "1") {
              this.toastr.success(this.translate.instant("Fixed cost enabled"));
            } else {
              this.toastr.success(
                this.translate.instant("Fixed cost disabled")
              );
            }
          }
        },

        error: (err) => {
          account.FixedCost = account.FixedCost == "1" ? "0" : "1";
          this.toastr.error(this.translate.instant("Server error"));
        },
      });
  }
}
