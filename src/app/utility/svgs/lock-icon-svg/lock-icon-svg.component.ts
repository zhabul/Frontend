import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lock-icon-svg',
  templateUrl: './lock-icon-svg.component.html',
  styleUrls: ['./lock-icon-svg.component.css']
})
export class LockIconSvgComponent implements OnInit {

  @Input('color') color = '#b63418';

  constructor() { }

  ngOnInit(): void {
  }

}
