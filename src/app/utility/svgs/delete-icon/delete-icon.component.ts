import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-delete-icon',
  templateUrl: './delete-icon.component.html',
})
export class DeleteIconComponent implements OnInit {
  public widthParams = 26;
  public heightParams = 26;
  public colorParams = "#03D156"
  @Input() set width(value) {
    this.widthParams = value;
  }
  @Input() set height(value) {
    this.heightParams = value;
  }

  @Input() set color(value) {
    this.colorParams = '#' + value;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
