import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-remind-icon',
  templateUrl: './remind-icon.component.html',
  styleUrls: ['./remind-icon.component.css']
})
export class RemindIconComponent implements OnInit {

  @Input() color;

  constructor() { }

  ngOnInit(): void {
  }

}
