import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ClientsService } from "src/app/core/services/clients.service";

@Component({
  selector: "add-proj-company",
  templateUrl: "./add-proj-company.component.html",
  styleUrls: ["./add-proj-company.component.css"],
})
export class AddProjectCompanyComponent implements OnInit {
  @Input() projectId;
  @Input() registers;

  public createForm: FormGroup;
  private categoryId: number;

  constructor(
    private projectsService: ProjectsService,
    private clientsService: ClientsService
  ) {}

  ngOnInit() {
    this.clientsService.currentCategoryId.subscribe((categoryId) => {
      this.categoryId = categoryId;
    });
  }

  createCompany(companyName) {
    console.log("creating");
    this.projectsService
      .createCompany({ id: this.categoryId, name: companyName })
      .then(() => {});
  }
}
