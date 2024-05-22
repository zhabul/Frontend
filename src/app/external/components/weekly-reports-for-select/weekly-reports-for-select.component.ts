import { Component, Inject, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { ToastrService } from "ngx-toastr";
declare var $;

@Component({
  selector: 'app-weekly-reports-for-select',
  templateUrl: './weekly-reports-for-select.component.html',
  styleUrls: ['./weekly-reports-for-select.component.css']
})
export class WeeklyReportsForSelectComponent implements OnInit {

    public weekly_reports:any[] = [];
    public reminder_weekly_reports:any[] = [];
    public checked_wr:any[] = [];
    public week = "Week";
    public language = "en";
    public active_weekly_report:any = null;
    public client_workers:any[] = [];
    public contacts:any[] = [];
    public buttonToggle = false;
    public project:any;
    public buttonName = "";
    public bdrop:any;
    public changeAllData:any;
    public active_weekly_report_table_type:any;
    public spinner:boolean = false;

    constructor(
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<WeeklyReportsForSelectComponent>,
        private projectsService: ProjectsService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public modal_data: any,
        private dialog: MatDialog,
    ){
        this.language = sessionStorage.getItem("lang");
        this.translate.use(this.language);
        this.client_workers = this.modal_data.data.client_workers;
        this.contacts = this.modal_data.data.contacts;
        this.project = this.modal_data.data.project;
    }

    ngOnInit(): void {
      this.spinner = true;
      this.getWeeklyReports();
    }

    checkToReminder($event, type, index){
        let checked = 0;
        if($event.target.checked) {
            checked = 1;
        }

        if(type== 'reminder_weekly_reports') {
            this.reminder_weekly_reports[index].reminder = checked;
        }else{
            this.weekly_reports[index].reminder = checked;
        }
    }

    checkIfContactSelected(contact) {

        if (this.contacts.some((selectedWorker) =>selectedWorker.Id == contact.Id)) {
            return true;
        } else {
            return false;
        }
    }

    buttonNameSummary(event, worker = null) {

        if(this.weekly_reports.length == 0 && this.reminder_weekly_reports.length == 0 ){
            this.toastr.info(
                this.translate.instant(
                  "There are currently no KS's ready to send"
                ) + ".",
                this.translate.instant("Info")
              );
            return false
        }

        event.stopPropagation();

        if (worker) {
            this.buttonToggle = true;
        if (
            this.contacts.some((selectedWorker) => selectedWorker.Id == worker.Id)
        ) {

            this.contacts.splice(this.contacts.indexOf(worker), 1);
        } else {
            this.contacts.push(worker);
        }
        } else {
            this.buttonToggle = !this.buttonToggle;
            if (this.buttonToggle == true) {
                this.buttonName = "Hide";
            } else {
                this.buttonName = "";
            }
        }
    }
    setActiveWeeklyReport(index, type) {
        this.active_weekly_report = index;
        this.active_weekly_report_table_type = type;
    }

    initializeDueDate() {
        const dateToday = new Date();

        setTimeout(() => {
            $(".dueDate")
              .datepicker({
                format: "yyyy-mm-dd",
                calendarWeeks: true,
                autoclose: true,
                language: this.language,
                todayHighlight: true,
                currentWeek: true,
                currentWeekTransl: this.language === "en" ? "Week" : "Vecka",
                currentWeekSplitChar: "-",
                startDate: dateToday,
                weekStart: 1
              })
              .on("changeDate", (ev) => {
                if(this.active_weekly_report != null) {
                    if(this.active_weekly_report_table_type == 'weekly_reports') {
                        this.weekly_reports[this.active_weekly_report].dueDate = ev.target.value;
                    }else {
                        this.reminder_weekly_reports[this.active_weekly_report].dueDate = ev.target.value;
                    }

                    this.active_weekly_report = null;
                    this.active_weekly_report_table_type = null;
                }
              });
        }, 500);

        setTimeout(() => {
            $(".change-all-due-date")
              .datepicker({
                format: "yyyy-mm-dd",
                calendarWeeks: true,
                autoclose: true,
                language: this.language,
                todayHighlight: true,
                currentWeek: true,
                currentWeekTransl: this.language === "en" ? "Week" : "Vecka",
                currentWeekSplitChar: "-",
                startDate: dateToday,
                weekStart: 1
              })
              .on("changeDate", (ev) => {
                this.weekly_reports.forEach((wr: any) => {
                    wr.dueDate = ev.target.value;
                });
                this.reminder_weekly_reports.forEach((wr: any) => {
                    wr.dueDate = ev.target.value;
                });
              });
        }, 500);
    }

    getWeeklyReports() {
      this.projectsService.getWeeklyReportsForSelect(this.modal_data.data.project_id, this.modal_data.data.type).then((res)=> {
          if(res['status']) {
              this.spinner = false;
              this.weekly_reports = res['data'];
              this.reminder_weekly_reports = res['reminder_data'];
              this.initializeDueDate();
          }
      });
    }

    sendWeeklyReports() {
        const check = this.weekly_reports.every(({is_checked })=> !is_checked)
        const check1 = this.reminder_weekly_reports.every(({is_checked })=> !is_checked)

        if(check && check1)
            {
                this.toastr.info(
                    this.translate.instant(
                      "Nothing is checked"
                    ) + ".",
                    this.translate.instant("Info")
                  );
                return false
            }


        if (this.contacts.length < 1 ) {
          return this.toastr.info(
            this.translate.instant(
              "You first need to select an email where to send documents"
            ) + ".",
            this.translate.instant("Info")
          );
        }
        if (this.contacts.length >= 1 &&!this.contacts.some((contact) => contact.Id == this.project["selectedMainContact"])){
            return this.toastr.info(
                this.translate.instant("TSC_main_contact_email_has_to_be_selected"),
                this.translate.instant("Info")
            );
        }

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog.open(ConfirmationModalComponent, diaolgConfig)
        .afterClosed()
        .subscribe((response) => {


        if(response.result){
            this.spinner = true;
            let weekly_reports = this.weekly_reports.filter((n) => {
                return n.is_checked == true;
            });
            let reminder_weekly_reports = this.reminder_weekly_reports.filter((n) => {
                return n.is_checked == true;
            });

            const wr_for_send = weekly_reports.concat(reminder_weekly_reports);

            this.contacts.sort((a, b) => {
              return Number(a.sort) - Number(b.sort);
            })

            let object = {
                'coworkers': this.contacts,
                'weekly_reports': wr_for_send,
                'project_id': this.modal_data.data.project_id,
                'reminder': 0,
                'from': this.modal_data.data.from,
                'project_name': this.project.name
            }

            this.projectsService.sendWeeklyReports(object).then((res)=> {
                this.spinner = false;
                this.close(true);
            });
        }
        });
    }

    close(parameter = false) {
        this.dialogRef.close(parameter);
    }

    checkWeeklyReport($event, index, type) {
        if(type== 'reminder_weekly_reports') {
            this.reminder_weekly_reports[index].is_checked = $event.target.checked;
        }else{
            this.weekly_reports[index].is_checked = $event.target.checked;
        }
    }

}
