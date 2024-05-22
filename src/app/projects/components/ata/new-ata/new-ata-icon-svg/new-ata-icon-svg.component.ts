import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-new-ata-icon-svg',
  templateUrl: './new-ata-icon-svg.component.html',
  styleUrls: ['./new-ata-icon-svg.component.css']
})
export class NewAtaIconSvgComponent implements OnInit {

  @Input('color') color;

  constructor() { }

  ngOnInit(): void {
  }

}
