import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
    selector: 'app-main-company',
    templateUrl: './main-company.component.html',
    styleUrls: ['./main-company.component.css']
})

export class MainCompanyComponent implements OnInit {

    @Input() isSelectedCompany;
    @Input() CompanyNames;
    @Input() userDetails;
    @Input() loadData;
    @Input() initProvider;
    @Input() selectId;
    @Input() authService;
    public previousRoute: string;
    public userScalableToggle;
    public planningColor = "planning-color";
    public projectColor = "project-color";
    public timesheetColor = "timesheet-color";
    public WindowHeight;
    public WindowWidth;

    constructor() { }

    ngOnInit(): void {
      this.WindowHeight = window.innerHeight;
      this.WindowWidth = window.innerWidth;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
      this.WindowHeight = window.innerHeight;
      this.WindowWidth = window.innerWidth;
    }

    planningEnter() {
        this.planningColor = "planning-color-hover";
    }

    planningLeave() {
        this.planningColor = "planning-color";
    }

    projectEnter() {
        this.projectColor = "project-color-hover";
    }

    projectLeave() {
        this.projectColor = "project-color";
    }

    timesheetEnter() {
        this.timesheetColor = "timesheet-color-hover";
    }

    timesheetLeave() {
        this.timesheetColor = "timesheet-color";
    }

    selectedCompany(event) {

        if(event && event.id) {
          this.isSelectedCompany = true;
          if (this.isSelectedCompany === true) {
            document.getElementById("sidebar-wrapper").style.display = "block";
          }
          this.selectId = event.id;
          let data = {
            'company_id': event.id
          };
          this.authService.updateUserCompany(data).then((res)=> {
            if(res) {
              window.location.reload();
            }
          });
        }
      }
}
