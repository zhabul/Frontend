import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-empty-calendar-row',
  templateUrl: './empty-calendar-row.component.html',
  styleUrls: ['./empty-calendar-row.component.css', '../user-details-admin.component.css']
})
export class EmptyCalendarRowComponent implements OnInit {

  @Input('calendar') calendar;

  constructor() { }

  ngOnInit(): void {
  }

}
