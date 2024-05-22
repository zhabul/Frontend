import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sps-hex-svg',
  templateUrl: './sps-hex-svg.component.html',
  styleUrls: ['./sps-hex-svg.component.css']
})
export class SpsHexSvgComponent implements OnInit {

  @Input('color') color = '#f0e264';

  constructor() { }

  ngOnInit(): void {
  }

}
