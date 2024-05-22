import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-delete-icon-svg',
  templateUrl: './delete-icon-svg.component.html',
  styleUrls: ['./delete-icon-svg.component.css']
})
export class DeleteIconSvgComponent implements OnInit {

  @Input('color') color = 'red';

  constructor() { }

  ngOnInit(): void {
  }

}
