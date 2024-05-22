import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-selected-icon-svg',
  templateUrl: './selected-icon-svg.component.html',
  styleUrls: ['./selected-icon-svg.component.css']
})
export class SelectedIconSvgComponent implements OnInit {

  @Input('color') color;

  constructor() { }

  ngOnInit(): void {
  }

}
