import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NotSeenMessagesService } from 'src/app/not-seen-messages.service';

@Component({
  selector: 'app-schedule-calendar-navigation',
  templateUrl: './schedule-calendar-navigation.component.html',
  styleUrls: [
    './schedule-calendar-navigation.component.css', 
    '../../personal-statistics/personal-statistics.component.css',
    '../../time-registration-admin/user-details-admin/user-details-header.css'
  ]
})
export class ScheduleCalendarNavigationComponent implements OnInit {

  constructor(
    private router: Router,
    private notSeenMessagesService: NotSeenMessagesService,
    ) { }

  ngOnInit(): void {
    this.notSeenMessagesService.getNotSeenMessages();
    this.subToMessageCount();
    this.canAccessCalendar();
  }

  ngOnDestroy() {
    this.unsubFromNotSeenMessages();
  }

  public userDetails;
  public calendarIsVisible = false;
  canAccessCalendar() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    if (
      this.userDetails.create_timesheets_time_report_management ||
      this.userDetails.show_timesheets_time_report_management
    ) {
      this.calendarIsVisible = true;
    }
  }

  redirectToHome() {
    this.router.navigate([`/`]);
  }

  /*  tabs */  

  public tabs = [
    { name: 'Report time' },  
    /*{ name: 'Arbetad tid' },*/
    { name: 'Schema' }
  ];
  public selectedTab = 0;
  setSelectedTab(index) {
    this.selectedTab = index;
  }

  /* tabs */

  public messageCount = 0;
  private notSeenMessageSub;
  subToMessageCount() {
    this.notSeenMessageSub = this.notSeenMessagesService.messageCount$.subscribe((count)=>{
      this.messageCount = count;
    })
  }
  unsubFromNotSeenMessages() {
    if (this.notSeenMessageSub) {
      this.notSeenMessageSub.unsubscribe();
    }
  }


}
