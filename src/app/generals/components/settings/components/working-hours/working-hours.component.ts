import { Component, OnInit } from "@angular/core";
import { SettingsService } from "src/app/core/services/settings.service";
import { WorkDay } from "../../interfaces/work-day";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-working-hours",
  templateUrl: "./working-hours.component.html",
  styleUrls: ["./working-hours.component.css"],
})
export class WorkingHoursComponent implements OnInit {
  days: WorkDay[];
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.settingsService.getWorkWeek().subscribe({
      next: (response) => {
        if (response.status) {
          this.days = response.data;
        }
      },
      error: () => this.toastr.error(this.translate.instant("Server error")),
    });
  }

  changeWorkingOnDay(day) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    day.type = day.type == "1" ? "0" : "1";
    this.settingsService.updateWorkWeek(day).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(this.translate.instant("Workday updated."));
        }
      },
    });
  }
}
