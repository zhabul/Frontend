import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from "moment";
declare var $;

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css', '../user-details-admin/user-details-header.css']
})
export class PayrollComponent implements OnInit {

  public choosenDate: any;
  public language = "en";
  public userDetails;
  public userId;
  public checkedUsers = [];
  public checkedUsersIDS = [];

  setCheckedUsers(users) {
    this.checkedUsers = users;
    this.checkedUsersIDS = users.map(x => x.id)
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.setPayrollPermission();
    this.language = this.userDetails.language;
    this.subscribeToParamsChanges();
  }

  ngOnDestroy() {
    this.unsubFromParams();
  }

  public selectedType = [];
  onItemSelect($event) {
    this.selectedType = $event;
  }

  changeSelectedUser(user) {

  }

  getUserDetails() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  }
  public payrollVisibility;
  setPayrollPermission() {
    this.payrollVisibility = this.userDetails.create_timesheets_payroll;
    if (!this.payrollVisibility) {
      this.router.navigate(['/']);
    }
  }

  public paramsSub;
  public fromTimeRegistration = 0;
  subscribeToParamsChanges() {
    this.paramsSub = this.route.queryParams.subscribe((params) => {
      this.userId = params.puserid;
      this.fromTimeRegistration = params.fromTimeRegistration;
      this.choosenDate = params.pdate ? params.pdate : moment().format('YYYY-MM-DD');
      this.initializeDatePicker();
    });
  }
  unsubFromParams() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  initializeDatePicker() {
    $("#dateSelectStartDate")
      .datepicker({
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        format: "M-yyyy",
        startView: "months",
        minViewMode: "months",
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        this.choosenDate = moment(new Date(ev.date)).format('YYYY-MM-DD');

      });
  }

  nextDate() {
    const d = new Date(this.choosenDate);
    d.setMonth(d.getMonth() + 1, 1);
    const dt = new Date(d);

    $("#dateSelectStartDate").datepicker("setDate", dt);
    this.choosenDate = moment(dt).format('YYYY-MM-DD');
    this.setQueryParams();
  }

  previousDate() {
    const d = new Date(this.choosenDate);
    d.setMonth(d.getMonth() - 1, 1);
    const dt = new Date(d);

    $("#dateSelectStartDate").datepicker("setDate", dt);
    this.choosenDate = moment(dt).format('YYYY-MM-DD');
    this.setQueryParams();
  }

  setQueryParams() {
    const queryParams = { pdate: this.choosenDate };
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
  }

  setLink() {
    if (this.fromTimeRegistration == 1) {
      return `/moments/time-registration-admin`
    } else {
      return `/timesheets/time-registration-admin/user-detail/${this.userId}/${this.choosenDate}`;
    }
  }

  redirectToSingleCalendar() {
    this.router.navigate([
      this.setLink()
    ],
    {
      queryParamsHandling: "merge"
    });
  }
}
