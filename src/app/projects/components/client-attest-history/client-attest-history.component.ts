import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "client-attest-history",
  templateUrl: "./client-attest-history.component.html",
  styleUrls: ["./client-attest-history.component.css"],
})
export class ClientAttestHistoryComponent implements OnInit {
  @Input() clientAttestHistory = [];
  @Input() showingKS = false;

  public uniqueWeeklyReportNames = [];
  public uniqueEmails = [];

  public articleName = "";
  public weeklyReportNameFilter = "";
  public emailFilter = "";

  constructor() {}

  ngOnInit() {
    this.clientAttestHistory.forEach((attest) => {
      if (!this.uniqueEmails.includes(attest.email)) {
        this.uniqueEmails.push(attest.email);
      }

      if (!this.uniqueWeeklyReportNames.includes(attest.search_name)) {
        this.uniqueWeeklyReportNames.push(attest.search_name);
      }
    });
  }

  filterClientAttestHistory() {
    return this.clientAttestHistory.filter((attest) => {
      if (
        this.articleName.length > 0 &&
        !attest.name.toLowerCase().includes(this.articleName.toLowerCase())
      ) {
        return false;
      }

      if (
        this.weeklyReportNameFilter !== "" &&
        !attest.search_name.startsWith(this.weeklyReportNameFilter)
      ) {
        return false;
      }

      if (this.emailFilter !== "" && attest.email !== this.emailFilter) {
        return false;
      }

      return true;
    });
  }
}
