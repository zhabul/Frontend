import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-materials",
  templateUrl: "./materials.component.html",
  styleUrls: ["./materials.component.css"],
})
export class MaterialsComponent implements OnInit {
  public project;
  public materials;
  public userDetails;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    this.project = this.route.snapshot.data["project"];
    this.materials = this.route.snapshot.data["materials"];
  } 
}
