import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { AbsenceMessagesComponent } from "src/app/timesheets/components/absence-messages/absence-messages.component";
import { ImageModalOldComponent } from "src/app/projects/components/image-modal-old/image-modal-old.component";
import * as moment from "moment";
import { extendMoment } from "moment-range";
import { interval, Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { HasSeenModalComponent } from "./has-seen-modal/has-seen-modal.component";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { FileStorageService } from "src/app/core/services/file-storage.service";

const momentRange = extendMoment(moment);
declare var $;

@Component({
  selector: "app-time-registration-users-absence",
  templateUrl: "./time-registration-users-absence.component.html",
  styleUrls: ["./time-registration-users-absence.component.css"],
})
export class TimeRegistrationUsersAbsenceComponent
  implements OnInit, OnDestroy
{
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public createForm: FormGroup;
  public startDate: any;
  public endDate: any;
  public date: any;
  public language = "en";
  public week = "Week";
  public dateWeek: any;
  public absenceTypes: any[];
  public absenceMessage: any;
  public messageErr: any;
  public absences: any[] = [];
  public haveAbsences = false;
  public nextDate: any;
  public isAbsence = false;
  public absencesArray: any[] = [];
  public validation = true;
  public messageDelete: any;
  public subscription: Subscription;
  public isEdited: boolean = false;
  public editing: boolean = false;
  public editingAbsence: any;
  public shouldContinueWithAbsence = true;
  private dates: string[];
  public userShouldReceiveNotification: boolean = true;
  public absenceNumber: number = 0;
  public notSeenAbsences: any;
  public ran: boolean = false;
  public sameDates: boolean = false;
  public weeks_of_absences: any = [];
  public notification_week: any = null;
  public listOfAbsenceType: any[];
  public files: any[] = [];
  public spinner = false;
  public swiper = {
    images: [],
    active: -1,
    album: -2,
  };

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private dialog: MatDialog,
    private fsService: FileStorageService
  ) {}

  ngOnInit() {
    this.language = this.userDetails.language;
    this.week = this.translate.instant("Week");
    this.listOfAbsenceType = this.route.snapshot.data["absences"]["data"];
    this.date = localStorage.getItem("timeRegistrationData");
    this.date = this.date.slice(0, 11) + '"';
    this.date = this.date.replace(/"/g, "");
    this.dateWeek = moment().format(`YYYY-MM-DD [${this.week}] W`);

    this.getAbsences();
    this.initializeForm(this.dateWeek);

    this.route.queryParamMap.subscribe((params) => {
      this.notification_week = params.get("week") || null;
    });

    var date = new Date(this.date);

    this.nextDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    const datepickerOptions = {
      format: "yyyy-mm-dd",
      calendarWeeks: true,
      autoclose: true,
      language: this.language,
      currentWeek: true,
      todayHighlight: true,
      currentWeekTransl: this.translate.instant("Week"),
      currentWeekSplitChar: "-",
      beforeShowDay: this.nonWorkingDates,
    };

    $("#startDate")
      .datepicker(datepickerOptions)
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) >
          Date.parse(this.createForm.value.endDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Start date cannot be after end date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.startDate;
          }, 0);
        } else {
          this.createForm.get("startDate").patchValue(ev.target.value);
          this.startDate = ev.target.value;
          let date1 = new Date(this.startDate.split(" ")[0]);
          this.nextDate = new Date(
            date1.getFullYear(),
            date1.getMonth(),
            date1.getDate() + 1
          );
        }
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.startDate;
      });

    $("#endDate")
      .datepicker(datepickerOptions)
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) <
          Date.parse(this.createForm.value.startDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("End date cannot be before start date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.endDate;
          }, 0);
        } else {
          this.createForm.get("endDate").patchValue(ev.target.value);
        }
        this.endDate = ev.target.value;
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.endDate;
      });

    const intervalSource = interval(5000);
    this.subscription = intervalSource.subscribe((val) => {
      if (environment.production && !this.isEdited) {
      }
    });
  }

  private nonWorkingDates(date) {
    const day = date.getDay(),
      Sunday = 0,
      Saturday = 6;
    const closedDays = [Sunday, Saturday];
    for (let i = 0; i < closedDays.length; i++) {
      if (day == closedDays[i][0]) {
        return [false];
      }
    }

    for (let i = 0; i < closedDays.length; i++) {
      const closedDay = closedDays[i];
      if (closedDay === day) {
        return false;
      }
    }

    return true;
  }

  private initializeForm(dateWeek) {
    if (this.validation) {
      this.createForm = this.fb.group({
        Comment: ["", []],
        startDate: [dateWeek, [Validators.required]],
        endDate: ["", [Validators.required]],
        AbsenceType: ["", [Validators.required]],
        absences: [this.absences, []],
        absenceTypeName: ["", []],
        hoursAbsence: ["08", []],
        minutesAbsence: ["00", []],
        edited_absence_group: ["", []],
      });
    } else {
      this.createForm = this.fb.group({
        Comment: ["", []],
        startDate: [dateWeek, [Validators.required]],
        endDate: ["", [Validators.required]],
        AbsenceType: ["", [Validators.required]],
        absences: [this.absences, []],
        absenceTypeName: ["", []],
        hoursAbsence: ["08", []],
        minutesAbsence: ["00", []],
        edited_absence_group: ["", []],
      });
    }

    this.createForm.get('minutesAbsence').disable();
  }

  @ViewChild(FormGroupDirective) createFormDirective: FormGroupDirective;

  createScheduleSemesterDate(event) {
    event.stopPropagation();
    const data = this.createForm.value;

    if (this.createForm.valid || this.absences.length > 0) {
      if (!this.editing || !this.editingAbsence.Id) {
        if (data.absences.length > 0) {
          this.validation = false;
        }

        const bodyData = this.filterObjects(data.absences);
        this.spinner = true;
        this.timeRegistrationService
          .createAbsence(bodyData)
          .subscribe((response) => {
            this.spinner = false;
            if (response["status"]) {
              this.toastr.success(
                this.translate.instant("You have successfully added Absence!"),
                this.translate.instant("Info")
              );
              this.router.navigate(["/timesheets/schedule-calendar"]);
            }
          });
      }
    }
  }

  editAbsence() {
    const data = this.createForm.value;
    let range = momentRange.range(
      data.startDate.substring(0, 10),
      data.endDate.substring(0, 10)
    );
    let monthRange = Array.from(range.by("days"));
    const weeks = [];
    let bodyData = [];

    monthRange.map((m) => {
      if (weeks[m.isoWeek()] == undefined) {
        weeks[m.isoWeek()] = [];
      }

      if (weeks[m.isoWeek()] != undefined) {
        weeks[m.isoWeek()].push(m.format("YYYY-MM-DD"));
      }
    });

    weeks.forEach((val, index) => {
      let first_date_in_week = val[0];
      let last_date_in_week = val.pop();
      let abesnce_dates = [];
      let dates = [];
      var day_name = moment(last_date_in_week).format("ddd");

      if (day_name == "Sun") {
        last_date_in_week = moment(last_date_in_week);
        last_date_in_week = last_date_in_week.subtract(2, "days");
        last_date_in_week = last_date_in_week.format("YYYY-MM-DD");
      } else if (day_name == "Sat") {
        last_date_in_week = moment(last_date_in_week);
        last_date_in_week = last_date_in_week.subtract(1, "days");
        last_date_in_week = last_date_in_week.format("YYYY-MM-DD");
      } else {
        last_date_in_week = moment(last_date_in_week)
          .add(1)
          .format("YYYY-MM-DD");
        val.push(last_date_in_week);
      }

      val.forEach((date) => {
        let day_name = moment(date).format("ddd");
        if (day_name != "Sun" && day_name != "Sat") {
          let obj = {
            date: date,
            status: 0,
          };
          abesnce_dates.push(obj);
          dates.push(date);
        }
      });

      let object = {
        Comment: data.Comment,
        startDate: first_date_in_week,
        endDate: last_date_in_week,
        AbsenceType: data.AbsenceType,
        hoursAbsence: data.hoursAbsence,
        minutesAbsence: data.minutesAbsence,
        week: index,
        dates: dates,
        abesnce_dates: abesnce_dates,
        group: this.editingAbsence.group
      };

      bodyData.push(object);
    });
    this.spinner = true;
    this.timeRegistrationService
      .changeRequestAbsence(bodyData)
      .subscribe((response) => {
        this.spinner = false;
        if (response["status"]) {
          this.getAbsences();
          this.toastr.success(
            this.translate.instant("You have successfully edited Absence!"),
            this.translate.instant("Success")
          );
          this.editing = false;
          this.initializeForm(this.dateWeek);
        }
      });
  }

  toggleEdited() {
    this.isEdited = true;
  }

  private transformTimeToDecimal(value: string | number): any {
    if (value && value.toString().includes(":")) {
      const hours = parseInt(value.toString().split(":")[0]);
      const minutes = parseInt(value.toString().split(":")[1]);
      value = hours + minutes / 60;
    } else if (value) {
      value = value;
    }

    return value === "NaN" ? "0" : value;
  }

  async uploadFiles() {

    const files = {
      images: this.files.map((image)=>{
        const type =  'absence';
        image.Name = `${type}_${image.Name}`;
        image.name = `${type}_${image.name}`;
        return image;
      }),
      pdfs: []
    };
    const images = await this.fsService.mergeFilesAndAlbums(files);
    return images ? images.images : [];
  }

  async setAbsence() {

    const images = await this.uploadFiles();

    this.shouldContinueWithAbsence = false;

    const data = this.createForm.value;
    let AbsenceTypeObject = this.findObject(
      this.listOfAbsenceType,
      data.AbsenceType
    );

    this.isEdited = true;
    let ob_start_date = data.startDate.split(" ");
    let ob_end_date = data.endDate.split(" ");
    const weeks = [];

    if (ob_start_date.length > 0) ob_start_date = ob_start_date[0];

    if (ob_end_date.length > 0) ob_end_date = ob_end_date[0];

    let range = momentRange.range(ob_start_date, ob_end_date);
    let monthRange = Array.from(range.by("days"));
    monthRange.map((m) => {
      if (weeks[m.isoWeek()] == undefined) {
        weeks[m.isoWeek()] = [];
      }

      if (weeks[m.isoWeek()] != undefined) {
        weeks[m.isoWeek()].push(m.format("YYYY-MM-DD"));
      }
    });

    let index_ = 0;
    weeks.forEach((val, index) => {
      if (!this.weeks_of_absences.includes(index)) {
        this.weeks_of_absences.push(index);
        this.weeks_of_absences = this.weeks_of_absences.sort(function (a, b) {
          return a - b;
        });
      }

      let first_date_in_week = val[0];

      let last_date_in_week = val.pop();
      let abesnce_dates = [];
      let dates = [];

      var day_name = moment(last_date_in_week).format("ddd");

      if (day_name == "Sun") {
        last_date_in_week = moment(last_date_in_week);
        last_date_in_week = last_date_in_week.subtract(2, "days");
        last_date_in_week = last_date_in_week.format("YYYY-MM-DD");
      } else if (day_name == "Sat") {
        last_date_in_week = moment(last_date_in_week);
        last_date_in_week = last_date_in_week.subtract(1, "days");
        last_date_in_week = last_date_in_week.format("YYYY-MM-DD");
      } else {
        last_date_in_week = moment(last_date_in_week)
          .add(1)
          .format("YYYY-MM-DD");
        val.push(last_date_in_week);
      }

      if (data.hoursAbsence == "" || !data.hoursAbsence) {
        data.hoursAbsence = "08";
        data.minutesAbsence = "00";
      }

      if (data.minutesAbsence == "" || !data.minutesAbsence) {
        data.minutesAbsence = "00";
      }

      val.forEach((date) => {
        let day_name = moment(date).format("ddd");
        if (day_name != "Sun" && day_name != "Sat") {
          let obj = {
            date: date,
            status: 0,
            hours: this.transformTimeToDecimal(
              data.hoursAbsence + ":" + data.minutesAbsence
            ),
          };
          abesnce_dates.push(obj);
          dates.push(date);
        }
      });

      let object = {
        Comment: data.Comment,
        startDate: first_date_in_week,
        endDate: last_date_in_week,
        AbsenceType: data.AbsenceType,
        absenceTypeName: AbsenceTypeObject["Name"],
        Color: AbsenceTypeObject["color"],
        cleanStartDate: first_date_in_week,
        cleanEndDate: last_date_in_week,
        hoursAbsence: data.hoursAbsence,
        minutesAbsence: data.minutesAbsence,
        week: index,
        dates: dates,
        abesnce_dates: abesnce_dates,
        group: data.group,
        images: index_ == 0 ? images : []
      };

      if (
        object.AbsenceType != "" &&
        object.startDate != "" &&
        object.endDate != "" &&
        object.absenceTypeName != ""
      ) {
        if (this.editing) {
          this.editingAbsence.AbsenceType = object.AbsenceType;
          this.editingAbsence.startDate = object.startDate;
          this.editingAbsence.endDate = object.endDate;
          this.editingAbsence.absenceTypeName = object.absenceTypeName;
          this.editingAbsence.Comment = object.Comment;
        }

        if (!this.editing) {
          this.absences.push(object);
          this.haveAbsences = true;
          this.initializeForm((this.dateWeek = ""));
          this.createForm.get("AbsenceType").patchValue("");
          this.createForm.get("absenceTypeName").patchValue("");
        }
      }
      index_ = 1;
    });

    this.toastr.success(
      this.translate.instant("You have successfully added Absences!"),
      this.translate.instant("Success")
    );
    this.files = [];
  }

  filterWeeks() {
    this.weeks_of_absences = this.weeks_of_absences.filter((week)=>{
      return this.absences.some((abs) => abs.week === week);
    });
  }

  removeProperty(index) {

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          if (!this.absences[index].StartDateChngRqst) {

            const filteredByWeeks = this.absences.filter((abs_)=>{
              return this.absences[index].week == abs_.week;
            });
            this.absences[index].shouldRemoveMessages = filteredByWeeks.length === 1 ? 1 : 0;

            this.spinner = true;
            this.timeRegistrationService
              .removeOldAbsence(this.absences[index])
              .subscribe((response) => {
                this.spinner = false;
                if (response["status"]) {

                  const data = this.absences[index];
                  const object = {
                    cleanStartDate: data.startDate.substring(0, 10),
                    cleanEndDate: data.endDate.substring(0, 10),
                  };

                  const difference = this.getDateDifference(
                    new Date(object.cleanStartDate),
                    new Date(object.cleanEndDate)
                  );
                  this.filterDifference(difference);

                  this.absences.splice(index, 1);
                  this.toastr.success(
                    this.translate.instant(
                      "You have successfully deleted Absence!"
                    ),
                    this.translate.instant("Success")
                  );

                  this.filterWeeks();

                }
              });


          }
        }
      });
  }

  private getAbsences() {
    this.spinner = true;
    this.timeRegistrationService
      .getTimesheetsAbsences()
      .subscribe((response) => {
        if (response["data"]) {
          this.spinner = false;
          this.absences = response["data"];

          this.weeks_of_absences = response["weeks"];
          this.haveAbsences = true;
          this.validation = false;

          if (this.notification_week) {
            this.openMessageModalIfNotification();
          }
        }
        if (response["dates"]) {
          this.dates = response["dates"];
        }
        this.spawnAbsenceModal();
      });
  }

  private openMessageModalIfNotification() {
    let absence = this.absences.filter((abs) => {
      return abs.week == this.notification_week;
    })[0];

    let index = this.absences.findIndex(
      (value) => value.week == this.notification_week
    );
    if (index != -1) {
      this.showMessage(absence, index);
    }
  }

  setAbsenceType(data) {
    let object = this.findObject(this.listOfAbsenceType, data);
    this.createForm.get("AbsenceType").patchValue(object["AbsenceTypeID"]);
    this.createForm.get("absenceTypeName").patchValue(object["Name"]);
  }

  private findObject(array, argument) {
    let obj = "";

    array.forEach(function (val, index) {
      if (val.AbsenceTypeID == argument.toString()) {
        obj = val;
      }
    });

    return obj;
  }

  private filterObjects(array) {
    let obj = [];

    array.forEach(function (val, index) {
      if (val && !val.Id) {
        obj.push(val);
      }
    });

    return obj;
  }

  showMessage(absence, index) {
    this.notification_week = null;
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { absence: absence };
    let week = this.absences[index].week;
    let openedcount = this.absences[index].messages.opened_count;

    if (openedcount[week]) {
      openedcount[week] = 0;
    }

    this.dialog
      .open(AbsenceMessagesComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res && res["status"]) this.absences.splice(index, 1);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getDateDifference(startDate, endDate) {

    let dates = [],
    currentDate = startDate,

    addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    while (currentDate <= endDate) {
      dates.push(moment(new Date(currentDate)).format("YYYY-MM-DD"));
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;

  }

  private filterDifference(difference: string[]) {
    const newDates = this.dates.filter((date) => {
      return !difference.includes(date);
    });

    this.dates = newDates;
  }

  openHasSeeneModal(absence) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "40%";
    diaolgConfig.data = {
      absence: absence,
    };

    return this.dialog
      .open(HasSeenModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (absence.isRejected === "1") {
          this.filterAbsenceBecauseRejected(absence.Id);
        }

        if (this.notSeenAbsences.length === this.absenceNumber) {
          this.notSeenAbsences = [];
        } else {
          this.absenceNumber = this.absenceNumber + 1;
          this.spawnAbsenceModal();
        }
      });
  }

  private spawnAbsenceModal() {
    const notSeen = this.absences.filter((abs) => {
      return (
        (abs.isRejected === "1" && abs.UserHasSeen === "0") ||
        (abs.Approved === "1" && abs.UserHasSeen === "0")
      );
    });

    this.notSeenAbsences = notSeen;

    this.openHasSeenModalRunner();
  }

  private openHasSeenModalRunner() {
    const absence = this.notSeenAbsences[this.absenceNumber];

    if (absence) {
      this.openHasSeeneModal(absence);
    }
  }

  private filterAbsenceBecauseRejected(Id: number) {
    this.absences = this.absences.filter((abs) => {
      return abs.Id !== Id;
    });
  }


  openImageModal() {
    let object = {
      content_type: "moment",
      content_id: null,
      type: "time-registration",
      images: this.files,
      type_id: null,
    };

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.maxHeight = "550px";
    diaolgConfig.data = { data: object, limit: 1, type: "image/*" };
    this.dialog
      .open(ImageModalOldComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.files = res.files.map((file)=>{
            return { ...file, album: 69420 };
          });
        }
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

    removeFile($event) {
        this.files = this.files.filter((file, index)=>{
            return index != $event;
        });
    }

    setStatus($event) {

        let hours = Number($event.target.value);

        if(hours == 8) {
            this.createForm.get('minutesAbsence').disable();
            this.createForm.get('minutesAbsence').setValue('00');
        }else {
            this.createForm.get('minutesAbsence').enable();
        }
    }
}

