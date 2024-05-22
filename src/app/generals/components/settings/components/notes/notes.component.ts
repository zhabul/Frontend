import { Component, OnInit } from "@angular/core";
import { SettingsService } from "src/app/core/services/settings.service";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.css"],
})
export class NotesComponent implements OnInit {
  companyId: string;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.companyId = this.settingsService.getCompanyId();
  }
}
