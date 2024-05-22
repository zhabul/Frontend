import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-send-icon-svg',
  templateUrl: './send-icon-svg.component.html',
  styleUrls: ['./send-icon-svg.component.css']
})
export class SendIconSvgComponent implements OnInit {

  @Input('color') color = '#44484c';

  constructor() { }

  ngOnInit(): void {
  }
}