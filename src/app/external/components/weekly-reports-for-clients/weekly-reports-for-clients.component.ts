import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "src/app/core/services/projects.service";
import { ActivatedRoute, Router } from "@angular/router";
import { interval, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-weekly-reports-for-clients',
  templateUrl: './weekly-reports-for-clients.component.html',
  styleUrls: ['./weekly-reports-for-clients.component.css']
})
export class WeeklyReportsForClientsComponent implements OnInit {

    public weekly_reports: any = [];
    public reminder_weekly_reports: any = [];
    public worker_email:any;
    public project_id:number = 0;
    public client_id:number = 0;
    public token:any;
    public number_of_email_logs:any[] = [];
    public number_of_client_workers:number = 0;
    public spinner:boolean = true;
    public subscription: Subscription;
    public from:any;
    public project_name:any = '';
    public sending_date:any = '';
    public due_date:any = '';
    public lang:any = null;
    public empty_data:boolean = false;

    constructor(
        private projectsService: ProjectsService,
        private route: ActivatedRoute,
        public translate: TranslateService,
        private router: Router) {}

    ngOnInit(): void {
        this.worker_email = this.route.params["value"]["email"];
        this.client_id = Number(this.route.params["value"]["client_id"]);
        this.from = this.route.params["value"]['from'];
        this.token = this.route.params["value"]["token"];
        this.project_id = Number(this.route.params["value"]["project_id"]); 
        const source = interval(10000);
        this.subscription = source.subscribe((val) => {
          this.get_weekly_reports();
        }); 

        this.get_weekly_reports();
    }

    get_weekly_reports() {
        this.projectsService.get_weekly_reports(this.project_id, this.token, this.worker_email, this.client_id, this.from).then((res) => {

            if(res['status']) {
                this.weekly_reports = res['data'];
                this.reminder_weekly_reports = res['reminder_data'];
                this.number_of_email_logs = res['number_of_email_logs'];

                if(this.weekly_reports.length == 0 && this.reminder_weekly_reports.length == 0) {
                    this.empty_data = true;
                    this.spinner = false;
                    return true;
                }

                this.number_of_client_workers = this.number_of_email_logs.length;
                if(!this.lang) {
                    this.lang = res['company_details']['Language'].toLowerCase();
                    this.translate.use(this.lang);
                }
                this.spinner = false;

                if(this.weekly_reports.length > 0 ) {
                    this.project_name = this.weekly_reports[0].project_name;
                    this.sending_date = this.weekly_reports[0].sending_date;
                    this.due_date = this.weekly_reports[0].due_date;
                }

                if(this.reminder_weekly_reports.length > 0 ) {
                    this.project_name = this.reminder_weekly_reports[0].project_name;
                    this.sending_date = this.reminder_weekly_reports[0].sending_date;
                    this.due_date = this.reminder_weekly_reports[0].due_date;
                }
            }
        });
    }


    openExternalLink(weekly_report) {
        
        if(weekly_report.allow_answer && (weekly_report.reminder > 0 || weekly_report.avaible_cw_ids.includes(this.client_id))) {
            this.router.navigate(["external/weekly_report/", weekly_report.wr_id, this.worker_email, this.client_id, weekly_report.email_log_token, this.token]);
        }
    }
}
