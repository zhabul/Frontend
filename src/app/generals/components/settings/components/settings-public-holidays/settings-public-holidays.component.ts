import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { SettingsService } from "src/app/core/services/settings.service";
import { Holiday } from "../../interfaces/holiday";
import { GeneralsService } from "src/app/core/services/generals.service";
import * as moment from "moment";
declare let $;

@Component({
  selector: "app-settings-public-holidays",
  templateUrl: "./settings-public-holidays.component.html",
  styleUrls: ["./settings-public-holidays.component.css"],
})
export class SettingsPublicHolidaysComponent implements OnInit {
  newHoliday: Holiday;
  pickerTopPosition = 0;
  closeCalendar = false;
  loading = true;
  secondLoading = false;
  selectedDates = {
    selectedStartDate: new Date(),
    selectedEndDate: new Date(),
  };

  publicHolidays: Holiday[];
  public language = "en";
  public week = "Week";
  public presetColors;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public working_hours:number;

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private generalService: GeneralsService
  ) {}

  ngOnInit(): void {
    this.publicHolidays = [];

    this.generalService.getSingleGeneralByKey({'key': 'Working hours'}).subscribe((result:any)=> {
        if(result.status) {
            this.working_hours = Number(result['data'][0]['value']);
        }
    })

    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);

    this.settingsService.getDefaultHolidays().subscribe({
      next: (response) => {
        if (response.status) {
          this.publicHolidays = response.data;
          let first_record:any = this.publicHolidays[0];
          this.presetColors = first_record['color'];
          this.publicHolidays.forEach((holiday) => {
            holiday.old_start_date = holiday.start_date;
            holiday.old_end_date = holiday.end_date;
          });
          this.loading = false;

          setTimeout( () => {
            if (this.userDetails.create_settings_Global) {
               $("input").removeAttr('disabled');
            }else {
              $("input").attr('disabled','disabled');
            }
          }, 500 );

        }
        this.loading = false;
      },
      error: () => this.toastr.error(this.translate.instant("Server error")),
    });

    this.resetNewHoliday();
  }

  newStartDate(){
    $("#StartDateInput")
    .datepicker({
      format: "yyyy-mm-dd",
      calendarWeeks: true,
      autoclose: true,
      language: this.language,
      todayHighlight: true,
      currentWeek: true,
      showWeek: true,
      currentWeekTransl: this.translate.instant("Week"),
      currentWeekSplitChar: "-",
      weekStart: 1,
    })
    .on("changeDate", (ev) => {
      var newStartDate = ev.target.value.split(" ")[0];
      this.selectNewStartDate(newStartDate)
    });

    const datepicker = $("#StartDateInput") as any;
    datepicker.datepicker("setDate", moment().format("YYYY-MM-DD"));
    datepicker.datepicker("show");
  }

  newEndDate(){
    $("#EndDateInput")
    .datepicker({
      format: "yyyy-mm-dd",
      calendarWeeks: true,
      autoclose: true,
      language: this.language,
      todayHighlight: true,
      currentWeek: true,
      showWeek: true,
      currentWeekTransl: this.translate.instant("Week"),
      currentWeekSplitChar: "-",
      weekStart: 1,
    })
    .on("changeDate", (ev) => {
      var newEndDate = ev.target.value.split(" ")[0];
      this.selectNewEndDate(newEndDate)
    });

    const datepicker = $("#EndDateInput") as any;
    datepicker.datepicker("setDate", moment().format("YYYY-MM-DD"));
    datepicker.datepicker("show");
  }

  editStartDate(holiday, i){
    if(!holiday.edit){
      return;
    }

    var index = "#StartEditDateInput" + i;

    $(index)
    .datepicker({
      format: "yyyy-mm-dd",
      calendarWeeks: true,
      autoclose: true,
      language: this.language,
      todayHighlight: true,
      currentWeek: true,
      showWeek: true,
      currentWeekTransl: this.translate.instant("Week"),
      currentWeekSplitChar: "-",
      weekStart: 1,
    })
    .on("changeDate", (ev) => {
      var editStartDate = ev.target.value.split(" ")[0];
      this.selectHolidayStartDate(holiday, editStartDate)
    });

    const datepicker = $(index) as any;
    datepicker.datepicker("setDate", holiday.old_start_date.split(" ")[0]);
    datepicker.datepicker("show");
  }

  editEndDate(holiday, i){
    if(!holiday.edit){
      return;
    }

    var index = "#EndEditDateInput" + i;

    $(index)
    .datepicker({
      format: "yyyy-mm-dd",
      calendarWeeks: true,
      autoclose: true,
      language: this.language,
      todayHighlight: true,
      currentWeek: true,
      showWeek: true,
      currentWeekTransl: this.translate.instant("Week"),
      currentWeekSplitChar: "-",
      weekStart: 1,
    })
    .on("changeDate", (ev) => {
      var editEndDate = ev.target.value.split(" ")[0];
      this.selectHolidayEndDate(holiday, editEndDate)
    });

    const datepicker = $(index) as any;
    datepicker.datepicker("setDate", holiday.old_end_date.split(" ")[0]);
    datepicker.datepicker("show");
  }


  addHoliday() {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    if (
      this.newHoliday.name.length > 0 &&
      this.newHoliday.start_date.length > 0 &&
      this.newHoliday.end_date.length > 0 &&
      this.newHoliday.hours.length > 0
    ) {
      this.secondLoading = true;
      this.newHoliday.old_start_date = this.newHoliday.start_date;
      this.newHoliday.old_end_date = this.newHoliday.end_date;

      this.settingsService.addDefaultHolidays(this.newHoliday).subscribe({
        next: (response) => {
          if (response.status) {
            this.newHoliday.id = response.data;
            this.newHoliday.allow_delete = true;
            this.publicHolidays.push(this.newHoliday);
            this.resetNewHoliday();
            this.toastr.success(
              this.translate.instant("You successfully added public holiday.")
            );
            this.secondLoading = false;
          }
        },
        error: (err) => {
          this.toastr.error(this.translate.instant("Server error"));
        },
      });
    } else {
      this.toastr.info(this.translate.instant("Enter all fields"));
    }
  }

  editHoliday(holiday, i) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    holiday.edit = !holiday.edit;
    this.selectDates(holiday);
    holiday.startDateOpen = false;
    holiday.endDateOpen = false;
  }

  saveHoliday(holiday) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    if (holiday.name.length == 0) {
      this.toastr.info(this.translate.instant("Enter name"));
      return;
    }
    this.secondLoading = true;
    this.settingsService.updatePublicHoliday(holiday).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(
            this.translate.instant("You successfully updated public holiday.")
          );
          this.secondLoading = false;
        }
      },
      error: () => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });

    holiday.edit = false;
    holiday.startDateOpen = false;
    holiday.endDateOpen = false;
  }

  openCloseNewStartDate() {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.newStartDate();
    this.newHoliday.startDateOpen = !this.newHoliday.startDateOpen;
    this.newHoliday.endDateOpen = false;
    if (this.closeCalendar) {
      this.newHoliday.startDateOpen = false;
      this.closeCalendar = false;
    }
  }
  openCloseNewEndDate() {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.newEndDate();
    this.newHoliday.endDateOpen = !this.newHoliday.endDateOpen;
    this.newHoliday.startDateOpen = false;
    if (this.closeCalendar) {
      this.newHoliday.endDateOpen = false;
      this.closeCalendar = false;
    }
  }

  selectNewStartDate(dateString) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.newHoliday.start_date = this.getDefaultDateFormat(dateString);
    this.newHoliday.startDateOpen = false;
    this.closeCalendar = true;
  }

  selectNewEndDate(dateString) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.newHoliday.end_date = this.getDefaultDateFormat(dateString);
    this.newHoliday.endDateOpen = false;
    this.closeCalendar = true;
  }

  openCloseHolidayEndDate(holiday, i) {
    if (!this.userDetails.create_settings_Global || !holiday.edit) {
      return;
    }

    this.editEndDate(holiday, i);

    if (holiday.edit) {
      holiday.endDateOpen = !holiday.endDateOpen;
      holiday.startDateOpen = false;
    }
    if (this.closeCalendar) {
      holiday.endDateOpen = false;
      this.closeCalendar = false;
    }
  }

  openCloseHolidayStartDate(holiday, i ) {
    if (!this.userDetails.create_settings_Global || !holiday.edit) {
      return;
    }

    this.editStartDate(holiday, i);

    if (holiday.edit) {
      holiday.startDateOpen = !holiday.startDateOpen;
      holiday.endDateOpen = false;
    }
    if (this.closeCalendar) {
      holiday.startDateOpen = false;
      this.closeCalendar = false;
    }
  }

  selectHolidayEndDate(holiday, dateString) {
    if (!this.userDetails.create_settings_Global || !holiday.edit) {
      return;
    }
    holiday.end_date = this.getDefaultDateFormat(dateString);
    this.selectDates(holiday);
    holiday.endDateOpen = false;
    this.closeCalendar = true;
  }

  selectHolidayStartDate(holiday, dateString) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    holiday.start_date = this.getDefaultDateFormat(dateString);
    holiday.startDateOpen = false;
    this.selectDates(holiday);
    this.closeCalendar = true;
  }

  getDateObject(dateString) {
    let test = new Date(dateString);
    return test;
  }

  selectDates(holiday) {
    this.selectedDates.selectedStartDate = new Date(
      holiday.start_date.split(" ")[0]
    );
    this.selectedDates.selectedEndDate = new Date(
      holiday.end_date.split(" ")[0]
    );
  }

  deleteHoliday(i: number) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "auto";
    dialogConfig.panelClass = "mat-dialog-confirmation";
    dialogConfig.data = {
      questionText: this.translate.instant(
        "Do you really want to delete this holiday?"
      ),
    };
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.deletePublicHolidayReq(i);
        }
      });
  }

  getDefaultDateFormat(dateString: string) {
    let date = new Date(dateString);
    let formatedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");
    let week = moment(formatedDate).week();
    return `${formatedDate} Week ${week.toString()}`;
  }

  deletePublicHolidayReq(i: number) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.secondLoading = true;
    this.settingsService
      .deletePublicHolidays(this.publicHolidays[i])
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.publicHolidays.splice(i, 1);
            this.toastr.success(
              this.translate.instant("You successfully deleted public holiday.")
            );
            this.secondLoading = false;
          }
        },

        error: (err) => {
          this.toastr.error(this.translate.instant("Server error"));
        },
      });
  }

  resetNewHoliday() {
    this.newHoliday = {
      id: "",
      name: "",
      hours: "",
      startDateOpen: false,
      endDateOpen: false,
      start_date: "",
      end_date: "",
      old_start_date: "",
      old_end_date: "",
      edit: false,
    };
  }

    changeColor(color) {
        if (!this.userDetails.create_settings_Global) {
        return;
        }
        this.loading = true;
        let col:any = '"'+color+'"';

        this.settingsService.changePublicAbsenceTypeColor(col).subscribe((response) => {
            if (response.status) {
                this.loading = false;
                this.toastr.success(
                  this.translate.instant("You have successfully edited Absence!")
                );
            }
        });
    }

    refreshColor(color){

        if(color != undefined) {
            this.presetColors = color
        }
    }

    checkHour(hours) {

        if(hours && hours.length > 0) {
            hours = Number(hours);

            if(hours > this.working_hours) {
                hours = this.working_hours;
                this.newHoliday.hours = hours.toString();
            }
        }

    }
}
