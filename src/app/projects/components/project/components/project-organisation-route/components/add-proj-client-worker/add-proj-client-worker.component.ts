import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ToastrService } from "ngx-toastr";
import { ClientsService } from "src/app/core/services/clients.service";

@Component({
  selector: "add-proj-client-worker",
  templateUrl: "./add-proj-client-worker.component.html",
  styleUrls: ["./add-proj-client-worker.component.css"],
})
export class AddProjClientWorkerComponent implements OnInit {
  @Input() projectId: number;
  @Input() roles_t: any[] = [];
  @Input() clients_workers: any[] = [];

  public createForm: FormGroup;
  private categoryId: number;
  private categoryType: number;

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private toastr: ToastrService,
    private clientsService: ClientsService
  ) {}

  ngOnInit() {
    this.clientsService.currentCategoryId.subscribe((category) => {
      console.log(category);
      if (category == undefined) return;
      this.categoryId = category.categoryId;
      this.categoryType = category.type;
    });

    this.createForm = this.fb.group({
      id: [""],
      client_worker: [""],
      roleInput: [""],
    });
  }

  createDirectory() {
    console.log(this.createForm.value);
    if (this.createForm.valid) {
      this.projectsService
        .addCategoryWorkers(
          this.categoryId,
          this.createForm.value.client_worker,
          this.createForm.value.roleInput
        )
        .then((response) => {
          if (response["status"]) {
            const cw = this.clients_workers.find(
              (x) => x["Id"] == this.createForm.value.client_worker
            );
            const data = {
              Id: response["data"]["categoryId"],
              Role: this.roles_t.find(
                (x) => x["id"] == this.createForm.value.roleInput
              ).roles,
              FirstName: cw.FirstName,
              LastName: cw.LastName,
            };
            this.clientsService.clientWorker.next({
              categoryId: this.categoryId,
              type: this.categoryType,
              worker: data,
            });
            this.clientsService.setComponentVisibility(0);

            this.toastr.success(
              "You have successfully created Register!",
              "Register !"
            );
          } else {
            this.toastr.error(
              "There was an error with your submission!",
              "Error"
            );
          }
        })
        .catch((err) => {
          this.toastr.error(
            "There was an error with your submission!",
            "Error"
          );
          console.log(err);
          return { status: false };
        });
    } else {
      this.toastr.error("There was an error with your submission!", "Error");
    }
  }
}
