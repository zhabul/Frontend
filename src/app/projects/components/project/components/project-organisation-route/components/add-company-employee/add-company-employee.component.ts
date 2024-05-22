import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ClientsService } from "src/app/core/services/clients.service";

@Component({
  selector: "add-company-employee",
  templateUrl: "./add-company-employee.component.html",
  styleUrls: ["./add-company-employee.component.css"],
})
export class AddCompanyEmployeeComponent implements OnInit {
  @Input() projectId;
  @Input() registers;

  public createForm: FormGroup;
  private categoryIndex: number;
  private companyIndex: number;
  public roles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private clientsService: ClientsService
  ) {}

  ngOnInit() {
    this.clientsService.currentCategoryId.subscribe((categoryId) => {
      this.categoryIndex = parseInt(categoryId.toString().split("-")[0]);
      this.companyIndex = parseInt(categoryId.toString().split("-")[1]);
    });
    this.roles = this.route.snapshot.data["roles"];
  }

  addOneWorker(firstName, lastName, role) {
    const employee = {
      categoryId: this.registers[this.categoryIndex].Id,
      companyId:
        this.registers[this.categoryIndex].company[this.companyIndex].Id,
      firstName,
      lastName,
      role,
    };

    this.projectsService.createCompanyEmployee(employee).then((res) => {
      if (res["status"]) {
        this.registers[this.categoryIndex].company[this.companyIndex][
          "new_anim_state"
        ] = "small";
        this.registers[this.categoryIndex].company[
          this.companyIndex
        ].Employes.push({
          Id: res["data"]["companyId"],
          LastName: lastName,
          FirstName: firstName,
          Role: this.roles.find((x) => x.id == role).roles,
        });
      }
    });
    this.clientsService.setComponentVisibility(0);
  }
}
