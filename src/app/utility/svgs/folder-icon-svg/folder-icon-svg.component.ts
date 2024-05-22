import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-folder-icon-svg',
  templateUrl: './folder-icon-svg.component.html',
  styleUrls: ['./folder-icon-svg.component.css']
})
export class FolderIconSvgComponent implements OnInit {

  @Input('saveStyle') saveStyle;

  constructor() { }

  ngOnInit(): void {
  }

}
