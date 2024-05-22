import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-down-svg',
  templateUrl: './arrow-down-svg.component.html',
  styleUrls: ['./arrow-down-svg.component.css']
})
export class ArrowDownSvgComponent implements OnInit {

  @Input() color;

  constructor() { }

  ngOnInit(): void {
  }

}
