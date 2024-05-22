import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toggle-off-svg',
  templateUrl: './toggle-off-svg.component.html',
  styleUrls: ['./toggle-off-svg.component.css']
})
export class ToggleOffSvgComponent implements OnInit {
  
  public widthParams = 15;
  public heightParams = 8;
  @Input() set width(value) {
    this.widthParams = value;
  }
  @Input() set height(value) {
    this.heightParams = value;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
