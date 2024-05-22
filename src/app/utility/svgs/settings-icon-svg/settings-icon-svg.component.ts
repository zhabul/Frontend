import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-settings-icon-svg',
  templateUrl: './settings-icon-svg.component.html',
  styleUrls: ['./settings-icon-svg.component.css']
})
export class SettingsIconSvgComponent implements OnInit {

  @Input('color') color = '#44484c';

  constructor() { }

  ngOnInit(): void {
  }

}
