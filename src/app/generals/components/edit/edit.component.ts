import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GeneralsService } from "../../../core/services/generals.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppService } from "src/app/core/services/app.service";
import { UnderscoreToSpace } from "src/app/underscoreToSpace.pipe";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"],
  providers: [UnderscoreToSpace],
})
export class EditComponent implements OnInit {
  public general: any;

  public editForm: FormGroup;
  public actionStatus = -1;
  public disabled = false;
  public uploadMessage: any;
  public chooseFile = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private generalsService: GeneralsService,
    private appService: AppService,
    public underscoreToSpace: UnderscoreToSpace,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.appService.setBackRoute("/generals");
    this.appService.setShowAddButton = false;
    this.general = this.route.snapshot.data["general"];

    this.editForm = this.fb.group({
      key: [this.general.key, [Validators.required]],
      value: [this.general.value, []],
      id: [this.general.id, []],
      image: ["", []],
    });
  }

  onSave() {
    if (this.editForm.valid) {
      const data = this.editForm.value;

      if (
        (data.key == "Worker Attest Time" && this.validateHhMm(data.value)) ||
        (data.key == "Project Manager Attest Time" &&
          this.validateHhMm(data.value))
      ) {
        let hours = data.value.split(":")[0];
        let minutes = data.value.split(":")[1];

        if (hours.length == 1) hours = "0" + hours;

        let hourwWithMinutes = hours + ":" + minutes;
        data.value = hourwWithMinutes;

        this.disabled = true;
        this.generalsService.updateItem(data).subscribe((res) => {
          if (res["status"]) {
            this.disabled = false;
            this.actionStatus = res["status"] ? 1 : 0;
            this.toastr.success(
              this.translate.instant("You have successfully set the time!"),
              this.translate.instant("Info")
            );
            this.router.navigate(["/generals"]);
          }
        });
      } else if (
        data.key != "Worker Attest Time" &&
        data.key != "Project Manager Attest Time"
      ) {
        this.disabled = true;
        this.generalsService.updateItem(data).subscribe((res) => {
          if (res["status"]) {
            this.disabled = false;
            this.actionStatus = res["status"] ? 1 : 0;
            this.router.navigate(["/generals"]);
          }
        });
      } else {
        this.toastr.error(
          this.translate.instant('Please input correct format "00:00"!'),
          this.translate.instant("Info")
        );
      }
    }
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      this.uploadMessage = event.target.files[0].name;
      reader.onload = () => {
        this.chooseFile = true;
        this.editForm.patchValue({
          image: reader.result,
        });
      };
    }
  }

  validateHhMm(hours) {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
      hours
    );

    if (isValid) return true;
    else return false;
  }
}
