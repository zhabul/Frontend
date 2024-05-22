import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-send-svg-icon',
  templateUrl: './send-svg-icon.component.html',
  styleUrls: ['./send-svg-icon.component.css']
})
export class SendSvgIconComponent implements OnInit {

  public pathStyle = { fill: 'black' };
  @Input('color') set setColor(value) {
      this.pathStyle = { fill: value };
  };

  constructor() { }

  ngOnInit(): void {}

}
