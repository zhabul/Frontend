import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-download-icon-svg',
  templateUrl: './download-icon-svg.component.html',
  styleUrls: ['./download-icon-svg.component.css']
})
export class DownloadIconSvgComponent implements OnInit {

  @Input('color') color = '#44484c';

  constructor() { }

  ngOnInit(): void {
  }

}
