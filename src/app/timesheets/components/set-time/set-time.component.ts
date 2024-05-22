import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-set-time",
  templateUrl: "./set-time.component.html",
  styleUrls: ["./set-time.component.css"],
})
export class SetTimeComponent implements OnInit {
  public createForm: FormGroup;
  public language = "en";
  public hours: any[];
  public minutes: any[];
  public hour: any;
  public hourIndex: any;
  public minute: any;
  public minuteIndex: any;
  public time: any;

  constructor(
    public dialogRef: MatDialogRef<SetTimeComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private fb: FormBuilder
  ) {
    this.hours = [
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
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
    this.minutes = [
      "05",
      "10",
      "15",
      "20",
      "25",
      "30",
      "35",
      "40",
      "45",
      "50",
      "55",
    ];
    this.minute = "00";
    this.hour = "00";
    this.time = this.hour + ":" + this.minute;
  }

  ngOnInit() {
    this.createForm = this.fb.group({
      Hour: ["", [Validators.required]],
      Minutes: ["", [Validators.required]],
    });
  }

  setHour(hour, index) {
    this.hour = hour;
    this.hourIndex = index;
  }

  setMinute(minute, index) {
    this.minute = minute;
    this.minuteIndex = index;
  }

  setTime() {
    this.time = this.hour + ":" + this.minute;
    this.modal_data["Hours"] = this.time;
    this.dialogRef.close();
  }
}
