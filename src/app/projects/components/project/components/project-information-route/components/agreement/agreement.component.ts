import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-agreement",
  templateUrl: "./agreement.component.html",
  styleUrls: ["./agreement.component.css"],
})
export class AgreementComponent implements OnInit {
  public project: any;
  public attachments = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.project = this.route.snapshot.data["project"];
    this.attachments = this.route.snapshot.data["attachments"]["data"] || [];
  }
  handleRemoveFile(deletedFiles) {
    this.attachments = this.attachments.filter((item: any) => {
      let found = true;
      for (let i = 0; i < deletedFiles.length; i++) {
        const del_item = deletedFiles[i];
        if (del_item.Id == item.Id) {
          found = false;
          break;
        }
      }
      return found;
    });
  }
}
