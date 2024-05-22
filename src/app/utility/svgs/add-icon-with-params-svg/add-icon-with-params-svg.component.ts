import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-icon-with-params-svg',
  templateUrl: './add-icon-with-params-svg.component.html',

})
export class AddIconWithParamsSvgComponent implements OnInit {
  public widthParams = 18;
  public heightParams = 18;
  public fillColorBackground = 'none'; //boja za backgorund add-icon
  public fillPulsBackground = '#373b40'; //Boja koja se koristi za plus
  @Input() hoverColor: string = 'var(--notification-border) !important;'; // Boja koja se koristi na hoveru



  @Input() set width(value) {
    this.widthParams = value;
  }
  @Input() set height(value) {
    this.heightParams = value;
  }
  @Input() set fill(value: string) {
    this.fillColorBackground = '#' + value;
  }
  @Input() set fillPuls(value: string) {
    this.fillPulsBackground = '#' + value;
  }
  constructor() { }

  ngOnInit(): void {
  }

}



