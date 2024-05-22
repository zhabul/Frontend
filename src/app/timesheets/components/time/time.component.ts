import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-time",
  templateUrl: "./time.component.html",
  styleUrls: ["./time.component.css"],
})
export class TimeComponent implements OnInit {
  public createForm: FormGroup;
  public language = "en";
  public minutes: any[];
  public hour: any;
  public hourIndex: any;
  public minute: any;
  public minuteIndex: any;
  public time: any;
  public hours: any[] = [
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];

  constructor(
    public dialogRef: MatDialogRef<TimeComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private fb: FormBuilder,
    private timeRegistrationService: TimeRegistrationService
  ) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      Hours: ["7", [Validators.required]],
      Minutes: ["00", [Validators.required]],
    });
  }

  chooseMinutes(minutes) {
    this.createForm.get("Minutes").patchValue(minutes);
  }

  chooseHours(hours) {
    this.createForm.get("Hours").patchValue(hours);
  }

  addTime() {
    const data = this.createForm.value;

    if (this.createForm.valid) {
      let hours = data.Hours + ":" + data.Minutes;
      let obj = {
        id: "",
        Time: hours,
        UserNotificationTasksID: this.modal_data.note.id,
        Type: this.modal_data.type,
      };
      this.timeRegistrationService
        .createTimeForNotification(obj)
        .subscribe((response) => {
          if (response["status"]) {
            obj.id = response["id"];
            this.dialogRef.close(obj);
          }
        });
    }
  }
}
