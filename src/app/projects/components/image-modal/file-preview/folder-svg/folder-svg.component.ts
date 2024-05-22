import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-folder-svg',
  templateUrl: './folder-svg.component.html',
  styleUrls: ['./folder-svg.component.css']
})
export class FolderSvgComponent implements OnInit {

  @Input("modalType") modalType = "default";
  constructor() { }

  ngOnInit() {
  }

}
