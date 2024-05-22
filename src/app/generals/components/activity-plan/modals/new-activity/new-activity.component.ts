import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-new-activity",
  templateUrl: "./new-activity.component.html",
  styleUrls: ["./new-activity.component.css"],
})
export class NewActivityComponent implements OnInit {
  public createForm: FormGroup;
  public project: any;
  public numberValidation = {
    status: true,
    message: "valid",
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewActivityComponent>,
    private toastr: ToastrService,
    private translate: TranslateService,
    private projectService: ProjectsService,
    @Inject(MAT_DIALOG_DATA) public modal_data: any
  ) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      number: ["", [Validators.required, Validators.pattern("(\\d{4}|\\d)")]],
      description: ["", [Validators.required]],
      status: [true, [Validators.required]],
    });
  }

  async create() {
    if (this.createForm.valid && this.numberValidation.status) {
      const data = this.createForm.value;

      const category = this.findActivityCategory(this.createForm.value.number);

      const activityParent = this.findActivityParent(
        category,
        this.createForm.value.number
      );

      data.parent = activityParent.id;

      const response = await this.projectService.createActivity(data);

      if (response["status"]) {
        data.id = response["activityId"];
        data.activities = [];

        activityParent.activities.push(data);
        activityParent.activities.sort(this.sortActivitiesByNumber);

        this.toastr.success(
          this.translate.instant("You have successfully created activity."),
          this.translate.instant("Success")
        );
        this.dialogRef.close(data);
      } else {
        this.toastr.error(
          this.translate.instant("Something wrong!"),
          this.translate.instant("Error")
        );
      }
    }
  }

  validateNumberInput() {
    if (this.createForm.get("number").errors) {
      this.numberValidation = {
        status: true,
        message: "valid",
      };
      return;
    }

    const category = this.findActivityCategory(this.createForm.value.number);

    const activityParent = this.findActivityParent(
      category,
      this.createForm.value.number
    );

    if (!activityParent) {
      this.numberValidation = { status: false, message: "noparent" };
      return;
    }

    if (
      activityParent.activities.some(
        (activity) => activity.number === this.createForm.value.number
      ) ||
      category.number === this.createForm.value.number
    ) {
      this.numberValidation = { status: false, message: "samename" };
      return;
    }

    this.numberValidation = { status: true, message: "valid" };
  }

  sortActivitiesByNumber(a, b) {
    if (a.number < b.number) {
      return -1;
    }
    if (a.number > b.number) {
      return 1;
    }
    return 0;
  }

  findActivityCategory(number) {
    return this.modal_data.activities.find(
      (activity) => activity.number === number[0]
    );
  }

  findActivityParent(activity, number) {
    const nums = number.replace(/0+$/, "").split("").splice(0, 4);
    let numLetters = nums[0];

    for (let i = 1, n = nums.length - 1; i < n; i++) {
      numLetters += nums[i];
      activity = activity.activities.find((a) =>
        a.number.startsWith(numLetters)
      );

      if (!activity) {
        return false;
      }
    }

    return activity;
  }
}
