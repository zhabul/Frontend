import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.css"],
})
export class SecurityComponent implements OnInit {
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
