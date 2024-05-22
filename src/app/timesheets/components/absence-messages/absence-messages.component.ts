import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import * as moment from "moment";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-absence-messages",
  templateUrl: "./absence-messages.component.html",
  styleUrls: ["./absence-messages.component.css"],
})
export class AbsenceMessagesComponent implements OnInit {
  public createForm: FormGroup;
  public project: any;
  public messages: any = [];
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));

  public swiper = {
    images: [],
    active: -1,
    album: -2,
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AbsenceMessagesComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private timeRegistrationService: TimeRegistrationService
  ) {}

  ngOnInit() {
    let data = this.modal_data["absence"].messages;
    let week = this.modal_data["absence"].week;
    
    if (data.messages[this.modal_data["absence"].week]) {
      this.messages = data.messages[week];

      let obj = {
        week_id: this.messages[0].week_id,
        opened: 1,
      };

      this.timeRegistrationService.updateOpenedStatus(obj);
    }

    this.createForm = this.fb.group({
      message: ["", [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  update() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      this.dialogRef.close(data);
    }
  }

  setToInvisible() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      this.timeRegistrationService
        .updateAbsenceStatusFromClient(data)
        .subscribe((res) => {
          if (res["status"]) this.dialogRef.close(res);
        });
    }
  }

  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  scrollToBottom() {
    $(".messages-wrapper").scrollTop($(".messages-wrapper")[0].scrollHeight);
  }

  sendComment() {
    const data = this.createForm.value;
    let date = new Date();
    let year = date.getFullYear();
    let moment_date_formated = moment(date).format("YYYY-MM-DD HH:MM");

    data.year = year;
    data.opened = 1;
    data.week = this.messages[0].week; 
    data.user_id = this.userDetails.user_id;
    data.week_id = this.messages[0].week_id;  
    data.full_name = 
      this.userDetails.firstname + " " + this.userDetails.lastname;
    data.created_message = moment_date_formated;
    data.group =
      this.messages[0].user_id + "-" + year + "-" + this.messages[0].week_id;
  
    this.timeRegistrationService.createAbsenceComment(data).subscribe((res) => {
      this.messages.push(data);
      this.createForm.controls.message.setValue("");
      this.sleep(100).then(() => {
        this.scrollToBottom();
      });
    });
  }

  openSwiper(index, images) {
    this.swiper = {
      active: index,
      images: images,
      album: 0,
    };
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
    };
  }

  removeSwiperImage(event) {}

}
